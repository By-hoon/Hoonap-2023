import firebase_app from "../config";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function getDocument(name: string, id: string) {
  let docRef = doc(db, name, id);

  try {
    return (await getDoc(docRef)).data();
  } catch (error) {
    console.log(error);
    return false;
  }
}
