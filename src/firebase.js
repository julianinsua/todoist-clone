import firebase from "firebase/app";
import 'firebase/firestore';  

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyBdxdVM_I1sT-zNhaFDbIQusgS1e_J_5RE",
    authDomain: "julious-todoist-clone.firebaseapp.com",
    databaseURL: "https://julious-todoist-clone.firebaseio.com",
    projectId: "julious-todoist-clone",
    storageBucket: "julious-todoist-clone.appspot.com",
    messagingSenderId: "144306164534",
    appId: "1:144306164534:web:37fa1da7a9535e1de75997"
});

export { firebaseConfig as firebase };
