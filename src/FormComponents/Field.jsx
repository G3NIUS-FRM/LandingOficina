export function Field({ label, children, className = "" }) {
  return (
    <label className={`block text-sm ${className}`}>
      <div className="mb-2 font-medium text-gray-700">{label}</div>
      {children}
    </label>
  );
}