import React, {useEffect, useState, createContext} from "react"
import ReactCalendar from 'react-calendar'
import Layout from "../../components/layout";
import moment from "moment"
import {getDocs} from "firebase/firestore";
import {classesRef} from "../../globals";
import ClassDetail from "./ClassDetail";
import Book from "./Book";
import IgEmbed from "../../components/IgEmbed";

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
                    <p>taller de 1hr</p>
                </div>
               <div className="d-flex ai-center">
                   <div style={{backgroundColor: "#ff9595"}} className="calendar-flag-small" />
                   <p>taller lleno</p>
               </div>
            </div>
        </>
    )
}

const Index = () => {
    const [loading, setLoading] = useState(false)
    const [currentClass, setCurrentClass] = useState(null)
    const [currentPage, setCurrentPage] = useState('calendar')
    const [day, setDay] = useState(null)
    const [currentTime, setCurrentTime] = useState(null)
    const [classes, setClasses] = useState([])
    
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
                style={{cursor: "not-allowed"}}
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
                onClick={() => d8.full || setDay(date)}
                className="calendar-tile-clickable d-flex jc-center ai-center pos-abs w-100 h-100"
            >
                <div
                    style={{backgroundColor: d8.full ? "#ff9595" : '#a7ef94'}}
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
                <div style={{display:'flex', justifyContent: 'center', marginTop: 20}}>
                    <div className="center-box d-flex flex-col w-100">
                        {currentPage === 'calendar' && <Calendar setContent={setContent} />}
                        {currentPage === 'detail' && <ClassDetail />}
                        {currentPage === 'book' && <Book />}
                    </div>
                </div>
                <div style={{backgroundColor: 'white', margin: 20, zIndex: 2}}>
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
            </Layout>
        </indexState.Provider>
    )
}


export default Index

