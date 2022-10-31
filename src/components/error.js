import React from 'react';
import Body from "./body";
import Layout from "./layout";

const Error = ({children}) => {
    return (
        <Layout>
            <Body>
                <p>Hubo un error</p>
                <p>Por favor intentalo mas tarde o contactate con gomagoma.mx@gmail.com o @goma.mx en instagram</p>
                {children}
            </Body>
        </Layout>
    );
};

export default Error;
