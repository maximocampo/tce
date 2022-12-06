import React, {useContext} from 'react';
import moment from "moment";
import {indexState} from "./index.page";
import Button from "../../components/button";
import D8Card from "../../components/D8Card";
import {addDoc, arrayUnion, updateDoc} from "firebase/firestore"
import { Form, Formik, Field } from 'formik';
import {useMercadopago} from "react-sdk-mercadopago";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import {createPreference, paymentsRef, usersRef} from '../../globals'

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);

const Book = () => {
    const mercadopago = useMercadopago.v2(process.env.GATSBY_MP_PUBLIC_KEY, {locale: 'es-MX'});
    const {
        currentClass,
        currentTime,
        day,
        setDay,
        loading,
        setLoading
    } = useContext(indexState)
    
    const handlePay = async (values) => {
        setLoading(true)
        try {
            const user = await addDoc(usersRef, {
                ...values,
                classId: currentClass.id,
                classTime: {from: currentTime.t.from, to: currentTime.t.to},
                ticketStatus: 'pending',
                dateCreated: new Date(),
            });
    
            const payment = await addDoc(paymentsRef, {
                payerId: user.id,
                ticketStatus: 'pending',
                dateCreated: new Date(),
            });
    
            const pay = await createPreference({
                payerId: payment.id,
                payer: {email: values.email,},
                quantity: 1
            })
    
            await updateDoc(user, {payments: arrayUnion(payment.id)})
    
            const checkout = mercadopago.checkout({preference: {id: pay.data.preferenceId}})
    
            return checkout.open()
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="detail-container">
            <div style={{flex: 1}} className="d-flex flex-col jc-sb">
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
                <div style={{flex: 1}} className="class-card-container d-flex flex-col">
                    <div style={{flex: 1}} className="d-flex flex-col jc-sb">
                        <div>
                            <p style={{fontSize: '2rem'}}>{currentClass.title}</p>
                            <br/>
                            <div className="time-card cursor-pointer" style={{fontSize: '1.2rem', width: 'fit-content'}}>
                                <p>{currentTime?.t?.from} - {currentTime?.t?.to}</p>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <Formik
                        initialValues={{
                            firstName: 'maximo',
                            lastName: 'campo',
                            email: 'dev.maximocampo@gmail.com',
                            phone: '5550683351',
                        }}
                        onSubmit={handlePay}
                    >
                        <Form style={{fontSize: '1.2rem'}} className="d-flex flex-col">
                            <label>nombre</label>
                            <Field type="text" name="firstName" />
                            <label>apellido</label>
                            <Field type="text" name="lastName" />
                            <label>email</label>
                            <Field type="text" name="email" />
                            <label>telefono</label>
                            <Field type="text" name="phone" />
                            <div style={{display: 'flex'}}>
                                <div className="checkboxOverride">
                                    <input
                                        type="checkbox"
                                        name=""
                                        id="checkboxInputOverride"
                                    />
                                    <label htmlFor="checkboxInputOverride"/>
                                </div>
                                <p style={{marginTop: 2, fontSize: '0.8rem'}}>Acepto los terminos y condiciones</p>
                            </div>
                            <Button
                                loading={loading}
                                style={{marginLeft: 'auto', marginTop: 10}}
                                type="submit"
                            >
                                PAGAR
                            </Button>
                        </Form>
                    </Formik>
                </div>
        </div>
        </div>
    );
};

export default Book;
