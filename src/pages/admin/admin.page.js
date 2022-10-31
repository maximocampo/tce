import React, {createContext, useEffect, useState} from 'react';
import Layout from "../../components/layout";
import Button from "../../components/button";
import Calendar from "react-calendar";
import moment from "moment";
import {classesRef} from "../../globals";
import {getDocs} from "firebase/firestore";
import ClassDetail from "./ClassDetail";
import ClassForm from "./ClassForm";
import D8Card from "../../components/D8Card";
import IgEmbed from "../../components/IgEmbed";

export const adminState = createContext();

const About = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            gap: 10
        }}>
            <textarea name="" id="" cols="30" rows="10" />
            <Button>SAVE</Button>
        </div>
    )
}

const Book = () => {
    const [currentClass, setCurrentClass] = useState(null)
    const [currentPage, setCurrentPage] = useState('calendar')
    const [day, setDay] = useState(null)
    const [currentTime, setCurrentTime] = useState(null)
    const [classes, setClasses] = useState([])
    
    const getClasses = async () => {
        const {docs} = await getDocs(classesRef)
    
        const allDates = []
        docs.map(d => {
            allDates.push({
                date:moment(d.data().date.toDate()).format('DD-MM-YYYY'),
                full: d.data()?.users?.filter((value, index, self) =>
                    index === self.findIndex((t) => t.id === value.id)
                ).length > 3
            })
        })
    
        setClasses(allDates)
    }
    
    useEffect(() => { getClasses() },[day])
    
    useEffect(() => {
        if (!day) {
            setCurrentTime(null)
            return setCurrentPage('calendar')
        }
    }, [day])
    
    const setContent = ({date}) => {
        const d8 = classes.find(d => d.date === moment(date).format('DD-MM-YYYY'))
        
        return <div
                onClick={() => {
                    setDay(date)
                    setCurrentPage(d8 ? 'detail' : 'new')
                }}
                className="calendar-tile-clickable d-flex jc-center ai-center pos-abs w-100 h-100"
            >
                {d8 && (
                    <div
                        style={{backgroundColor: d8.full ? '#d2d2d2' : '#a7ef94'}}
                        className="calendar-flag d-flex jc-center ai-center"
                    >
                        {date.getDate()}
                    </div>
                )}
            </div>
    }
    
    return (
        <adminState.Provider
            value={{
                currentClass,
                currentPage,
                day,
                currentTime,
                setCurrentClass,
                setCurrentPage,
                setDay,
                setCurrentTime
            }}
        >
            <Layout>
                <div style={{display:'flex', justifyContent: 'center', marginTop: 20}}>
                    <div className="center-box d-flex flex-col w-100">
                            <D8Card>
                                {currentPage === 'calendar' ? <Calendar selectRange={false} tileContent={setContent} /> :
                                    <>
                                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                            <div />
                                            <p>
                                                {moment(day)
                                                    .startOf('day')
                                                    .locale('es')
                                                    .format('dddd, D [de] MMMM [de] YYYY')
                                                }
                                            </p>
                                            <p onClick={() => setDay(null)} style={{cursor: 'pointer'}}>X</p>
                                        </div>
                                        {currentPage === 'detail' && <ClassDetail />}
                                        {currentPage === 'new' && <ClassForm setCurrentPage={setCurrentPage} />}
                                    </>
                                }
                            </D8Card>
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
        </adminState.Provider>
    )
}

const Admin = () => {
    return (
        <Layout>
            <Book />
        </Layout>
    );
};

export default Admin;
