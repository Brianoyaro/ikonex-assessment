import React from 'react';

const FormInput = React.forwardRef((props, ref) => {
  const { error, ...inputProps } = props;
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      {...inputProps}
    />
  );
});

FormInput.displayName = 'FormInput';
export default FormInput;
