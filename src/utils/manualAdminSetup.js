// Manual Admin Setup Utility
// Use this when automatic admin creation fails due to Firestore permissions

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Manually add an admin record to Firestore
 * Call this function from the browser console when automatic creation fails
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Import this function: import { addManualAdmin } from './src/utils/manualAdminSetup.js'
 * 3. Call: addManualAdmin('admin@example.com', 'super', 'firebase-uid-here')
 */
export async function addManualAdmin(email, role, uid) {
  try {
    const docRef = await addDoc(collection(db, "admins"), {
      email: email.toLowerCase(),
      role: role, // 'super' or 'normal'
      uid: uid,
      createdAt: new Date(),
      manuallyAdded: true
    });
    console.log("Admin record added successfully with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding admin record: ", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get the UID of a user from Firebase Auth
 * This helps you get the UID when you need to manually add an admin record
 */
export function getCurrentUserUID() {
  // This would need to be called from a logged-in user context
  console.log("Current user UID:", window.currentUser?.uid || "No user logged in");
  return window.currentUser?.uid;
}
