// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "quikscribe-ac449.firebaseapp.com",
  projectId: "quikscribe-ac449",
  storageBucket: "quikscribe-ac449.appspot.com",
  messagingSenderId: "971314891117",
  appId: "1:971314891117:web:8cbccb6811d019c7317264"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadFile = async (image_url: string, name: string) => {
  try {
    const res = await fetch(image_url)
    const buffer = await res.arrayBuffer()

    const file_name = name.replace(" ", "") + Date.now() + '.jpeg';
    const storageRef = ref(storage, file_name)

    await uploadBytes(storageRef, buffer, {
      contentType: 'image/jpeg'
    });

    const firebaseUrl = await getDownloadURL(storageRef)
    return firebaseUrl
  } catch (error) {
    console.error(error)
  }
}