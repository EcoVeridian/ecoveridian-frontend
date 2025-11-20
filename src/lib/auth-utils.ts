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
} from 'firebase/auth';
import { auth } from './firebase';

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
    return { user: null, error: error.message };
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
    return { user: null, error: error.message };
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
    return { error: error.message };
  }
}

/**
 * Update the current user's email address
 * Sends a verification email to the new email address
 */
export async function changeEmail(newEmail: string) {
  try {
    if (!auth.currentUser) {
      throw new Error('No user is currently signed in');
    }
    
    const oldEmail = auth.currentUser.email;
    await updateEmail(auth.currentUser, newEmail);
    
    // Send verification email to the new email address
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the email change if verification email fails
    }
    
    return { error: null, oldEmail };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Update the current user's password
 * Sends a notification email about the password change
 */
export async function changePassword(newPassword: string) {
  try {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No user is currently signed in');
    }
    
    await updatePassword(auth.currentUser, newPassword);
    
    // Send a password reset email as notification
    // (Firebase doesn't have a dedicated "password changed" notification,
    // so we send a verification email to confirm the change)
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the password change if notification email fails
    }
    
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
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
    return { error: error.message };
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
    return { error: error.message };
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
    return { error: error.message };
  }
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}
