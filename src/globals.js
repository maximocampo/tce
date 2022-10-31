import {connectFunctionsEmulator, getFunctions, httpsCallable} from "firebase/functions";
import fb from "gatsby-plugin-firebase-v9.0";
import {collection, getFirestore} from "firebase/firestore";

export const seachToObj = str => {
    return JSON.parse('{"' + str.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}

const functions = getFunctions(fb)
export const firestore = getFirestore(fb)
export const classesRef = collection(firestore, '/classes');
export const paymentsRef = collection(firestore, '/payments');
export const usersRef = collection(firestore, '/users');
process.env.NODE_ENV === 'development' && connectFunctionsEmulator(functions, "localhost", 5001);

export const createPreference = httpsCallable(functions, 'createPreference');
export const getPayment = httpsCallable(functions, 'getPayment');
export const sendConfirmMail = httpsCallable(functions, 'sendConfirmMail');

