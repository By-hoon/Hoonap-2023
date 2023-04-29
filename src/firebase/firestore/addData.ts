import firebase_app from "../config";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function addData(colllection: string, data: {}) {
  try {
    return await addDoc(collection(db, colllection), data);
  } catch (error) {
    console.log(error);
    return false;
  }
}
