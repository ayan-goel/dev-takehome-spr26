"use client";

import { RequestStatus } from "@/lib/types/request";
import Dropdown from "@/components/atoms/Dropdown";

export interface TableItemRequest {
  _id: string;
  requestorName: string;
  itemRequested: string;
  createdDate: string;
  lastEditedDate: string;
  status: RequestStatus;
}

interface ItemRequestsTableProps {
  requests: TableItemRequest[];
  onStatusChange: (id: string, status: RequestStatus) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

function formatDate(date: string | null): string {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

function Checkbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`
        w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200
        ${checked
          ? "bg-primary border-primary"
          : indeterminate
            ? "bg-white border-primary"
            : "bg-white border-gray-stroke hover:bg-primary-fill"
        }
      `}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {indeterminate && !checked && (
        <div className="w-2.5 h-0.5 bg-primary rounded" />
      )}
    </div>
  );
}

export default function ItemRequestsTable({
  requests,
  onStatusChange,
  selectedIds,
  onSelectionChange,
}: ItemRequestsTableProps) {
  const allSelected = requests.length > 0 && requests.every((r) => selectedIds.has(r._id));
  const someSelected = requests.some((r) => selectedIds.has(r._id));

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(requests.map((r) => r._id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-text">
        No requests found.
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-visible">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-stroke bg-gray-fill-light">
              <th className="py-3 px-4" style={{ width: '5%' }}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-left py-3 px-4 text-gray-text font-normal text-sm" style={{ width: '21%' }}>
                Name
              </th>
              <th className="text-left py-3 px-4 text-gray-text font-normal text-sm" style={{ width: '28%' }}>
                Item Requested
              </th>
              <th className="text-left py-3 px-4 text-gray-text font-normal text-sm" style={{ width: '16%' }}>
                Created
              </th>
              <th className="text-left py-3 px-4 text-gray-text font-normal text-sm" style={{ width: '16%' }}>
                Updated
              </th>
              <th className="text-left py-3 px-4 text-gray-text font-normal text-sm" style={{ width: '14%' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => {
              const isSelected = selectedIds.has(request._id);
              return (
                <tr
                  key={request._id}
                  className={`
                    ${index < requests.length - 1 ? "border-b border-gray-stroke" : ""}
                    ${isSelected ? "bg-primary-fill" : ""}
                  `}
                >
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectRow(request._id)}
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-text-dark">
                    {request.requestorName}
                  </td>
                  <td className="py-3 px-4 text-gray-text-dark">
                    {request.itemRequested}
                  </td>
                  <td className="py-3 px-4 text-gray-text-dark">
                    {formatDate(request.createdDate)}
                  </td>
                  <td className="py-3 px-4 text-gray-text-dark">
                    {formatDate(request.lastEditedDate ?? request.createdDate)}
                  </td>
                  <td className="py-3 px-4">
                    <Dropdown
                      value={request.status}
                      onChange={(status) => onStatusChange(request._id, status)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 p-4">
        {requests.map((request) => {
          const isSelected = selectedIds.has(request._id);
          return (
            <div
              key={request._id}
              className={`border border-gray-stroke rounded-lg p-4 space-y-3 ${
                isSelected ? "bg-primary-fill" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleSelectRow(request._id)}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-text-dark">
                    {request.requestorName}
                  </p>
                  <p className="text-sm text-gray-text">
                    {request.itemRequested}
                  </p>
                </div>
                <Dropdown
                  value={request.status}
                  onChange={(status) => onStatusChange(request._id, status)}
                />
              </div>
              <div className="flex gap-4 text-sm text-gray-text ml-8">
                <span>Created: {formatDate(request.createdDate)}</span>
                <span>
                  Updated: {formatDate(request.lastEditedDate ?? request.createdDate)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
