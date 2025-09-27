import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithCredential, 
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  signOut
} from 'firebase/auth';

import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';

import { auth } from '../config/firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------------
// Email/password login
// ------------------------
export const signInWithFirebase = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    let message = "Something went wrong. Please try again.";
    switch (error.code) {
      case "auth/invalid-email": message = "The email address is not valid."; break;
      case "auth/user-disabled": message = "This account has been disabled. Please contact support."; break;
      case "auth/user-not-found": message = "No user found with this email."; break;
      case "auth/wrong-password":
      case "auth/invalid-credential": message = "Invalid email or password."; break;
      case "auth/network-request-failed": message = "Network error. Please check your internet connection."; break;
    }
    throw new Error(message);
  }
};

// ------------------------
// Facebook login with automatic linking
// ------------------------
export const signInWithFacebook = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) throw new Error('User cancelled the login process');

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) throw new Error('Failed to obtain access token');
    const accessToken = data.accessToken;

    const facebookCredential = FacebookAuthProvider.credential(accessToken);

    try {
      // Try signing in directly
      const userCredential = await signInWithCredential(auth, facebookCredential);
      return await getFacebookProfile(userCredential, accessToken);
    } catch (error) {
      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes('password')) {
          throw new Error('This email is already registered with email/password. Please login with email/password to link Facebook.');
        } else {
          throw new Error(error.message);
        }
      } else {
        throw error;
      }
    }

  } catch (error) {
    throw error;
  }
};

// Helper to fetch Facebook profile
const getFacebookProfile = (userCredential, accessToken) => {
  return new Promise((resolve, reject) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken,
        parameters: {
          fields: { string: 'id,name,email,picture.type(large)' },
        },
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          firebaseUser: userCredential.user,
          facebookProfile: result,
        });
      }
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  });
};

// ------------------------
// Signup with email/password
// ------------------------
export const signUpToEmpite = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await AsyncStorage.setItem('user', JSON.stringify(userCredential.user));
    return userCredential.user;
  } catch (error) {
    let message = "Something went wrong. Please try again.";
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered.";
        break;
      case "auth/invalid-email":
        message = "The email address is not valid.";
        break;
      case "auth/operation-not-allowed":
        message = "Email/password accounts are not enabled. Contact support.";
        break;
      case "auth/weak-password":
        message = "The password is too weak. Please choose a stronger password.";
        break;
      case "auth/network-request-failed":
        message = "Network error. Please check your internet connection.";
        break;
    }
    throw new Error(message);
  }
};

// ------------------------
// Logout
// ------------------------
export const logoutFirebase = async () => {
  try {
    await AsyncStorage.removeItem('user');
    return await signOut(auth);
  } catch (error) {
    throw error;
  }
};
