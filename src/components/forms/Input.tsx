import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  required,
  className,
  ...props
}: InputProps) {
  return (
    <label className={`form-control ${className}`}>
      <div className="label">
        <div className="label-text space-x-1">
          <span>{label}</span>
          {required && <span className="text-error">*</span>}
        </div>
      </div>
      <input className="input input-bordered" required={required} {...props} />
      {error && (
        <div className="label">
          <div className="label-text">
            <span className="text-error">{error}</span>
          </div>
        </div>
      )}
    </label>
  );
}
