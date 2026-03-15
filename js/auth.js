import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "[gstatic.com](https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js)";
import { doc, getDoc } from "[gstatic.com](https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js)";

const ROLE_ROUTES = {
  admin: '/admin.html',
  manager: '/manager.html',
  landlord: '/landlord.html'
};

export async function loginUser(email, password) {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
  if (!userDoc.exists()) throw new Error('User record not found in database.');
  const data = userDoc.data();
  if (data.status === 'suspended') throw new Error('Your account has been suspended.');
  return data;
}

export function logoutUser() {
  return signOut(auth);
}

export function guardPage(allowedRoles) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Auth timeout'));
      window.location.href = '/index.html';
    }, 10000);

    onAuthStateChanged(auth, async user => {
      clearTimeout(timeout);
      if (!user) {
        window.location.href = '/index.html';
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          window.location.href = '/index.html';
          return;
        }
        const data = userDoc.data();
        if (data.status === 'suspended') {
          await signOut(auth);
          window.location.href = '/index.html';
          return;
        }
        if (!allowedRoles.includes(data.role)) {
          window.location.href = ROLE_ROUTES[data.role] || '/index.html';
          return;
        }
        resolve({ user, userData: data });
      } catch (err) {
        window.location.href = '/index.html';
      }
    });
  });
}

export function redirectIfLoggedIn() {
  return new Promise(resolve => {
    const timeout = setTimeout(() => resolve(null), 8000);
    onAuthStateChanged(auth, async user => {
      clearTimeout(timeout);
      if (!user) { resolve(null); return; }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.status !== 'suspended') {
            window.location.href = ROLE_ROUTES[data.role] || '/index.html';
            return;
          }
        }
        resolve(null);
      } catch {
        resolve(null);
      }
    });
  });
}
