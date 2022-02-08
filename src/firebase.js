// For Firebase JS SDK v7.20.0 and later, measurementId is optional


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/storage';
import { getStorage, ref } from "firebase/storage"




const firebaseApp = firebase.initializeApp(
    {
        apiKey: "AIzaSyCuXlXU3Z1ZaFsBW8YTypgjVN1x5Vf4vw0",
        authDomain: "instagram-clone-53f1a.firebaseapp.com",
        projectId: "instagram-clone-53f1a",
        storageBucket: "instagram-clone-53f1a.appspot.com",
        messagingSenderId: "865799815938",
        appId: "1:865799815938:web:5da79d5fd49bf99bb6381b",
        measurementId: "G-1FW4R1LW0Q"
    }

)  ; 


const db = firebaseApp.firestore() ; 
const auth = firebase.auth() ; 
const storage = getStorage(); 


export {db , auth  , storage }  ;
