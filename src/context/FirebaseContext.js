import React, {createContext} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const FirebaseContext = createContext();

const Firebase = {
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },
  loginUser: async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      console.log(e);
    }
  },

  registerUser: async (user) => {
    try {
      await auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .catch((error) => {
          console.log('Something went wrong while signing up user: ', error);
        });
      const uid = Firebase.getCurrentUser().uid;

      let userImgUrl = '';
      await firestore()
        .collection('users')
        .doc(uid)
        .set({
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          createdAt: firestore.Timestamp.fromDate(new Date()),
          userImgUrl,
        })
        .catch((error) => {
          console.log(
            'Something went wrong while adding user to firestore: ',
            error,
          );
        });

      if (user.userImg) {
        profilePhotoUrl = await Firebase.uploadUserPhoto(user.userImg);
      }

      delete user.password;

      return {...user, userImgUrl, uid};
    } catch (e) {
      console.log(e);
    }
  },
  uploadUserPhoto: async (userImg) => {
    const uid = Firebase.getCurrentUser().uid;

    try {
      const photo = await Firebase.getBlob(userImg);

      const imageRef = storage().ref('userPhotos').child(uid);
      await imageRef.put(photo);

      const url = await imageRef.getDownloadURL();

      await firestore().collection('users').doc(uid).update({
        userImgUrl: url,
      });

      return url;
    } catch (error) {
      console.log('Error uploading photo: ', error);
    }
  },
  getBlob: async (userImg) => {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = () => {
        reject(new TypeError('Network request failed.'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', userImg, true);
      xhr.send(null);
    });
  },
  logoutUser: async () => {
    try {
      await auth().signOut();
    } catch (e) {
      console.log(e);
    }
  },
};

export const FirebaseProvider = ({children}) => {
  return (
    <FirebaseContext.Provider value={Firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};
