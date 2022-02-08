import React from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import xtype from 'xtypejs'
import firebase from 'firebase/compat/app';
import {useState , useEffect } from 'react'


import {auth, db , storage } from './firebase'


import { getStorage, ref, uploadBytesResumable, uploadBytes  , getDownloadURL } from "firebase/storage"
function Post({postId, user , username  , caption , imageUrl}) {



    const post_type = "img"
    const searchTerm = 'mp4';
    const indexOfFirst = imageUrl.indexOf(searchTerm);


    const [comments , setComments] = useState([]) ; 
    const [comment , setComment] = useState('')
    const [commentReply , setCommentReply] = useState('') ;
    var [userImage, setUserImage] = useState('') ; 


    const user_image_URL = () => {

        const storageRef = ref(storage, "userProfile/" + username);

        getDownloadURL(storageRef).then(url => {
            setUserImage(userImage = url)
            //setImageURL(url)
            imageUrl =  url
            console.log(userImage+ "is url IN image_url")
  
        })
  
    }
  

    useEffect(() => {
        let unsubscribe ; 

        if(postId)
        {
            unsubscribe = db
            .collection("post_database")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp' , 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data())) ; 
            })
        }

        return () => {
            unsubscribe() ; 
        } ; 
    }, [postId])
    
    // console.log(postId + "is passed")
    // console.log(comments) ; 
    // console.log(imageUrl + "is url in post component")
    // console.log(username + "is username in Post component")
    // console.log(comments)    
    let post ; 
    if(indexOfFirst != -1)
    {
        post = <video  controls className="post__Video">
        <source src={imageUrl} type="video/mp4"/>
        </video>

        {user_image_URL()}
        


    }
    else 
    {
        post = <img className="post__Image" src= {imageUrl} alt= "JPG" />
        {user_image_URL()}
    }


    const postComment =(event) =>{

        event.preventDefault() ; 

        db
        .collection("post_database")
        .doc(postId)
        .collection("comments")
        .add({
            text : comment , 
            username : user.displayName ,
            timestamp : firebase.firestore.FieldValue.serverTimestamp() || null
        })

        setComment('')

    
    }



    console.log("In post.js before return " + userImage)
    return (
        <div className = "post">
            <div className = "post__header">
            <Avatar
            className = "post__avatar"
            alt = "_jaypuri_"
            src = {userImage}>
            
            
            </Avatar>

            <h3>{username}</h3>

            </div>
             


           {/** Header -> Avaratar + Username */}


           

           {post}
            
           {/** Image */}
            <h4 className = "post__text"><strong>{username} :</strong> {caption}</h4>
           {/** Username + caption */}
    
                <div className="post__comments">
                    {

                        comments.map((comment) => {
                                                                                
                            
                            // var text = comment.text ; 
                            // var name = comment.username ; 
                            // console.log(text + " " + name) ;
                            return <div className ="post__commentsInside">
                                <label><b>{comment.username}</b> : {comment.text}</label> 
                                {/* 
                                        Replying to a comment functionality
                                <form className="post__commentBox_reply">

                                <input 
                                    type = "text" 
                                    placeholder = "Reply"
                                    value = {commentReply + ""}
                                    onChange = {(e) => setCommentReply( e.target.value)}
                                />
                                <button
                                className = "post__button"  
                                disabled={!commentReply}
                                type = "submit"
                                onClick={postComment}>
                                    Post
                                    </button>
                                </form> */}
                                        </div>
                                    



                        })

                    }
                        


                </div>



                {
                    user && (
                        <div>
                        <br></br>
                        <p className = "post__comment_word">
                                Comments :
                        </p>    
                        <form className="post__commentBox">
    
                            <input 
                                className = "post__input" 
                                type = "text" 
                                placeholder = "Add a comment"
                                value = {comment + ""}
                                onChange = {(e) => setComment(e.target.value)}
                            />
                            <button
                            className = "post__button"  
                            disabled={!comment}
                            type = "submit"
                            onClick={postComment}>
                                Post
                                </button>
                        </form>
                        </div>
                    )
                }
                
                
            



           
            
        </div>
    )
}

export default Post
