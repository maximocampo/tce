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
                 
                 await updateDoc(classRef, {
                     users: arrayUnion({...docs[0].data(), id: docs[0].id}),
                     times: newTimes
                 });
                 
                 await sendConfirmMail({
                     ...docs[0].data(),
                     message: "hola"
                 })
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
            <div style={{display:'flex', justifyContent: 'center', marginTop: 40}}>
                <div className="center-box d-flex flex-col w-100">
                    <div className="detail-container d-flex flex-col ai-center w-100 h-100">
                        <div className="d-flex flex-col w-100 jc-sb">
                            <p>Gracias</p>
                            <br/>
                            <p>Te mandamos un mail con mas detalles sobre el taller</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Mpapproved;
