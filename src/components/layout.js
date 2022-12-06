import React from "react"
import IgEmbed from "./IgEmbed";
import P5 from "./p5";
import {indexState} from "../pages/index/index.page";

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
                <h1
                    className="logo"
                >
                    TCE
                </h1>
                {children}
            </div>
        </>
  )
}
