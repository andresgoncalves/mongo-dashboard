import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export default function Select({
  label,
  error,
  required,
  className,
  placeholder,
  children,
  ...props
}: SelectProps) {
  return (
    <label className={`form-control ${className}`}>
      <div className="label">
        <div className="label-text space-x-1">
          <span>{label}</span>
          {required && <span className="text-error">*</span>}
        </div>
      </div>
      <select className="select select-bordered" required={required} {...props}>
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      {error && (
        <div className="label">
          <div className="label-text">
            <span className="text-sm text-error">{error}</span>
          </div>
        </div>
      )}
    </label>
  );
}
