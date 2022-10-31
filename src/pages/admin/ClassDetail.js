import React, {useContext, useEffect, useState} from 'react';
import {deleteDoc, doc, getDocs, getFirestore, query, where} from "firebase/firestore";
import {classesRef} from "../../globals";
import Button from "../../components/button";
import ClassForm from "./ClassForm";
import fb from "gatsby-plugin-firebase-v9.0";
import {adminState} from "./admin.page";

const Detail = ({setShowForm, classes = [], setEdit, setDeleted}) => {
    const [classUsers, setClassUsers] = useState(null);
    const firestore = getFirestore(fb)
    
    const deleteClass = async (c) => {
        const classRef = doc(firestore, classesRef.path + '/' + c.id)
        await deleteDoc(classRef)
        setDeleted(c.id)
    }
    
    const orderUsers = () => {
        const obj = {}
        
        classes.times.map(t => {
            obj[`${t.from} - ${t.to}`] = []
        })
        

        if (classes.users) {
            classes.users.map(u => {
                console.log(obj[`${u.classTime.from} - ${u.classTime.to}`])
                obj[`${u.classTime.from} - ${u.classTime.to}`].push(u)
            })
        }
    
        setClassUsers(obj)
    }
    
    useEffect(() => {
        if (classes) {
            orderUsers()
        }
    }, [classes])
    
    if (classUsers) {
        return (
            <div className="d-flex flex-col jc-sb w-100 h-100">
                <div className="d-flex flex-col jc-sb h-100">
                    <div style={{flex: 1}} className="class-card-container d-flex flex-col">
                        <div style={{flex: 1}} className="d-flex flex-col jc-sb">
                            <div>
                                <p style={{fontSize: '1.5rem'}}>{classes.title}</p>
                                <br/>
                                <p style={{fontSize: '1rem', "white-space": "pre-line"}}>{classes.description}</p>
                                <br/>
                                <p style={{fontSize: '1rem'}}>Precio: ${classes.price}</p>
                            </div>
                            <div className="d-flex jc-sb">
                                <div>
                                    <br/>
                                    <h3>LISTA:</h3>
                                    {Object.keys(classUsers).map(time => (
                                        <>
                                            <div
                                                className="time-card cursor-pointer"
                                                style={{
                                                    fontSize: '0.95rem',
                                                    width: 'fit-content'
                                                }}
                                            >
                                                {time}
                                            </div>
                                            {classUsers[time].length ? classUsers[time].map(u => (
                                                <p>{u.firstName} {u.lastName}</p>
                                            )) : <p>No hay usuarios para esta clase</p>}
                                            <br/>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <Button
                            style={{width: 'auto', marginTop: 6, padding: 10}}
                            onClick={() => {
                                setShowForm(true)
                                setEdit(classes)
                            }}
                        >
                            EDITAR
                        </Button>
                        <Button
                            style={{width: 'auto', marginTop: 6, padding: 10}}
                            onClick={() => deleteClass(classes)}
                        >
                            BORRAR
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    
    return null
};

const ClassDetail = () => {
    const {
        day,
        setDay,
    } = useContext(adminState)
    
    const [classes, setClasses] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [edit, setEdit] = useState(null)
    const [deleted, setDeleted] = useState(null)
    
    const getClasses = async () => {
        const q = query(classesRef, where('date', '==', new Date(day)))
        const {docs} = await getDocs(q)
        
        setClasses(docs.map(d => ({...d.data(), id: d.id}))[0])
    }
    
    useEffect(() => {
        getClasses()
    }, [showForm, deleted])
    
    return (
        <>
            {showForm
                ? <ClassForm
                    setShowForm={setShowForm}
                    day={day}
                    setDay={setDay}
                    setEdit={setEdit}
                    edit={edit}
                />
                : <Detail
                    setDeleted={setDeleted}
                    classes={classes}
                    setShowForm={setShowForm}
                    setEdit={setEdit}
                />
            }
        </>
    );
};

export default ClassDetail;
