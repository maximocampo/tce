import React, {useContext, useState} from 'react';
import D8Card from "../../components/D8Card";
import Button from "../../components/button";
import DinamicInput from "../../components/DinamicInput";
import {doc, getFirestore, updateDoc, addDoc} from "firebase/firestore";
import {classesRef} from "../../globals";
import fb from "gatsby-plugin-firebase-v9.0";
import {adminState} from "./admin.page";

const ClassForm = ({
   setShowForm = () => {},
   setEdit = () => {},
   edit,
   setCurrentPage
}) => {
    const { day, setDay } = useContext(adminState)
    
    const [title, setTitle] = useState(edit?.title || '')
    const [description, setDescription] = useState(edit?.description || '')
    const [price, setPrice] = useState(edit?.price || '')
    const [times, setTimes] = useState(edit?.times || [])
    const [loading, setLoading] = useState(false)
    
    const firestore = getFirestore(fb)
    
    const editClass = async () => {
        try {
            const classRef = doc(firestore, classesRef.path + '/' + edit.id)
            return await updateDoc(classRef, {
                title,
                description,
                times,
                price,
                date: new Date(day)
            })
        } catch (e) {
            console.log(e)
        }
    }
    
    const onSubmit = async () => {
        try {
            setLoading(true)
            
            if (edit) {
                await editClass()
            } else {
                
                await addDoc(classesRef, {
                    title,
                    description,
                    times,
                    date: new Date(day)
                })
            }
    
            setShowForm || setCurrentPage('calendar')
            setEdit(null)
            setShowForm(false)
            setDay(null)
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
        
    }
    
    return (
        <D8Card>
            <div style={{fontSize: '1.2rem', display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
                <label>Titulo</label>
                <input
                    value={title}
                    onChange={({target: {value}}) => setTitle(value)}
                    type="text"
                />
                <label>Descripcion</label>
                <textarea
                    style={{
                        boxShadow: '0px 0px 6px 2px #ffff',
                        border: 'none'
                    }}
                    rows={6}
                    value={description}
                    onChange={({target: {value}}) => setDescription(value)}
                />
                <br/>
                <label>Precio</label>
                <input
                    value={price}
                    onChange={({target: {value}}) => setPrice(value)}
                    type="text"
                />
                <label>Horario</label>
                <DinamicInput defaultValue={times} onChange={val => setTimes(val)} />
            </div>
            <Button
                style={{marginLeft: 'auto'}}
                loading={loading}
                onClick={onSubmit}
                disabled={!(title && description && times)}
            >
                GUARDAR
            </Button>
        </D8Card>
    );
};

export default ClassForm;
