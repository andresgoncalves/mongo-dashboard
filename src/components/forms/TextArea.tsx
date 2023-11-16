import { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  required,
  className,
  ...props
}: TextAreaProps) {
  return (
    <label className={`form-control ${className}`}>
      <div className="label">
        <div className="label-text space-x-1">
          <span>{label}</span>
          {required && <span className="text-error">*</span>}
        </div>
      </div>
      <textarea
        className="textarea textarea-bordered"
        required={required}
        {...props}
      />
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
