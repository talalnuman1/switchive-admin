import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDTePp1n_3F4y05-wU-0yUwY-7a-c_RGlc",
  authDomain: "switchive-1958e.firebaseapp.com",
  projectId: "switchive-1958e",
  storageBucket: "switchive-1958e.appspot.com",
  messagingSenderId: "908121965619",
  appId: "1:908121965619:web:5fad2fda5698a68ff58f46",
  measurementId: "G-DQ096HRJ40"
};

const app = initializeApp(firebaseConfig);
export const Storage = getStorage(app);

