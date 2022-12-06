import React from 'react';
import Dots from "./dots";

const Button = ({children, disabled, loading, style, ...props}) => {
    return (
        <button
            style={{
                filter: disabled ? 'blur(2px)' : 'none',
                backgroundColor: disabled ? '#dddddd' : '#9af11e',
                color: 'white',
                cursor: 'pointer',
                textTransform: 'lowercase',
                fontWeight: 'lighter',
                boxShadow: disabled ? '0px 0px 8px 9px #dddddd' : '0px 0px 8px 9px #9af11e',
                fontSize: '2rem',
                borderRadius: 20,
                width: 'fit-content',
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
