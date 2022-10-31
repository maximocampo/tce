import React from 'react';
import './styles.less'

const Dots = ({style}) => {
    return (
        <div>
            <p style={style}>
                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </p>
        </div>
    );
};

export default Dots;
