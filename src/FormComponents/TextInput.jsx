export function TextInput({ value, onChange, placeholder = "", type = "text", name }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-200 p-2 bg-white text-sm focus:ring-2 focus:ring-blue-200"
    />
  );
}