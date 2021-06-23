import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [authUser, setUser] = useState(null);

  const authFunctions = {
    login: async (email, password) => {
      try {
        await auth().signInWithEmailAndPassword(email, password);
      } catch (e) {
        console.log(e);
      }
    },
    register: async (username, email, password) => {
      try {
        await auth()
          .createUserWithEmailAndPassword(email, password)
          .then((result) => {
            result.user.updateProfile({
              displayName: username,
            });
          })
          .then(() => {
            firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .set({
                username: username,
                email: email,
                petsList: {},
                ownersList: {},
                createdAt: firestore.Timestamp.fromDate(new Date()),
                userImg: null,
              })
              .catch((error) => {
                console.log(
                  'Something went wrong while adding user to firestore: ',
                  error,
                );
              });
          })
          .catch((error) => {
            console.log('Something went wrong while signing up user: ', error);
          });
      } catch (e) {
        console.log(e);
      }
    },
    logout: async () => {
      try {
        await auth().signOut();
      } catch (e) {
        console.log(e);
      }
    },
    changeDisplayName: async (username) => {
      try {
        authUser.updateProfile({
          displayName: username,
        });
      } catch (e) {
        console.log(e);
      }
    },
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setUser,
        ...authFunctions,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
