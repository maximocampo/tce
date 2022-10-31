import React from 'react';
import Dots from "./dots";

const Button = ({children, disabled, loading, style, ...props}) => {
    return (
        <button
            style={{
                backgroundColor: disabled ? '#707070' : 'black',
                padding: '4px 12px',
                color: 'white',
                width: 'fit-content',
                cursor: 'pointer',
                ...style
            }}
            disabled={disabled}
            {...props}
        >
            {loading ? <Dots /> : children}
        </button>
    );
};

export default Button;
