import { initializeApp, getApps, getApp } from "firebase/app"
import { getAnalytics, isSupported } from "firebase/analytics"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyDud25MOfFkOPAsiJipawCarie5VDXaxiA",
  authDomain: "akhadua-sambalpuri.firebaseapp.com",
  databaseURL: "https://akhadua-sambalpuri-default-rtdb.firebaseio.com",
  projectId: "akhadua-sambalpuri",
  storageBucket: "akhadua-sambalpuri.firebasestorage.app",
  messagingSenderId: "347219258331",
  appId: "1:347219258331:web:e6b33c1718954cbbf995fe",
  measurementId: "G-NCLKE1FFK9",
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const analytics = async () => {
  if (typeof window === "undefined") return null
  if (await isSupported()) return getAnalytics(app)
  return null
}

export const database = getDatabase(app)
