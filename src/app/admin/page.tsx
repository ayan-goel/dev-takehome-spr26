"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ItemRequestsTable, {
  TableItemRequest,
} from "@/components/tables/ItemRequestsTable";
import Pagination from "@/components/molecules/Pagination";
import { RequestStatus } from "@/lib/types/request";
import { PAGINATION_PAGE_SIZE } from "@/lib/constants/config";

type StatusTab = "all" | RequestStatus;

const TABS: { value: StatusTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: RequestStatus.PENDING, label: "Pending" },
  { value: RequestStatus.APPROVED, label: "Approved" },
  { value: RequestStatus.COMPLETED, label: "Completed" },
  { value: RequestStatus.REJECTED, label: "Rejected" },
];

const statusConfig: Record<
  RequestStatus,
  { label: string; bgColor: string; dotColor: string; textColor: string }
> = {
  [RequestStatus.COMPLETED]: {
    label: "Completed",
    bgColor: "bg-success-fill",
    dotColor: "bg-success-indicator",
    textColor: "text-success-text",
  },
  [RequestStatus.PENDING]: {
    label: "Pending",
    bgColor: "bg-negative-fill",
    dotColor: "bg-negative-indicator",
    textColor: "text-negative-text",
  },
  [RequestStatus.APPROVED]: {
    label: "Approved",
    bgColor: "bg-warning-fill",
    dotColor: "bg-warning-indicator",
    textColor: "text-warning-text",
  },
  [RequestStatus.REJECTED]: {
    label: "Rejected",
    bgColor: "bg-danger-fill",
    dotColor: "bg-danger-indicator",
    textColor: "text-danger-text",
  },
};

function MarkAsDropdown({
  onSelect,
  disabled,
}: {
  onSelect: (status: RequestStatus) => void;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-text">Mark As</span>
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            inline-flex items-center justify-between gap-4 px-3 py-2 min-w-[120px]
            bg-white border border-gray-stroke rounded-lg
            transition-all duration-200
            hover:bg-primary-fill
            ${isOpen ? "bg-primary-fill border-primary shadow-[0_0_0_4px_rgba(0,112,255,0.1)]" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <span className="text-sm text-gray-text-dark">Status</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 z-50 bg-white border border-gray-stroke rounded-lg shadow-lg py-1 min-w-[140px]">
            {Object.values(RequestStatus).map((status) => {
              const config = statusConfig[status];
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    onSelect(status);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center"
                >
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-2xl ${config.bgColor}`}>
                    <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                    <span className={`text-sm ${config.textColor}`}>{config.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        p-2 rounded-lg
        transition-all duration-200
        hover:bg-primary-fill
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <svg className="w-5 h-5 text-gray-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}

export default function ItemRequestsPage() {
  const [requests, setRequests] = useState<TableItemRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (activeTab !== "all") {
        params.set("status", activeTab);
      }

      const response = await fetch(`/api/request?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data);

      if (data.length < PAGINATION_PAGE_SIZE && page === 1) {
        setTotalRecords(data.length);
      } else if (data.length < PAGINATION_PAGE_SIZE) {
        setTotalRecords((page - 1) * PAGINATION_PAGE_SIZE + data.length);
      } else {
        setTotalRecords(Math.max(totalRecords, page * PAGINATION_PAGE_SIZE + 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [page, activeTab, totalRecords]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page, activeTab]);

  const handleTabChange = (tab: StatusTab) => {
    setActiveTab(tab);
    setPage(1);
    setTotalRecords(0);
  };

  const handleStatusChange = async (id: string, status: RequestStatus) => {
    try {
      const response = await fetch("/api/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status } : req))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleBatchStatusChange = async (status: RequestStatus) => {
    if (selectedIds.size === 0) return;

    try {
      const response = await fetch("/api/request/batch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds), status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update statuses");
      }

      setRequests((prev) =>
        prev.map((req) =>
          selectedIds.has(req._id) ? { ...req, status } : req
        )
      );
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Failed to batch update status:", err);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;

    try {
      const response = await fetch("/api/request/batch", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete requests");
      }

      setRequests((prev) => prev.filter((req) => !selectedIds.has(req._id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Failed to batch delete:", err);
    }
  };

  const hasSelection = selectedIds.size > 0;

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-stroke">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-medium">Item Requests</h1>
          <div className="flex items-center gap-4">
            <MarkAsDropdown
              onSelect={handleBatchStatusChange}
              disabled={!hasSelection}
            />
            <div className="h-6 w-px bg-gray-stroke" />
            <DeleteButton
              onClick={handleBatchDelete}
              disabled={!hasSelection}
            />
          </div>
      </div>

        <div className="px-4 border-b border-gray-stroke">
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`
                  px-8 py-3 text-base font-medium rounded-t-md transition-all duration-200 -mb-px
                  ${
                    activeTab === tab.value
                      ? "bg-primary text-white"
                      : "bg-[#e4e7ec] text-gray-text-dark hover:bg-primary-fill"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-text">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-danger-text">Error: {error}</div>
        ) : (
          <>
            <ItemRequestsTable
              requests={requests}
              onStatusChange={handleStatusChange}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
            <div className="p-4 flex justify-end border-t border-gray-stroke">
              <Pagination
                pageNumber={page}
                pageSize={PAGINATION_PAGE_SIZE}
                totalRecords={totalRecords}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
