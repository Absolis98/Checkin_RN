import React, {createContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

function reformatData(doc) {
  let oList = [];
  let pList = [];
  if (doc.ownersList != undefined) {
    oList = Object.values(doc.ownersList);
    doc.ownersList = oList;
  }
  if (doc.petsList != undefined) {
    pList = Object.values(doc.petsList);
    doc.petsList = pList;
  }
  return doc;
}

export const GroupContext = createContext(undefined);

export const GroupProvider = ({children}) => {
  const [group, setGroupData] = useState();

  const groupFunctions = {
    pullGroupData: (groupId) => {
      try {
        return firestore()
          .collection('groups')
          .doc(groupId)
          .onSnapshot((doc) => {
            setGroupData(reformatData(doc.data()));
          });
      } catch (error) {
        console.log(error);
      }
    },
    //   submitGroupUpdate: (dispatch) => {
    //       return async (groupId)
    //   }
  };

  return (
    <GroupContext.Provider value={{group, ...groupFunctions}}>
      {children}
    </GroupContext.Provider>
  );
};
