import React, {useEffect, useState, createContext} from "react"
import ReactCalendar from 'react-calendar'
import Layout from "../../components/layout";
import moment from "moment"
import {getDocs} from "firebase/firestore";
import {classesRef} from "../../globals";
import ClassDetail from "./ClassDetail";
import Book from "./Book";
import im1 from "../../images/IMG_8424.jpg"
import im2 from "../../images/IMG_1375.jpg"
import im3 from "../../images/IMG_1380.jpg"
import im4 from "../../images/IMG_1385.jpg"
import im5 from "../../images/IMG_1415.jpg"

Array.prototype.getItemCount = function(item) {
    let counts = {};
    for (let i = 0; i < this.length; i++) {
        let num = this[i];
        counts[num] = counts[num] ? counts[num]+1: 1;
    }
    return counts[item] || 0;
};

export const indexState = createContext();

const Calendar = ({setContent}) => {
    return (
        <>
            <ReactCalendar
                selectRange={false}
                tileContent={setContent}
            />
            <div className="calendar-flag-desc d-flex jc-center flex-col">
                <div className="d-flex ai-center">
                    <div className="calendar-flag-small" />
                    <p>taller con disponibilidad</p>
                </div>
               <div className="d-flex ai-center">
                   <div style={{backgroundColor: "#c3c3c3"}} className="calendar-flag-small" />
                   <p>taller lleno</p>
               </div>
            </div>
        </>
    )
}

