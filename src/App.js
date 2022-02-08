
import logo from "./Images/instagram_logo.jpg" ; 
import Avatar from "@material-ui/core/Avatar"
import './App.css'
import './ImageUpload.css' ;
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import React , {useState , useEffect } from 'react'

import { getStorage, ref, uploadBytesResumable, uploadBytes  , getDownloadURL } from "firebase/storage"
import {auth, db , storage} from './firebase'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InstagramEmbed from 'react-instagram-embed';




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {





  const [open, setOpen] = React.useState(false);
  const [openSignIn, setOpenSignin] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenSignin = () => setOpenSignin(true);
  const handleClose = () => setOpen(false);
  const handleCloseSignin = () => setOpenSignin(false);

  const [posts , setPosts] = useState([]) ; 
  const [progress , setProgress] = useState(0) ; 
  const [username , setUsername] = useState('') ; 
  const [email , setEmail] = useState('') ; 
  const [password , setPassword] = useState('') ; 
  const [image , setImage] = useState(null) ; 
  const[user , setUser] = useState(null) ; 

  var [imageURL , setImageURL] = useState('')

  var user_name_toshow = 'instagram_user'

  var imageUrl = ''

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if(authUser)
      {
          // User logged in
          console.log(authUser) ; 
          setUser(authUser) ; 

          if(authUser.displayName)
          {
            {image_URL()}
          }   
          else 
          {
            {image_URL()}
            return authUser.updateProfile({
              displayName : username
            })

          }
      }
      else 
      {
        //User logged out
        setUser(null) ; 
      }
    })

    return () =>{
      //Perform some clean up actions
      unsubscribe() ; 
    }
  } , [user, username]) ; 


  
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
      const storageRef = ref(storage, "userProfile/" + username);
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
                  setImageURL({url})
                  imageUrl = url ; 

              })

              
              console.log("Upload done now") ;  

              
              setProgress(0) ; 

          } 

          
      )
      
}



  const signUp = (event) => {


    event.preventDefault() ; 

      auth
      .createUserWithEmailAndPassword(email , password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName : username
        } ,  user_name_toshow = username)
      })
      .catch((error) => alert(error.message))



      console.log( imageUrl + "while signing up ")
      console.log({user})
      
      setOpen(false) ; 



  }


  const image_URL = () => {

      const storageRef = ref(storage, "userProfile/" + user.displayName);

      getDownloadURL(storageRef).then(url => {
          setImageURL(imageURL = url)
          //setImageURL(url)
          imageUrl =  url
          console.log(imageURL+ "is url IN image_url")

      })

  }

  const login = (event) => {
    event.preventDefault() ; 

    auth
    .signInWithEmailAndPassword(email , password)
    .catch((error) => alert(error.message))
    .then(user_name_toshow = username)


    
 
    setOpenSignin(false) ; 


   

  }


    // Use effect runs a peice of code based on a specific condition

      useEffect(()=>{
            db.collection('post_database').orderBy('timestamp' ,'desc').onSnapshot(
              snapshot => {
                setPosts(snapshot.docs.map( doc => ({
                  id : doc.id  , 
                  post : doc.data() 
                })

                ))
              }
            )
      } , []) ; 




      console.log(imageURL + "is inside div") ; 
  return (
    <div className="app">



    <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">


                  
                    <center>
                    <img className="modal__image"  src={logo} alt="Instagram logo" />
                    </center>
                    <center>
                        <div className = "imageupload">

                         
                              < input type="text" 
                                  placeholder = "username"
                                  value = {username}
                                  onChange={(e) => setUsername(e.target.value)}/>

                                  
                                  <input type="text" 
                                  placeholder = "email"
                                  value = {email}
                                  onChange={(e) => setEmail(e.target.value)}/>

                                  <input type="password" 
                                  placeholder = "password"
                                  value = {password}
                                  onChange={(e) => setPassword(e.target.value)}/>


                                  <progress className="imageupload__progress" value = {progress} max ="100" />
                                  
                                  <input type ="file" onChange={handleChange}></input> 
                                  <Button onClick = {handleUpload}>Upload</Button>
                                  <Button onClick={signUp}>
                                      Submit
                                  </Button>



                        </div>



                    </center>

    
                  

                  
              </Typography>
              {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography> */}
            </Box>
          </Modal>




    <Modal
            open={openSignIn}
            onClose={handleCloseSignin}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">


                  <form className = "app__signup" >

                    <center>
                    <img className="modal__image"  src={logo} alt="Instagram logo" />
                    </center>     

                    <center>

                    <input type="text" 
                    placeholder = "email"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}/>

                    <input type="password" 
                    placeholder = "password"
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}/>


                    

                    <br/>
                    <Button type="submit" onClick={login}>Login</Button> 



                    </center>

                  </form>
                  

                  
              </Typography>
              {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography> */}
            </Box>
          </Modal>
        
      
      <div className = "app__header">
      {/* * Header */}

      
      <img className="app__headerImage"  src={logo} alt="Instagram logo" />
      {user ? (

            
            <div className = "app__loginContainer">
              
            <Button onClick={() => auth.signOut()}>Logout</Button>
            
            <Avatar
            className = "post__avatar"
            alt = "_jaypuri_"
            src = {imageURL}>
            
            
            </Avatar>

            {/* <p>{imageURL} is url</p> */}

            

     
            </div>
      ) : (
          <div className = "app__loginContainer">
            <Button onClick={handleOpen}>Sign-Up</Button>
            <Button onClick={handleOpenSignin}>Login-in</Button>
              <div className = "post__header">
              <Avatar
              className = "post__avatar"
              alt = "_jaypuri_"
              src = {imageUrl}>
              
              
              </Avatar>

              

              </div>
            
            </div>
        
      )}


      
      </div>


      


      
    <div className = "app__posts">
              
      <center>
      <h3>Welcome to Instagram clone</h3>
      <br/>
      {
            posts.map(({id,post})=>(
              <Post  key = {id} postId={id} user = {user}  username={post.username}  
                  caption={post.caption} 
                  imageUrl={post.imageUrl}/>
            ))
          }

      </center>




    </div>


        


    
      


    <center>

      

      <div id ="imageupload">

      {user ? (
            <ImageUpload username = {user.displayName}/>
      ) : (//Do nothing
            <div>
              </div>
        )}


      </div>

      </center>

      


      {/* <Post username="_jaypuri_" caption="This is my Instagram"  imageUrl= ""/> */}
      {/* <Post username="_jaypuri_" caption="This is my Instagram"  imageUrl= "./Images/test2.jpg"/>
      <Post username="_jaypuri_" caption="This is my Instagram"  imageUrl= "./Images/myphoto.jpg"/>
 */}


      {/** Post */}
      {/** Post */}

    </div>
  );
}

export default App;





















  // const [posts , setPosts] = useState([
  //     {username :"_jaypuri_" , 
  //      caption : "This is my Instagram"  , 
  //      imageUrl :  "./Images/test.jpg"} , 

  //     {username :"_jaypuri_" , 
  //      caption : "This is my Instagram"  , 
  //      imageUrl : "./Images/test2.jpg"} , 

  //      {
  //       username : "_jaypuri_" ,
  //       caption :"This is my Instagram" ,
  //         imageUrl : "./Images/myphoto.jpg"
  //      }

  // ]) ; 
