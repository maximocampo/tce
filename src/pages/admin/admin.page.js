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
    
        if (moment(date).isBefore(moment().subtract(1, 'days'))) {
            return <div
                className="calendar-tile-clickable d-flex jc-center ai-center pos-abs w-100 h-100"
                style={{cursor: "not-allowed", backgroundColor: '#ff5f48', borderRadius: '50%'}}
            >
                <div
                    className="yesterday-tile d-flex jc-center ai-center"
                >
                    {date.getDate()}
                </div>
            </div>
        }
        
        return <div
            onClick={() => {
                setDay(date)
                setCurrentPage(d8 ? 'detail' : 'new')
            }}
            >
                <div
                    className="calendar-tile-clickable d-flex jc-center ai-center pos-abs w-100 h-100 active-date"
                    style={{backgroundColor: d8 ? "#58ff00" : '#ff5f48'}}
                >
                    <div
                        className="calendar-flag d-flex jc-center ai-center"
                    >
                        {date.getDate()}
                    </div>
                </div>
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
            <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', height: '93%', marginTop: -10}}>
                <div className="center-box d-flex flex-col w-100">
                    {currentPage === 'calendar' ? <Calendar selectRange={false} tileContent={setContent} /> :
                        <>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                <p>
                                    {moment(day)
                                        .startOf('day')
                                        .locale('es')
                                        .format('D [de] MMMM [de] YYYY')
                                    }
                                </p>
                                <p onClick={() => setDay(null)} style={{cursor: 'pointer'}}>X</p>
                            </div>
                            {currentPage === 'detail' && <ClassDetail />}
                            {currentPage === 'new' && <ClassForm setCurrentPage={setCurrentPage} />}
                        </>
                    }
                </div>
            </div>
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
