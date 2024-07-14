import React from 'react';
import PropTypes from 'prop-types';
import { tailwind } from '@/utils/tailwind-utils';

Input.propTypes = {
    variant: PropTypes.oneOf(['primary', 'danger', 'success', 'warning', 'generic']),
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
    variant: 'generic',
    type: 'text',
    placeholder: '',
    value: '',
};

export function Input({ variant, type, placeholder, value, onChange, ...props }) {
    const baseStyle = 'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 border';
    const variantStyles = {
        primary: 'border-gray-300 focus:ring-navy-blue focus:border-navy-blue',
        danger: 'border-red-600 focus:ring-red-600 focus:border-red-600',
        success: 'border-green-600 focus:ring-green-600 focus:border-green-600',
        warning: 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500',
        generic: 'border-gray-400 focus:ring-gray-500 focus:border-gray-500',
    };

    const inputClass = tailwind(baseStyle, variantStyles[variant]);

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={inputClass}
            {...props}
        />
    );
};



