import Link from "gatsby-link";
import React from "react";

export const DownloadTicket = ({payment}) => {
    return (
        <>
            <p>Gracias!</p>
            <Link
                to="/tobole"
                state={{...payment}}
            >
                DESCARGAR BOLETO
            </Link>
        </>
    )
};
