import { useState, useEffect } from 'react';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCuZWDwoMrTpKWZcXfrwBEMxy-9gUrx5Z0",
    authDomain: "cs394reacttutorial.firebaseapp.com",
    databaseURL: "https://cs394reacttutorial-default-rtdb.firebaseio.com",
    projectId: "cs394reacttutorial",
    storageBucket: "cs394reacttutorial.appspot.com",
    messagingSenderId: "672392067621",
    appId: "1:672392067621:web:f2961af06bb89742811dcc",
    measurementId: "G-PYTW0EPWY1"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
};

export const setData = (path, value) => (
    set(ref(database, path), value)
);
