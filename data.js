import { appState, requestRender, toast } from './state.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, setDoc, updateDoc, onSnapshot, collection, getDoc, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyD89Xg5V3EAozOEa-X0Um6TD0ykQQWbrPs',
  authDomain: 'ipa-system-54629.firebaseapp.com',
  projectId: 'ipa-system-54629',
  storageBucket: 'ipa-system-54629.firebasestorage.app',
  messagingSenderId: '1008780769443',
  appId: '1:1008780769443:web:7324e69a857356fdefe716'
};

let app, db, auth;

export async function initFirebase() {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  await setPersistence(auth, browserLocalPersistence);
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      appState.userId = user.uid;
      await loadUser(user.uid);
    } else {
      appState.role = 'unauthenticated';
      appState.user = {};
      requestRender();
    }
  });
  await signInAnonymously(auth);
}

async function loadUser(uid) {
  const userRef = doc(db, 'artifacts/ipa-system-54629/public/data/users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    appState.user = snap.data();
    appState.role = snap.data().role;
  }
  listenForData();
  requestRender();
}

function listenForData() {
  const studentsRef = collection(db, 'artifacts/ipa-system-54629/public/data/students_data');
  onSnapshot(studentsRef, (snapshot) => {
    appState.dashboard.students = snapshot.docs.map((d) => d.data());
    requestRender();
  });
}

export async function simulateRole(role) {
  const userRef = doc(db, 'artifacts/ipa-system-default/public/data/users', appState.userId);
  const base = role === 'student' ? { role: 'student', studentId: 'S1001', name: 'Alex Thompson' } : role === 'teacher' ? { role: 'teacher', name: 'Ms. Clara Johnson' } : role === 'parent' ? { role: 'parent', name: 'Mr. David Thompson', linkedStudentId: 'S1001' } : { role: 'admin', name: 'Dr. Evelyn Reed' };
  await setDoc(userRef, base, { merge: true });
  toast(`Logged in as ${role}`);
}