import React from 'react';
export const FormGroup = ({ label, icon: Icon, error, children, className = '' }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {Icon && (
          <span className="absolute left-3 text-slate-500 flex items-center justify-center pointer-events-none z-10">
            {Icon}
          </span>
        )}
        {children}
      </div>
      {error && <span className="text-xs text-rose-400 font-medium mt-0.5">{error}</span>}
    </div>
  );
};
export const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  icon,
  error,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={`w-full bg-slate-900 border ${
        error ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-primary-500'
      } rounded-lg text-slate-200 placeholder-slate-500 text-sm px-4 py-2.5 transition-colors focus:outline-none focus:ring-1 ${
        error ? 'focus:ring-rose-500' : 'focus:ring-primary-500'
      } ${icon ? 'pl-10' : ''} ${className}`}
      {...props}
    />
  );
};
export const Select = ({
  name,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  icon,
  error,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="relative w-full">
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full bg-slate-900 border ${
          error ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-primary-500'
        } rounded-lg text-slate-200 text-sm px-4 py-2.5 transition-colors focus:outline-none focus:ring-1 ${
          error ? 'focus:ring-rose-500' : 'focus:ring-primary-500'
        } ${icon ? 'pl-10' : ''} appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        ▼
      </span>
    </div>
  );
};
export const TextArea = ({
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  error,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`w-full bg-slate-900 border ${
        error ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-800 focus:border-primary-500'
      } rounded-lg text-slate-200 placeholder-slate-500 text-sm px-4 py-2.5 transition-colors focus:outline-none focus:ring-1 ${
        error ? 'focus:ring-rose-500' : 'focus:ring-primary-500'
      } ${className}`}
      {...props}
    />
  );
};
