import React from "react"
import logo from "../images/tcelogo.svg";
import IgEmbed from "./IgEmbed";

const Cirr = ({children}) => {
    return <span
        style={{
            fontFamily: 'CirrusCumulus',
            textAlign: 'right'
        }}
    >
        {children}
    </span>
}

const Header = ({title, children}) => {
    return <img style={{ zIndex: 2, position: 'fixed', bottom: 10, right: 10, width: 120}} src={logo} alt=""/>
    
    return <div style={{backgroundColor: 'white', margin: 20, zIndex: 2}}>
        <div
            style={{
                width: '100%',
                display: "flex",
                justifyContent: 'space-between',
            }}
        >
            <p>TALLER DE COSTURA EXPERIMENTAL</p>
        </div>
        </div>
}

const Footer = ({title, children}) => {
    return <>
        
        </>
}

export default ({children}) => {
    return (
        <>
            <div className="site-wrapper">
                <Header />
                {children}
            </div>
        </>
  )
}
