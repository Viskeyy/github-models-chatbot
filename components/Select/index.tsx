'use client';
import { useState } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options?: Option[];
    placeholder?: string;
    onChange?: (value: string) => void;
}

export const Select = ({ options = [], placeholder = 'Select an option', onChange }: SelectProps) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedValue(value);
        if (onChange) onChange(value);
    };

    return (
        <div className='relative w-64'>
            <select
                value={selectedValue}
                onChange={handleChange}
                className='w-full cursor-pointer appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 pr-8 leading-tight text-gray-200 transition-colors duration-200 ease-in-out hover:border-gray-600 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50'
                aria-label={placeholder}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500'>
                <svg className='h-4 w-4 fill-current' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
                    <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                </svg>
            </div>
        </div>
    );
};
