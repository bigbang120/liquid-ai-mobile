import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

/**
 * Returns a reference to the user's profile document.
 */
function getProfileRef(uid) {
  return doc(db, 'users', uid, 'profile', 'main');
}

export async function loadUserProfile() {
  const uid = auth.currentUser ? auth.currentUser.uid : null;
  if (!uid) {
    return null;
  }
  try {
    const docRef = getProfileRef(uid);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('loadUserProfile error', e);
    return null;
  }
}

export async function saveUserProfile(profile) {
  const uid = auth.currentUser ? auth.currentUser.uid : null;
  if (!uid) {
    throw new Error('Not authenticated');
  }
  const data = {
    name: profile.name || '',
    dob: profile.dob || '',
    sex: profile.sex || '',
    species: profile.species || '',
    height_cm: profile.height_cm != null ? profile.height_cm : undefined,
    weight_kg: profile.weight_kg != null ? profile.weight_kg : undefined,
    conditions: Array.isArray(profile.conditions) ? profile.conditions : [],
    medications: Array.isArray(profile.medications) ? profile.medications : [],
    allergies: Array.isArray(profile.allergies) ? profile.allergies : [],
    medicalHistory: profile.medicalHistory || '',
    emergencyContacts: Array.isArray(profile.emergencyContacts) ? profile.emergencyContacts : [],
    updatedAt: Date.now(),
  };
  const docRef = getProfileRef(uid);
  await setDoc(docRef, data, { merge: true });
  return data;
}
