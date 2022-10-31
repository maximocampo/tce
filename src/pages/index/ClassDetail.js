import React, {useContext, useEffect, useState} from 'react';
import moment from "moment";
import Button from "../../components/button";
import {doc, getDocs, getFirestore, query, where} from "firebase/firestore";
import {classesRef} from "../../globals";
import Dots from "../../components/dots";
import {indexState} from './index.page'
import fb from "gatsby-plugin-firebase-v9.0";

const ClassCard = ({title, description, times, price}) => {
    const { currentTime, setCurrentPage, setCurrentTime } = useContext(indexState)
    
    const onBook = () => {
        setCurrentPage('book')
    }
    
    return (
        <div style={{flex: 1}} className="class-card-container d-flex flex-col">
            <div style={{flex: 1}} className="d-flex flex-col jc-sb">
                <div>
                    <p style={{fontSize: '1.5rem'}}>{title}</p>
                    <br/>
                    <p style={{fontSize: '1rem', "white-space": "pre-line"}}>{description}</p>
                    <br/>
                    <p style={{fontSize: '1rem'}}>Precio: ${price}</p>
                    <br/>
                </div>
                <div style={{flexWrap: 'wrap', gap:10}} className="d-flex jc-sb">
                    <p style={{fontSize: '0.7rem'}}>Selecciona el horario de tu preferencia:</p>
                    {times.map((t, i) => (
                        <div
                            onClick={() => t.full || setCurrentTime({i, t})}
                            className={`time-card cursor-pointer ${t.full && "time-card-disabled"}`}
                            style={{
                                fontSize: '0.95rem',
                                color: t.full ? 'white' : currentTime?.i === i ? 'white' : 'black',
                                backgroundColor: t.full ? 'gray' : currentTime?.i === i ? 'black' : 'white'
                            }}
                        >
                            <p>{t.from} - {t.to}</p>
                        </div>
                    ))}
                    <div style={{flex: '47%'}} />
                </div>
            </div>
            <Button
                onClick={onBook}
                style={{width: 'auto', marginTop: 10, padding: 10}}
                disabled={currentTime === null}
            >
                BOOK
            </Button>
        </div>
    )
}

const ClassDetail = () => {
    const {
        currentClass,
        setCurrentClass,
        day,
        setDay,
    } = useContext(indexState)
    
    const firestore = getFirestore(fb)
    
    const getClasses = async () => {
        const q = query(classesRef, where('date', '==', new Date(day)))
        const {docs} = await getDocs(q)
        
            setCurrentClass(docs.map(d => {
                
                console.log(d.id)
                const _ref = doc(firestore, classesRef.path + '/' + d.id)
                
                return {...d, ...d.data(), _ref, id: d.id}
            })[0])
    }
    
    useEffect(() => {
        getClasses()
    }, [])
    
    if (currentClass) {
        return (
            <div className="detail-container d-flex flex-col ai-center w-100 h-100">
                <div className="d-flex w-100 jc-sb">
                    <div />
                    <p>{moment(day).startOf('day').locale('es').format('dddd, D [de] MMMM [de] YYYY')}</p>
                    <p onClick={() => setDay(null)} className="cursor-pointer">X</p>
                </div>
                <ClassCard {...currentClass} />
            </div>
        );
    }
    
    return <Dots />
    
};

export default ClassDetail;
