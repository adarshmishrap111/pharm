// Lightweight Firebase client helpers (uses compat SDK included via CDN in pages)
(function () {
  function initFirebase() {
    if (typeof window === 'undefined') return;
    if (window.__firebase_initialized) return;
    if (!window.FIREBASE_CONFIG) {
      console.warn('FIREBASE_CONFIG missing');
      return;
    }
    try {
      // firebase (compat) should be available via CDN script in the page
      if (typeof firebase === 'undefined') {
        console.warn('firebase SDK not found. Include compat SDK scripts before this file.');
        return;
      }
      firebase.initializeApp(window.FIREBASE_CONFIG);
      window.__firebase_initialized = true;
      window.__firebase_auth = firebase.auth();
      window.__firebase_storage = firebase.storage();
    } catch (e) {
      console.warn('Firebase init error', e);
    }
  }

  async function registerWithEmail(name, email, password, phone) {
    initFirebase();
    if (!window.__firebase_auth) throw new Error('Firebase Auth not initialized');
    const userCred = await window.__firebase_auth.createUserWithEmailAndPassword(email, password);
    if (userCred && userCred.user) {
      try {
        await userCred.user.updateProfile({ displayName: name });
      } catch (e) {}
      // Sync profile to server for backend lookups
      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone })
        });
      } catch (e) { console.warn('Profile sync failed', e); }
      return userCred.user;
    }
    throw new Error('Registration failed');
  }

  async function loginWithEmail(email, password) {
    initFirebase();
    if (!window.__firebase_auth) throw new Error('Firebase Auth not initialized');
    const userCred = await window.__firebase_auth.signInWithEmailAndPassword(email, password);
    return userCred.user;
  }

  async function uploadImageToStorage(file, prefix = 'products') {
    initFirebase();
    if (!window.__firebase_storage) throw new Error('Firebase Storage not initialized');
    const storageRef = window.__firebase_storage.ref();
    const name = `${prefix}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9\.\-_]/g, '_')}`;
    const fileRef = storageRef.child(name);
    const snapshot = await fileRef.put(file);
    const url = await snapshot.ref.getDownloadURL();
    return url;
  }

  // Expose helpers
  if (typeof window !== 'undefined') {
    window._FirebaseClient = {
      initFirebase,
      registerWithEmail,
      loginWithEmail,
      uploadImageToStorage
    };
  }
  // Export for modules if supported
  try { if (typeof exports !== 'undefined') exports._FirebaseClient = window._FirebaseClient; } catch (e) {}
})();
