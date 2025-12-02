
interface RadioCardProps {
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  className?: string;
}

export default function RadioCard({
  value,
  checked,
  onChange,
  label,
  description,
  className = '',
}: RadioCardProps) {
  return (
    <div
      onClick={() => onChange(value)}
      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
        checked
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      } ${className}`}
    >
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="radio"
            name="radio-group"
            value={value}
            checked={checked}
            onChange={() => onChange(value)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
          />
        </div>
        <div className="ml-3 flex-1">
          <label className="font-medium text-gray-900 cursor-pointer">{label}</label>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
    </div>
  );
}


