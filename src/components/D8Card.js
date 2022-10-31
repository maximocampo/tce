import React from "react";

const DateCard = ({children}) => {
    return (
        <div className="detail-container d-flex flex-col ai-center w-100 h-100">
            {children}
        </div>
    )
}

export default DateCard
