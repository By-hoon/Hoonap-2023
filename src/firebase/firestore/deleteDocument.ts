import firebase_app from "../config";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function deleteDocument(name: string, id: string) {
  let docRef = doc(db, name, id);

  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.log(error);
  }
}
