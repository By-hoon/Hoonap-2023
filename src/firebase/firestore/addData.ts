import firebase_app from "../config";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function addData(colllection: string, data: {}) {
  let result = null;
  let error = null;

  try {
    result = await addDoc(collection(db, colllection), data);
  } catch (e) {
    error = e;
  }

  return { result, error };
}