import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { db } from '../firebase'; // your Firebase configuration file
import { collection, addDoc } from 'firebase/firestore';

const GoogleSheetToFirestore = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Replace with your public Google Sheets CSV URL
    // const sheetUrl = 'https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/edit?gid=485741054#gid=485741054';
    // for csv downlod content
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/gviz/tq?tqx=out:csv&gid=485741054';

    fetch(sheetUrl)
      .then(response => response.text())
      .then(csvData => {
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            setData(result.data);
            writeDataToFirestore(result.data);
          },
        });
      });
  }, []);

  const writeDataToFirestore = async (sheetData) => {
    try {
      const collectionRef = collection(db, 'data'); // 'data' is your Firestore collection
  
      for (const item of sheetData) {
        // Standardize the order of keys in each item
        const orderedItem = Object.keys(item)
          .sort()
          .reduce((obj, key) => {
            obj[key] = item[key];
            return obj;
          }, {});
  
        // Add each row as a document in Firestore
        await addDoc(collectionRef, orderedItem);
      }
  
      console.log('Data written to Firestore successfully in ordered format!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  
  return (
    <div>
      <h1>Google Sheets Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default GoogleSheetToFirestore;
