// === Firebase Configuration ===
const firebaseConfig = {
    apiKey: "AIzaSyADyJbkYryUHvfoLHHu1GVJkIvLcHg7cr4",
    authDomain: "different-store-d935d.firebaseapp.com",
    projectId: "different-store-d935d",
    storageBucket: "different-store-d935d.firebasestorage.app",
    messagingSenderId: "148780624236",
    appId: "1:148780624236:web:e92420a6423731d9e92b49"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        const app = firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully");
    } else {
        console.log("✅ Firebase already initialized");
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Bosta API configuration (Secure - should be stored in backend)
const BOSTA_API_KEY = "bosta_";
const BOSTA_API_URL = "https://app.bosta.co/api/v0";

// Security functions
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^01[0-9]{9}$/;
    return re.test(phone);
}

// Firebase Firestore rules template
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if true; // Anyone can create orders
      allow update, delete: if request.auth != null; // Only authenticated users can update/delete
    }
    
    // Admin users collection
    match /admins/{adminId} {
      allow read, write: if request.auth != null && request.auth.uid == adminId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Admin write access
    }
  }
}
`;

console.log("Firebase configuration loaded successfully");