// Firebase configuration and initialization
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from the provided credentials
const firebaseConfig = {
  apiKey: 'AIzaSyC1TtmCTYfNrk3axycdrXQglhXXZnF-Aos',
  authDomain: 'ecoveridian.firebaseapp.com',
  projectId: 'ecoveridian',
  storageBucket: 'ecoveridian.firebasestorage.app',
  messagingSenderId: '899572519820',
  appId: '1:899572519820:web:ff080a6c2b2f9a71dd7ca9',
  measurementId: 'G-W660T03WSR',
};

// Initialize Firebase (singleton pattern to prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
