"use client";

import { useState } from "react";

type ToastStatus = "info" | "success" | "error";

export interface ToastData {
  status: ToastStatus;
  message: string;
}

export function useToast(): [
  ToastData[],
  (status: ToastStatus, message: string | string[]) => void,
] {
  const [toast, setToast] = useState<ToastData[]>([]);

  function notify(status: ToastStatus, message: string | string[]) {
    const messages = message instanceof Array ? message : [message];
    setToast((toast) => [
      ...toast,
      ...messages.map((message) => ({ status, message })),
    ]);
    setTimeout(() => setToast((toast) => toast.slice(messages.length)), 5000);
  }

  return [toast, notify];
}
