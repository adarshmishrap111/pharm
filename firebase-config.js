// Firebase configuration (provided by user)
// This file exposes the config as `window.FIREBASE_CONFIG` for simple inclusion in HTML,
// and also exports `firebaseConfig` if used in ES modules.

const firebaseConfig = {
  apiKey: "AIzaSyD7cLsV1ROfalgYouY5_h5K8DTyoUsH_O8",
  authDomain: "pharmida-healthcare.firebaseapp.com",
  projectId: "pharmida-healthcare",
  storageBucket: "pharmida-healthcare.firebasestorage.app",
  messagingSenderId: "998490085971",
  appId: "1:998490085971:web:11f09b6132d3ec731ac4a6"
};

// Expose on window for plain <script> usage
if (typeof window !== 'undefined') {
  window.FIREBASE_CONFIG = firebaseConfig;
}

// Also export for ES module usage
try {
  // eslint-disable-next-line no-undef
  if (typeof exports !== 'undefined') {
    // CommonJS
    exports.firebaseConfig = firebaseConfig;
  }
} catch (e) {}

export default firebaseConfig;
