// Authentication utility functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import { getFirebaseErrorMessage } from './firebase-error-messages';

/**
 * Sign up a new user with email and password
 * Sends a welcome verification email after account creation
 */
export async function signUp(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // Send verification email after successful signup
    try {
      await sendEmailVerification(userCredential.user);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails
    }
    
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Sign in with Google using popup
 */
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Sign out the current user
 */
export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Update the current user's email address
 * Automatically sends a verification email to the new email address
 */
export async function changeEmail(newEmail: string) {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const oldEmail = auth.currentUser.email;
    await updateEmail(auth.currentUser, newEmail);
    
    // Firebase automatically sends a verification email to the new address
    // No need to manually call sendEmailVerification
    
    return { error: null, oldEmail };
  } catch (error: any) {
    return { error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Update the current user's password
 */
export async function changePassword(newPassword: string) {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user is currently signed in');
    }
    
    await updatePassword(auth.currentUser, newPassword);
    
    return { error: null };
  } catch (error: any) {
    return { error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Re-authenticate the current user (required for sensitive operations)
 */
export async function reauthenticate(currentPassword: string) {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user is currently signed in');
    }
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    return { error: null };
  } catch (error: any) {
    return { error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Delete the current user's account
 */
export async function deleteAccount() {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    await deleteUser(auth.currentUser);
    return { error: null };
  } catch (error: any) {
    return { error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Send a password reset email
 */
export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: getFirebaseErrorMessage(error) };
  }
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
