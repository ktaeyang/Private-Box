import firebase from "firebase/compat/app";

// 사용할 파이어베이스 서비스 주석을 해제합니다
//import "firebase/compat/auth";
import "firebase/compat/database";
//import "firebase/compat/firestore";
//import "firebase/compat/functions";
import "firebase/compat/storage";

// Initialize Firebase
//파이어베이스 사이트에서 봤던 연결정보를 여기에 가져옵니다
const firebaseConfig = {
    apiKey: "AIzaSyCAT7Eq4PcQ2c6JmrHaDVr0bXjSiXcvRd0",
    authDomain: "private-box-618c6.firebaseapp.com",
    projectId: "private-box-618c6",
    storageBucket: "private-box-618c6.appspot.com",
    messagingSenderId: "872883304905",
    appId: "1:872883304905:web:569a57cf3a8c7ae6599018",
    measurementId: "${config.measurementId}",
    databaseURL : "https://private-box-618c6-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
//사용 방법입니다. 
//파이어베이스 연결에 혹시 오류가 있을 경우를 대비한 코드로 알아두면 됩니다.
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const firebase_db = firebase.database()