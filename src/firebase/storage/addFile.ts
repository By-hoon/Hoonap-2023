import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const storage = getStorage();

export default async function addFile(file: Blob, name: string) {
  let fileUrl = null;
  let error = null;

  const storageRef = ref(storage, name);

  try {
    fileUrl = await uploadBytes(storageRef, file).then(
      async () => await getDownloadURL(ref(storage, name)).then((url) => url)
    );
  } catch (e) {
    error = e;
  }

  return { fileUrl, error };
}
