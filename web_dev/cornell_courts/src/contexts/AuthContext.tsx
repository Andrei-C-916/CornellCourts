// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

interface AuthContextValue {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        { merge: true }
      );

      setUser(user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Save user data to Firestore
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          },
          { merge: true }
        );
      }
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
