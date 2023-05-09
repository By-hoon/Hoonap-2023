import firebase_app from "../config";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function getCollection(name: string) {
  let colRef = collection(db, name);

  try {
    return await getDocs(colRef);
  } catch (error) {
    console.log(error);
    return false;
  }
}
