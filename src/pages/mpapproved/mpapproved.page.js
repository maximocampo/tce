import React, {useEffect, useState} from 'react';
import {getDoc, getDocs, where, query, doc, arrayUnion, updateDoc} from "firebase/firestore"
import Layout from "../../components/layout";
import {getPayment, paymentsRef, seachToObj, usersRef, firestore, classesRef, sendConfirmMail} from "../../globals";

const Mpapproved = ({location: {search}}) => {
    const [loading, setLoading] = useState(true)
    const [payment, setPayment] = useState(null)
    const [status, setStatus] = useState(null)
    
    const checkIfPayed = async ({payment_id}) => {
        try {
            const {data} = await getPayment({id: payment_id})
            
            setPayment(data.body)
            setStatus(data?.body?.status)
            
            const q = query(usersRef, where('payments', 'array-contains', data?.body?.external_reference))
            const {docs} = await getDocs(q)
            
            await updateDoc(docs[0].ref, {
                ticketStatus: data?.body?.status,
                paymentId: data?.body?.id,
                mpEmail: data?.body?.payer?.email,
            })
            
             if (data.body.status === 'approved') {
                 const paymentRef = doc(firestore, paymentsRef.path + '/' + data?.body?.external_reference)
                 const classRef = doc(firestore, classesRef.path + '/' + docs[0].data().classId)
                 const currClass = await getDoc(classRef)
                 await updateDoc(paymentRef, {ticketStatus: 'approved'})
                 
                 let newTimes = []
                 const count = {}
    
    
                 if (currClass.data().users) {
                     currClass.data().users.map(u => {
                         return count[`${u.classTime.from} - ${u.classTime.to}`] = (count[`${u.classTime.from} - ${u.classTime.to}`] || 0) + 1;
                     })
                 }
                 
    
                 currClass.data().times.map(t => {
                     console.log(count[`${t.from} - ${t.to}`])
                     newTimes.push({...t, full: count[`${t.from} - ${t.to}`] > 1})
                 })
                 
                 const currentUser = docs[0].data()
                 const currentClass = currClass.data()
    
                 await sendConfirmMail({
                     ...docs[0].data(),
                     message: "hola"
                 })
                 
                 if (currentClass
                     .users
                     .filter(u => u.classTime.from === currentUser.classTime.from)
                     .filter(u => u.payments[0] === currentUser.payments[0])
                     .length === 0
                 ) {
                     await updateDoc(classRef, {
                         users: arrayUnion({...docs[0].data(), id: docs[0].id}),
                         times: newTimes
                     });
    
                     
                 }
            }
            
            return setLoading(false)
            
            setLoading(false)
            return setStatus('invalid')
        } catch (e) {
        }
    }
    
    useEffect(() => {
        checkIfPayed(seachToObj(search))
    },[])
    
    return (
        <Layout>
            <div style={{display:'flex', flexDirection: 'column', alignItems: 'center', height: '93%', marginTop: -10}}>
            <div className="center-box d-flex flex-col w-100">
                    <div className="detail-container d-flex flex-col ai-center w-100 h-100">
                        <div className="d-flex flex-col w-100 jc-sb">
                            <p>
                                Gracias por tu reservación en Taller de Costura Experimental!
                            </p>
                            <br/>
                            <p>
                                Horario: 		1pm a 5pm
                                <br/>
                                Fecha: 		1 Diciembre 2022
                                <br/>
                                Sucursal: 	Citlaltepetl 68, Condesa, CDMX, CP. 11000
                                <br/>
                                Imparte: 		María José Jimenez
                                <br/>
                                Proyecto:	Nubes de Plastico
                                <br/>
                                Descripción:	Reciclar plásticos para crear mampara de lamparas de casa.
                            </p>
                                <br/>
                            <p>
                                Contamos con expertos y equipo profesional de confección, patronaje y costura.
                            </p>
                                <br/>
                            <p>
                                Importante:
                                <br/>
                                * Traer 6 prendas para reciclar.
                                <br/>
                                * No reembolsable.
                            </p>
                            <p>
                                <br/>
                                Te esperamos para experimentar,
                                <br/>
                                Atentamente,
                                <br/>
                                María José Jiménez Fernández.
                            </p>
                            <p style={{wordBreak:'break-word'}}>
                                <br/>
                                Cualquier duda o comentario favor de contactar:
                                <br/>
                                <br/>
                                Fernanda Alvarez - admin@tallerdecosturaexperimental.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Mpapproved;
