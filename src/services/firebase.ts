import { initializeApp, getApps } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp, query, orderBy, getDocs } from 'firebase/firestore'
import type { AlertEvent } from '../types'

let db: ReturnType<typeof getFirestore> | null = null

export function initFirebase() {
  if (getApps().length) {
    db = getFirestore()
    return db
  }
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  if (!firebaseConfig.projectId) {
    // Not configured, keep db null; app will use local fallback
    return null
  }
  initializeApp(firebaseConfig)
  db = getFirestore()
  return db
}

export async function saveAlert(event: AlertEvent) {
  if (!db) return false
  const ref = collection(db, 'alerts')
  await addDoc(ref, {
    ...event,
    timestamp: Timestamp.fromMillis(event.timestamp),
  })
  return true
}

export async function loadAlerts(): Promise<AlertEvent[] | null> {
  if (!db) return null
  const ref = collection(db, 'alerts')
  const q = query(ref, orderBy('timestamp', 'desc'))
  const snap = await getDocs(q)
  const events: AlertEvent[] = []
  snap.forEach((d) => {
    const data = d.data() as any
    events.push({
      ...data,
      timestamp: data.timestamp?.toMillis?.() ?? data.timestamp,
      id: d.id,
    })
  })
  return events
}