import { useState } from 'react';

interface InputProps {
    label: string;
    placeholder?: string;
    type?: string;
    onChange?: (value: string) => void;
    error?: string;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>, value: string) => void;
    disabled?: boolean;
}

export const Input = ({ label, placeholder = '', type = 'text', onChange, onKeyDown, error, disabled = false }: InputProps) => {
    const [value, setValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className='w-full'>
            <label className='mb-1 block text-sm font-medium italic text-gray-200' htmlFor={label}>
                {label}
            </label>
            <div className='relative'>
                <input
                    type={type}
                    id={label}
                    className={`w-full border bg-gray-800 ${error ? 'border-red-500' : 'border-gray-700'} rounded-md px-3 py-2 leading-tight text-gray-200 placeholder-gray-500 transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50`}
                    disabled={disabled}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={(event) => {
                        onKeyDown?.(event, value);
                        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                            setValue('');
                        }
                    }}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${label}-error` : undefined}
                />
            </div>
            {error && (
                <p className='mt-1 text-sm text-red-500' id={`${label}-error`}>
                    {error}
                </p>
            )}
        </div>
    );
};
