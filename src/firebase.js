import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCGwQX7YcsN2PvKM8l_wDpHx-cxSEQEIRk",
  authDomain: "blog2an-558cb.firebaseapp.com",
  projectId: "blog2an-558cb",
  storageBucket: "blog2an-558cb.appspot.com",
  messagingSenderId: "1076154546244",
  appId: "1:1076154546244:web:1503ae16a269a2e622a411",
  measurementId: "G-MVPCVSY0YP",
};

const fire = firebase.initializeApp(firebaseConfig);
firebase.analytics();
export default fire;
