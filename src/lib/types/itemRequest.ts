import { ObjectId } from "mongodb";
import { RequestStatus } from "./request";

export interface ItemRequest {
  _id: ObjectId;
  requestorName: string;
  itemRequested: string;
  createdDate: Date;
  lastEditedDate: Date;
  status: RequestStatus;
}

export interface CreateItemRequestBody {
  requestorName: string;
  itemRequested: string;
}

export interface EditStatusRequestBody {
  id: string;
  status: RequestStatus;
}

export interface BatchEditRequestBody {
  ids: string[];
  status: RequestStatus;
}

export interface BatchDeleteRequestBody {
  ids: string[];
}
