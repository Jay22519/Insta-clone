import { Button } from '@material-ui/core'
// import React from 'react'
import React , {useState , useEffect } from 'react'
import firebase from 'firebase/compat/app';
import {auth, db , storage } from './firebase'
import { getStorage, ref, uploadBytesResumable, uploadBytes  , getDownloadURL } from "firebase/storage"
// import React from 'react'


import './ImageUpload.css' ; 






function ImageUpload({username}) {
    const [image , setImage] = useState(null) ; 
    const [url , setUrl] = useState("") ; 
    const [progress , setProgress] = useState(0) ; 
    const [caption , setCaption] = useState('') ; 


    // const metadata = {
    //     contentType: 'image/jpeg'
    //   };

    const handleChange = (e) =>{


        if(e.target.files[0]) {
            setImage(e.target.files[0]) ; 
            console.log(e.target.files.length + " is length")
            console.log(JSON.stringify(e.target.files[0] )+ " is the file location")
            console.log(+image+ " is the file location")
        }
    }


    const handleUpload =() =>{
            //const spaceRef = ref(storage, 'images/${image.name}');
            //const uploadTask = storageRef.child('images/${image.name}').put(image);
            //const uploadTask = spaceRef.put(image) 
            //
            const storageRef = ref(storage, image.name);
            const uploadTask = uploadBytesResumable(storageRef, image);
            //const storageRef_child =    storageRef.child(image.name) ; 

            uploadTask.on(
                "state_changed"  , 
                (snapshot) =>{
                    //Progess function 

                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress)
                    setProgress(progress)
                } , 
                (error) => {
                    console.log(error) ; 
                    alert(error.message)
                } , 
                () => {
                    //Complete function 
                    // uploadTask.snapshot.ref
                    getDownloadURL(storageRef).then(url => {
                        // post image inside db 
                        db.collection('post_database').add({
                                timestamp : firebase.firestore.FieldValue.serverTimestamp() || null ,
                                caption : caption , 
                                imageUrl : url ,
                                username : username

                        }) ; 

                    })

                    
                    console.log("Upload done now") ;  

                    
                    setProgress(0) ; 
                    setCaption("")  ;
                    setImage(null) ; 
                    setUrl('') ; 

                } 

                
            )
            
    }

    return (
        <div className = "imageupload">
            
                <h1>ImageUpload</h1>
                {/** I want to have caption input */}
                {/** File picker  */}
                {/** Post button */}

                <progress className="imageupload__progress" value = {progress} max ="100" />
                <input type = "text" placeholder="Enter a caption..."  onChange={event => setCaption(event.target.value)} ></input>
                <input type ="file" onChange={handleChange}></input>
                <Button onClick={handleUpload}>
                    Upload
                </Button>



        </div>
    )
}

export default ImageUpload
