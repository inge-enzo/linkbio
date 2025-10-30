'use client';

import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...' }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-12 py-3
          bg-white border border-gray-200 rounded-xl
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          outline-none transition-all
          text-gray-800 placeholder-gray-400
          shadow-sm hover:shadow-md
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="
            absolute inset-y-0 right-0 pr-4
            flex items-center
            text-gray-400 hover:text-gray-600
            transition-colors
          "
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
