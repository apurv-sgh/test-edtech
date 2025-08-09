import React from 'react';

const Button = ({ children, variant = 'solid', className, ...props }) => {
    const baseStyles = 'px-6 py-3 rounded-md font-semibold transition-transform trasnform hover:scale-105';

    const variants = {
        solid: 'bg-primary text-white hover:bg-primary-dark',
        outline: 'border border-primary text-primary bg-transparent hover:bg-primary-light',
        light: 'bg-white text-primary hover:bg-gray-100',
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;