const Index = () => {
    const [about, setAbout] = useState(false)
    const [archivo, setArchivo] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentClass, setCurrentClass] = useState(null)
    const [currentPage, setCurrentPage] = useState('calendar')
    const [day, setDay] = useState(null)
    const [currentTime, setCurrentTime] = useState(null)
    const [classes, setClasses] = useState([])
    
    const toggleAbout = () => {
        setArchivo(false)
        setAbout(!about)
    }
    
    const toggleArchivo = () => {
        setAbout(false)
        setArchivo(!archivo)
    }
    
    const getClasses = async () => {
        const {docs} = await getDocs(classesRef)
        
        const allDates = []
        docs.map(d => {
            let full = true
            
            d.data().times.map(t => {
                full = t.full
            })
    
            allDates.push({
                date:moment(d.data().date.toDate()).format('DD-MM-YYYY'),
                full
            })
        })
        
        setClasses(allDates)
    }
    
    useEffect(() => { getClasses() }, [day])
    
    const setContent = ({date}) => {
         const d8 = classes.find(d => d.date === moment(date).format('DD-MM-YYYY'))
        
        if (moment(date).isBefore(moment().subtract(1, 'days'))) {
            return <div
                className="calendar-tile-clickable d-flex jc-center ai-center pos-abs w-100 h-100"
                style={{cursor: "not-allowed", backgroundColor: '#ff5f48'}}
            >
                <div
                    className="yesterday-tile d-flex jc-center ai-center"
                >
                    {date.getDate()}
                </div>
            </div>
        }
        
        if (d8) {
            return <div
                onClick={() => d8?.full || setDay(date)}
                className="calendar-tile-clickable d-flex jc-center ai-center pos-abs w-100 h-100 active-date"
                style={{backgroundColor: d8?.full ? "#c3c3c3" : '#58ff00'}}
            >
                <div
                    className="calendar-flag d-flex jc-center ai-center"
                >
                    {date.getDate()}
                </div>
            </div>
        }
    }
    
    useEffect(() => {
        if (day) {
            return setCurrentPage('detail')
        }
        
        setCurrentClass(null)
        setCurrentTime(null)
        return setCurrentPage('calendar')
    }, [day])
    
    return (
        <indexState.Provider
            value={{
                currentClass,
                currentPage,
                day,
                currentTime,
                setCurrentClass,
                setCurrentPage,
                setDay,
                setCurrentTime,
                loading,
                setLoading
            }}
        >
            <Layout>
                <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', height: '93%', marginTop: -10}}>
                    <div className="center-box d-flex flex-col w-100">
                        {currentPage === 'calendar' && <Calendar setContent={setContent} />}
                        {currentPage === 'detail' && <ClassDetail />}
                        {currentPage === 'book' && <Book />}
                    </div>
                    
                    <div
                        onClick={toggleAbout}
                        className="d-flex w-100 about-box jc-center ai-center"
                        style={{
                            zIndex: 2,
                            position: 'relative',
                        }}
                    >
                        ABOUT
    
    
    
                        <div className="about-box" style={{
                            overflow: 'auto',
                            padding: 20,
                            width: '100%',
                            maxHeight: 500,
                            height: '70vh',
                            position: 'absolute',
                            borderRadius: 20,
                            opacity: about ? 0.9 : 0,
                            transitionDuration: '0.6s',
                            transitionProperty: 'opacity',
                            bottom: '50%',
                            margin: 0,
                            boxShadow: '0px 0px 15px 17px #9af11e',
                            zIndex: 1,
                            pointerEvents: about ? 'inherit' : 'none',
                        }}>
                            <p>
                                Taller de Costura Experimental es un espacio creativo de creación textil en
                                CDMX donde rescatamos los valores intrínsecos de la moda; reflexionamos el
                                tiempo en la moda para provocar memorias materiales plasmadas en confección
                                libre, experimental y/o asistida.
                                <br/>
                                Profesionales de la moda a disposición de tu proyecto; Gerente de Costura,
                                Costurera Senior y Patronista.
                                <br/>
                                <br/>
                                Maquinaria Industrial para telas lijeras o medianas (mezclilla hasta 14 Oz);
                                <br/>
                                + Maquina de 1 Aguja Recta Electronica Brother
                                <br/>
                                + Overlock de 3 hilos Futura
                                <br/>
                                + Interlock Cama Plana de 3 agujas y 5 hilos (Collaretera) Futura
                                <br/>
                                <br/>
                                Material de trabajo profesional;
                                <br/>
                                + Maniquís Dama T-7 y Hombre T-34, Plancha Profesional y Mesa de corte.
                                <br/>
                                <br/>
                                Consumibles de alta calidad;
                                <br/>
                                + Hilos, Entretelas, Manta, Loneta, Estopilla, Papel bond y kraft.
                            </p>
                        </div>
                        
                    </div>
    
    
                    <div
                        onClick={toggleArchivo}
                        className="d-flex w-100 jc-center ai-center archivo-box"
                        style={{
                            zIndex: 4,
                            position: 'relative',
                        }}
                    >
                        ARCHIVO
    
    
                        <div className="archivo-box" style={{
                            overflow: 'auto',
                            padding: 20,
                            width: '100%',
                            height: '80vh',
                            maxHeight: 610,
                            position: 'absolute',
                            borderRadius: 20,
                            opacity: archivo ? 1 : 0,
                            transitionDuration: '0.6s',
                            transitionProperty: 'opacity',
                            bottom: '90%',
                            margin: 0,
                            boxShadow: '0px 0px 15px 17px #2162f3',
                            zIndex: 1,
                            pointerEvents: archivo ? 'inherit' : 'none',
                        }}>
                            {archivo &&
                                <div>
                                    {[im1, im2, im3, im4, im5].map(i => (
                                        <img
                                            style={{
                                                width:'100%',
                                                padding: 10
                                            }}
                                            src={i}
                                            alt=""
                                        />
                                    ))}
                                </div>
                            }
                        </div>
                        
                    </div>
                </div>
            </Layout>
        </indexState.Provider>
    )
}

/*
*
* <div style={{backgroundColor: 'white', margin: 20, zIndex: 2}}>
                    <IgEmbed />
                    <p>
                        Taller de Costura Experimental es un espacio creativo de creación textil en
                        CDMX donde rescatamos los valores intrínsecos de la moda; reflexionamos el
                        tiempo en la moda para provocar memorias materiales plasmadas en confección
                        libre, experimental y/o asistida.
                        <br/>
                        Profesionales de la moda a disposición de tu proyecto; Gerente de Costura,
                        Costurera Senior y Patronista.
                        <br/>
                        <br/>
                        Maquinaria Industrial para telas lijeras o medianas (mezclilla hasta 14 Oz);
                        <br/>
                        + Maquina de 1 Aguja Recta Electronica Brother
                        <br/>
                        + Overlock de 3 hilos Futura
                        <br/>
                        + Interlock Cama Plana de 3 agujas y 5 hilos (Collaretera) Futura
                        <br/>
                        <br/>
                        Material de trabajo profesional;
                        <br/>
                        + Maniquís Dama T-7 y Hombre T-34, Plancha Profesional y Mesa de corte.
                        <br/>
                        <br/>
                        Consumibles de alta calidad;
                        <br/>
                        + Hilos, Entretelas, Manta, Loneta, Estopilla, Papel bond y kraft.
                    </p>
                </div>
*
* */

export default Index

