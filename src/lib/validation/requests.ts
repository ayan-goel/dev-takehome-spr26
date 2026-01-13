import {
  CreateItemRequestBody,
  EditStatusRequestBody,
  BatchEditRequestBody,
  BatchDeleteRequestBody,
} from "@/lib/types/itemRequest";
import { RequestStatus } from "@/lib/types/request";

function isValidString(str: unknown, lower?: number, upper?: number): boolean {
  if (typeof str !== "string" || str.trim() === "") {
    return false;
  }
  if ((lower && str.length < lower) || (upper && str.length > upper)) {
    return false;
  }
  return true;
}

function isValidRequestorName(name: unknown): boolean {
  return isValidString(name, 3, 30);
}

function isValidItemRequested(item: unknown): boolean {
  return isValidString(item, 2, 100);
}

export function validateCreateItemRequest(
  request: unknown
): CreateItemRequestBody | null {
  if (!request || typeof request !== "object") {
    return null;
  }

  const req = request as Record<string, unknown>;

  if (!req.requestorName || !req.itemRequested) {
    return null;
  }

  if (
    !isValidRequestorName(req.requestorName) ||
    !isValidItemRequested(req.itemRequested)
  ) {
    return null;
  }

  return {
    requestorName: req.requestorName as string,
    itemRequested: req.itemRequested as string,
  };
}

function isValidObjectId(id: unknown): boolean {
  if (typeof id !== "string") return false;
  return /^[a-fA-F0-9]{24}$/.test(id);
}

function isValidStatus(status: unknown): status is RequestStatus {
  if (typeof status !== "string") return false;
  return Object.values(RequestStatus).includes(status as RequestStatus);
}

export function validateEditStatusRequest(
  request: unknown
): EditStatusRequestBody | null {
  if (!request || typeof request !== "object") {
    return null;
  }

  const req = request as Record<string, unknown>;

  if (!req.id || !req.status) {
    return null;
  }

  if (!isValidObjectId(req.id) || !isValidStatus(req.status)) {
    return null;
  }

  return {
    id: req.id as string,
    status: req.status,
  };
}

function isValidIdsArray(ids: unknown): ids is string[] {
  if (!Array.isArray(ids) || ids.length === 0) return false;
  return ids.every((id) => isValidObjectId(id));
}

export function validateBatchEditRequest(
  request: unknown
): BatchEditRequestBody | null {
  if (!request || typeof request !== "object") {
    return null;
  }

  const req = request as Record<string, unknown>;

  if (!req.ids || !req.status) {
    return null;
  }

  if (!isValidIdsArray(req.ids) || !isValidStatus(req.status)) {
    return null;
  }

  return {
    ids: req.ids,
    status: req.status,
  };
}

export function validateBatchDeleteRequest(
  request: unknown
): BatchDeleteRequestBody | null {
  if (!request || typeof request !== "object") {
    return null;
  }

  const req = request as Record<string, unknown>;

  if (!req.ids) {
    return null;
  }

  if (!isValidIdsArray(req.ids)) {
    return null;
  }

  return {
    ids: req.ids,
  };
}
