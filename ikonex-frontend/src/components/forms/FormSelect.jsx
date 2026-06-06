import React from 'react';

const FormSelect = ({ name, value, onChange, options, placeholder, required, disabled = false }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FormSelect;
