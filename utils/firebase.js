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
  let store;
  try {
    const q = query(collection(db, 'channels'), where('channel_id', '==', channel));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log('object', doc.data());
      store = doc.data();
    });
    return store;
  } catch (e) {
    console.error('Error reading record: ', e);
  }
};
