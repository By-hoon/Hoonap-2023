import firebase_app from "../config";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function updateField(name: string, id: string, field: string, data: any) {
  let docRef = doc(db, name, id);

  try {
    switch (field) {
      case "storyIds": {
        await updateDoc(docRef, {
          storyIds: data,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}
