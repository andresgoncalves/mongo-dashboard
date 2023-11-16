"use client";

import { useToast } from "@/lib/hooks/useToast";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function Toast() {
  const { toast } = useToast();

  return (
    <div className="toast toast-center w-full">
      {toast.map((alert, key) =>
        alert.status === "success" ? (
          <div key={key} className="alert alert-success">
            <CheckCircleIcon className="h-6 w-6" />
            <span>{alert.message}</span>
          </div>
        ) : alert.status === "error" ? (
          <div key={key} className="alert alert-error">
            <XCircleIcon className="h-6 w-6" />
            <span>{alert.message}</span>
          </div>
        ) : (
          <div key={key} className="alert">
            <InformationCircleIcon className="h-6 w-6" />
            <span>{alert.message}</span>
          </div>
        ),
      )}
    </div>
  );
}
