import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Function to create an admin user in Firestore
export async function createAdminInDatabase(email, role = "normal") {
  try {
    const adminData = {
      email: email.toLowerCase(),
      role: role, // "normal" or "super"
      createdAt: new Date(),
      isActive: true
    };

    // Add to admins collection
    const docRef = await addDoc(collection(db, "admins"), adminData);
    console.log("Admin created with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating admin: ", error);
    return { success: false, error: error.message };
  }
}

// Function to check if an admin exists
export async function checkAdminExists(email) {
  try {
    const { collection, query, where, getDocs, limit } = await import("firebase/firestore");
    const adminsRef = collection(db, "admins");
    const q = query(
      adminsRef,
      where("email", "==", email.toLowerCase()),
      limit(1)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (error) {
    console.error("Error checking admin: ", error);
    return false;
  }
}

// Function to setup initial admin (call this once)
export async function setupInitialAdmin() {
  const adminEmail = "admin@impactproduction.com"; // Change this to your desired admin email
  
  try {
    const exists = await checkAdminExists(adminEmail);
    if (exists) {
      console.log("Admin already exists");
      return { success: true, message: "Admin already exists" };
    }

    const result = await createAdminInDatabase(adminEmail, "super");
    if (result.success) {
      console.log("Initial admin created successfully!");
      console.log(`Email: ${adminEmail}`);
      console.log("You can now create a Firebase Auth user with this email and use it to log in.");
      return { success: true, message: "Admin created successfully" };
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error setting up admin: ", error);
    return { success: false, error: error.message };
  }
}
