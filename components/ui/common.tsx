export function Button({ type = "button", children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...props}
      className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors ${props.className || ''}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className || ''}`}>
      {children}
    </div>
  );
}
