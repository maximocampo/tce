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
                    <p style={{
                        fontSize: '2rem',
                    }}>{title}</p>
                    <br/>
                    <p style={{fontSize: '1.2rem', "white-space": "pre-line"}}>{description}</p>
                    <br/>
                    <br/>
                    <p style={{fontSize: '1.2rem'}}>Precio: ${price}</p>
                    <p style={{textAlign: 'right', fontSize: '0.7rem'}}>* no reembolsable</p>
                    <br/>
                </div>
                <div style={{flexWrap: 'wrap', gap:10}} className="d-flex jc-sb">
                    <p style={{fontSize: '0.7rem'}}>selecciona el horario de tu preferencia:</p>
                    {times.map((t, i) => (
                        <div
                            onClick={() => t.full || setCurrentTime({i, t})}
                            className={`time-card cursor-pointer ${t.full && "time-card-disabled"}`}
                            style={{
                                fontSize: '1.2rem',
                                color: t.full ? 'white' : currentTime?.i === i ? 'white' : 'black',
                                backgroundColor: t.full ? 'gray' : currentTime?.i === i ? 'black' : 'white',
                            }}
                        >
                            <p style={{textAlign: 'center'}}>{t.from} - {t.to}</p>
                        </div>
                    ))}
                    <div style={{flex: '47%'}} />
                </div>
            </div>
            <Button
                onClick={onBook}
                style={{marginLeft: 'auto', marginTop: 10}}
                disabled={currentTime === null}
            >
                RESERVAR
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
            <div className="detail-container d-flex flex-col ai-center h-100">
                <div className="d-flex w-100 jc-sb">
                    <p style={{
                        fontWeight: 300,
                        textTransform: "lowercase",
                        fontSize: "1.2rem",
                        whiteSpace: 'nowrap',
                        marginRight:10
                    }}>{moment(day).startOf('day').locale('es').format('D [de] MMMM [de] YYYY')}</p>
                    <p style={{fontSize: '1.2rem'}} onClick={() => setDay(null)} className="cursor-pointer">x</p>
                </div>
                <ClassCard {...currentClass} />
            </div>
        );
    }
    
    return <Dots style={{height: 400}} />
    
};

export default ClassDetail;
