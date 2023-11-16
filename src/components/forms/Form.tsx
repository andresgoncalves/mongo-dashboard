import React from "react";

interface FormProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function Form({ actions, children }: FormProps) {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="card m-auto grid w-full max-w-4xl grid-cols-1 gap-8 p-8 shadow md:grid-cols-[1fr_1fr]">
        {children}
        {actions && (
          <div className="col-span-full flex justify-end gap-4">{actions}</div>
        )}
      </div>
    </div>
  );
}
