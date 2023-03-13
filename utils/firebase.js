import { db, addDoc, collection, query, where, getDocs, getDoc } from '../store/index.js';

export const add = async (data) => {
  try {
    const addRecord = await addDoc(collection(db, 'channels'), data);
    console.log('record added with ID: ', addRecord.id);
  } catch (e) {
    console.error('Error adding record: ', e);
  }
};

export const read = async (channel) => {
  let store = [];
  try {
    const q = query(collection(db, 'channels'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      store.push(doc.data().incoming_webhook);
      console.log('the data', store);
    });
  } catch (e) {
    console.error('Error reading record: ', e);
  }
};
