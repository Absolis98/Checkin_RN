import React, {createContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

function reformatDataCluster(doc) {
  const gList = [];
  const pList = [];
  const oList = [];
  if (doc.groupsList != undefined) {
    let groupsList = doc.groupsList;
    Object.keys(groupsList).forEach((key) => {
      gList.push(groupsList[key]);
    });
    doc.groupsList = gList;
  }
  if (doc.petsList != undefined) {
    let petsList = doc.petsList;
    Object.keys(petsList).forEach((key) => {
      pList.push(petsList[key]);
    });
    doc.petsList = pList;
  }
  if (doc.ownersList != undefined) {
    let ownersList = doc.ownersList;
    Object.keys(ownersList).forEach((key) => {
      oList.push(ownersList[key]);
    });
    doc.ownersList = oList;
    // pets.forEach((pet) => list.push(pet));
  }
  return doc;
}
export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUserData] = useState(undefined);

  const userFunctions = {
    pullUserData: (userId) => {
      try {
        return firestore()
          .collection('users')
          .doc(userId)
          .onSnapshot((doc) => {
            setUserData(reformatDataCluster(doc.data()));
          });
      } catch (e) {
        console.log(e);
      }
    },
    updateUserData: async (username, imageURL) => {
      try {
        await firestore()
          .collection('users')
          .doc(user.userId)
          .update({username: username, imageURL: imageURL});
      } catch (e) {
        console.log(e);
      }
    },
    addCoOwner: async (user, coOnwerEmail) => {
      try {
        if (user.email !== coOnwerEmail) {
          const batch = firestore().batch();

          const newCoOwnerRef = [];
          const newCoOwnerData = [];
          await firestore()
            .collection('users')
            .where('email', '==', coOnwerEmail)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                newCoOwnerRef.push(doc.ref);
                newCoOwnerData.push(doc.data());
              });
            });
          // fetching the other owner's data
          console.log('this is it: ' + newCoOwnerRef[0]);
          const userRef = firestore().collection('users').doc(user.uid);

          // user's
          const userBreadcrumbs = `ownersList.${newCoOwnerRef[0].id}`;
          batch.update(userRef, {
            [userBreadcrumbs]: {
              username: newCoOwnerData[0].username,
              ownerId: newCoOwnerRef[0].id,
            },
          });

          // other's
          const coOwnerBreadcrumbs = `ownersList.${userRef.id}`;
          batch.update(newCoOwnerRef[0], {
            [coOwnerBreadcrumbs]: {
              username: user.displayName,
              ownerId: user.uid,
            },
          });

          await batch.commit();
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
      }
    },
    deleteCoOwner: async (userId, CoOwnerId) => {
      try {
        const batch = firestore().batch();

        const coOnwerRef = firestore().collection('users').doc(CoOwnerId);
        const coOwnerBreadcrumbs = `ownersList.${CoOwnerId}`;
        const userRef = firestore().collection('users').doc(userId);
        const userBreadcrumbs = `ownersList.${userId}`;

        // change co-owner's list
        batch.update(coOnwerRef, {
          [userBreadcrumbs]: firestore.FieldValue.delete(),
        });

        // change user's list
        batch.update(userRef, {
          [coOwnerBreadcrumbs]: firestore.FieldValue.delete(),
        });

        await batch.commit();
      } catch (error) {
        console.log(error);
      }
    },
  };

  return (
    <UserContext.Provider value={{user, ...userFunctions}}>
      {children}
    </UserContext.Provider>
  );
};
