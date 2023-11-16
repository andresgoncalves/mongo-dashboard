"use client";

import { createContext } from "react";
import { useCallback, useState } from "react";

type ToastStatus = "info" | "success" | "error";

export interface ToastData {
  status: ToastStatus;
  message: string;
}

type ToastNotify = (status: ToastStatus, message: string | string[]) => void;

export const ToastContext = createContext<{
  toast: ToastData[];
  notify: ToastNotify;
}>({
  toast: [],
  notify: () => {},
});

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<ToastData[]>([]);

  const notify = useCallback<ToastNotify>((status, message) => {
    const messages = message instanceof Array ? message : [message];
    setToast((toast) => [
      ...toast,
      ...messages.map((message) => ({ status, message })),
    ]);
    setTimeout(() => {
      setToast((toast) => toast.slice(messages.length));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, notify }}>
      {children}
    </ToastContext.Provider>
  );
}
