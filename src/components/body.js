import React from 'react';

const Body = ({children, style}) => {
    return (
        <div style={{
            backgroundColor: 'black',
            width: 400,
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '0.5px solid white',
            padding: '1%',
            margin: '5%',
            ...style
        }}>
            {children}
        </div>
    );
};

export default Body;
