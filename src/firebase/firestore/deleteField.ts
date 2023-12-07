import firebase_app from "../config";
import { getFirestore, doc, updateDoc, deleteField } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function deleteFieldFunc(name: string, id: string, field: string) {
  let docRef = doc(db, name, id);

  try {
    switch (field) {
      case `${field}`: {
        await updateDoc(docRef, {
          [field]: deleteField(),
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}
