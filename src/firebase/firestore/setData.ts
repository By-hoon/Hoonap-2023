import firebase_app from "../config";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function setData(colllection: string, id: string, data: {}) {
  try {
    await setDoc(doc(db, colllection, id), data, {
      merge: true,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
