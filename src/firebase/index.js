import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
})

export const firestore = app.firestore()
export const serverTimestamp = firebase.firestore.Timestamp
export const auth = app.auth()

export const TICKETS_COLLECTION = firestore.collection('tickets')
export const ORDERS_COLLECTION = firestore.collection('orders')
export const USERS_COLLECTION = firestore.collection('users')
export const ORDER_COLLECTION = firestore.collection('order')

export default firebase