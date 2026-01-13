"use client";

import React, { useState, useRef, useEffect } from "react";
import { RequestStatus } from "@/lib/types/request";

interface DropdownProps {
  value: RequestStatus;
  onChange: (status: RequestStatus) => void;
  disabled?: boolean;
}

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

function StatusBadge({ status }: { status: RequestStatus }) {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-2xl ${config.bgColor}`}
    >
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <span className={`text-sm ${config.textColor}`}>{config.label}</span>
    </div>
  );
}

export default function Dropdown({
  value,
  onChange,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (status: RequestStatus) => {
    onChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          inline-flex items-center justify-between gap-2 px-3 py-2 w-[150px]
          bg-white border border-gray-stroke rounded-lg
          transition-all duration-200
          hover:bg-primary-fill
          ${isOpen ? "bg-primary-fill border-primary shadow-[0_0_0_4px_rgba(0,112,255,0.1)]" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <StatusBadge status={value} />
        <svg
          className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-full z-50 bg-white border border-gray-stroke rounded-lg shadow-lg py-1">
          {Object.values(RequestStatus).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleSelect(status)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center"
            >
              <StatusBadge status={status} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { StatusBadge };
