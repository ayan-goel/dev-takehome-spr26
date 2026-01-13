import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db/mongodb";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";
import { InvalidInputError } from "@/lib/errors/inputExceptions";
import { ItemRequest } from "@/lib/types/itemRequest";
import { RequestStatus } from "@/lib/types/request";
import {
  validateCreateItemRequest,
  validateEditStatusRequest,
  validateBatchEditRequest,
  validateBatchDeleteRequest,
} from "@/lib/validation/requests";

const COLLECTION_NAME = "requests";

export async function getItemRequests(
  page: number,
  status?: RequestStatus
): Promise<ItemRequest[]> {
  const collection = await getCollection(COLLECTION_NAME);
  const skip = (page - 1) * PAGINATION_PAGE_SIZE;

  const filter = status ? { status } : {};

  const requests = await collection
    .find(filter)
    .sort({ createdDate: -1 })
    .skip(skip)
    .limit(PAGINATION_PAGE_SIZE)
    .toArray();

  return requests as unknown as ItemRequest[];
}

export async function createItemRequest(
  requestBody: unknown
): Promise<ItemRequest> {
  const validatedRequest = validateCreateItemRequest(requestBody);

  if (!validatedRequest) {
    throw new InvalidInputError("create item request");
  }

  const collection = await getCollection(COLLECTION_NAME);
  const now = new Date();

  const newRequest = {
    requestorName: validatedRequest.requestorName,
    itemRequested: validatedRequest.itemRequested,
    createdDate: now,
    lastEditedDate: now,
    status: RequestStatus.PENDING,
  };

  const result = await collection.insertOne(newRequest);

  return {
    _id: result.insertedId,
    ...newRequest,
  };
}

export async function updateItemRequestStatus(
  requestBody: unknown
): Promise<ItemRequest> {
  const validatedRequest = validateEditStatusRequest(requestBody);

  if (!validatedRequest) {
    throw new InvalidInputError("edit status request");
  }

  const collection = await getCollection(COLLECTION_NAME);
  const now = new Date();

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(validatedRequest.id) },
    { $set: { status: validatedRequest.status, lastEditedDate: now } },
    { returnDocument: "after" }
  );

  if (!result) {
    throw new InvalidInputError("request ID not found");
  }

  return result as unknown as ItemRequest;
}

export async function batchUpdateStatus(
  requestBody: unknown
): Promise<{ modifiedCount: number }> {
  const validatedRequest = validateBatchEditRequest(requestBody);

  if (!validatedRequest) {
    throw new InvalidInputError("batch edit request");
  }

  const collection = await getCollection(COLLECTION_NAME);
  const now = new Date();
  const objectIds = validatedRequest.ids.map((id) => new ObjectId(id));

  const result = await collection.updateMany(
    { _id: { $in: objectIds } },
    { $set: { status: validatedRequest.status, lastEditedDate: now } }
  );

  return { modifiedCount: result.modifiedCount };
}

export async function batchDeleteRequests(
  requestBody: unknown
): Promise<{ deletedCount: number }> {
  const validatedRequest = validateBatchDeleteRequest(requestBody);

  if (!validatedRequest) {
    throw new InvalidInputError("batch delete request");
  }

  const collection = await getCollection(COLLECTION_NAME);
  const objectIds = validatedRequest.ids.map((id) => new ObjectId(id));

  const result = await collection.deleteMany({ _id: { $in: objectIds } });

  return { deletedCount: result.deletedCount };
}
