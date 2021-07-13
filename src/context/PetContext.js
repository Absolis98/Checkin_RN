import React, {createContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

export const PetContext = createContext();

const createDateString = () => {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return [
    days[date.getDay()],
    months[date.getMonth()],
    date.getDate(),
    date.getFullYear(),
    strTime,
  ];
};

const isNextDay = (dateDB, dateToday) => {
  const adjustedDate = new Date(dateDB.setHours(0, 0, 0, 0));
  console.log(adjustedDate);
  console.log('RIGHT ABVOVEDE OEISD');
  return dateToday >= adjustedDate.setDate(adjustedDate.getDate() + 1);
};

const isNextWeek = (dateDB, dateToday) => {
  const adjustedDate = new Date(dateDB.setHours(0, 0, 0, 0));
  return dateToday >= adjustedDate.setDate(adjustedDate.getDate() + 7);
};

const isNextMonth = (dateDB, dateToday) => {
  const adjustedDate = new Date(dateDB.setHours(0, 0, 0, 0));
  return dateToday >= adjustedDate.setDate(adjustedDate.getDate() + 31);
};

const isNextYear = (dateDB, dateToday) => {
  const adjustedDate = new Date(dateDB.setHours(0, 0, 0, 0));
  return dateToday >= adjustedDate.setDate(adjustedDate.getDate() + 365);
};

const sortData = (actionList) => {
  return actionList.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
  );
};

const createDataChunk = (doc) => {
  let docChanged = false;
  const chunkToUpdate = {};
  let breadcrumbsDone;
  let breadcrumbsDate;
  console.log('pass');
  const today = new Date();
  console.log('Today is: ' + today.getDay());

  console.log(doc.actionRecords.resetDate.toDate().getTime());
  console.log('[][]][][][][][][][][][][][][[[[]]]');

  if (today.getTime() >= doc.actionRecords.resetDate.toDate().getTime()) {
    // in the future, if we're keeping records, then add them to the
    // subcollection here before resetting the records
    today.getDay() !== 0
      ? today.setDate(today.getDate() + (8 - today.getDay()))
      : today.setDate(today.getDate() + 1);
    chunkToUpdate['actionRecords'] = {
      resetDate: new Date(today.setHours(0, 0, 0, 0)),
    };
    docChanged = true;
  }
  for (let actionTypeKey in doc.actions) {
    console.log('pass');
    for (let actionNameKey in doc.actions[actionTypeKey]) {
      breadcrumbsDone = `actions.${actionTypeKey}.${actionNameKey}.done`;
      breadcrumbsDate = `actions.${actionTypeKey}.${actionNameKey}.currentDayTime`;
      doc.actions[actionTypeKey][actionNameKey].frequency === 'daily'
        ? isNextDay(
            doc.actions[actionTypeKey][actionNameKey].currentDayTime.toDate(),
            new Date(), // consider changing this one to the firebase timestamp
          )
          ? ((chunkToUpdate[breadcrumbsDone] = 0),
            (chunkToUpdate[breadcrumbsDate] = firestore.Timestamp.fromDate(
              new Date(),
            )),
            (docChanged = true))
          : console.log('is next day is false')
        : doc.actions[actionTypeKey][actionNameKey].frequency === 'weekly'
        ? isNextWeek(
            doc.actions[actionTypeKey][actionNameKey].currentDayTime.toDate(),
            new Date(),
          )
          ? ((chunkToUpdate[breadcrumbsDone] = 0),
            (chunkToUpdate[breadcrumbsDate] = firestore.Timestamp.fromDate(
              new Date(),
            )),
            (docChanged = true))
          : console.log('is next week is false')
        : doc.actions[actionTypeKey][actionNameKey].frequency === 'monthly'
        ? isNextMonth(
            doc.actions[actionTypeKey][actionNameKey].currentDayTime.toDate(),
            new Date(),
          )
          ? ((chunkToUpdate[breadcrumbsDone] = 0),
            (chunkToUpdate[breadcrumbsDate] = firestore.Timestamp.fromDate(
              new Date(),
            )),
            (docChanged = true))
          : console.log('is next month is false')
        : doc.actions[actionTypeKey][actionNameKey].frequency === 'yearly'
        ? isNextYear(
            doc.actions[actionTypeKey][actionNameKey].currentDayTime.toDate(),
            new Date(),
          )
          ? ((chunkToUpdate[breadcrumbsDone] = 0),
            (chunkToUpdate[breadcrumbsDate] = firestore.Timestamp.fromDate(
              new Date(),
            )),
            (docChanged = true))
          : console.log('is next year is false')
        : console.log('is not yearly');
      console.log('pass');
      // breadcrumbs = `actions.${actionTypeKey}.${actionNameKey}.need`;
      // chunkToUpdate[breadcrumbs] = 0;
    }
  }

  return docChanged ? chunkToUpdate : null;
};

const formatData = (doc) => {
  for (let actionTypeKey in doc.actions) {
    // for (actionNameKey in pet.actions[actionTypeKey]) {
    let eList = [];
    if (doc.actions[actionTypeKey] != undefined) {
      let actions = doc.actions[actionTypeKey];
      Object.keys(actions).forEach((key) => {
        eList.push(actions[key]);
      });
      // doc.actionRecords.reverse();
      doc.actions[actionTypeKey] = sortData(eList);
    }
    // }
  }
  return doc;
};

export const PetProvider = ({children}) => {
  const [pet, setPetData] = useState(undefined);
  // const [unforPet, setUnforPet] = useState(undefined);

  const petFunctions = {
    pullPetData: (petId) => {
      // careful when updating the db. Don't make n number updates
      // the update should be performed only once
      // consider whether you should reformat before or after checking doc date freqs
      try {
        // add some logic so if this read fails, keep the user in a loading state/tell them to try again
        firestore()
          .collection('pets')
          .doc(petId)
          .get()
          .then((doc) => {
            let dateCheckedDoc = createDataChunk(doc.data());
            console.log("You're looking for this:");
            if (dateCheckedDoc !== null) {
              petFunctions.resetPetActions(petId, dateCheckedDoc);
              // console.log(dateCheckedSDoc);
              // console.log(createDataChunk(dateCheckedDoc));
            } else dateCheckedDoc = doc.data();
            let formattedDoc = formatData(dateCheckedDoc);
            setPetData(formattedDoc);
          })
          .catch((e) => console.log(e));

        return firestore()
          .collection('pets')
          .doc(petId)
          .onSnapshot((doc) => {
            if (doc.exists) {
              let formattedDoc = formatData(doc.data());
              setPetData(formattedDoc);
            } else {
              setPetData(null);
            }
          });
      } catch (error) {
        console.log(error);
      }
    },
    resetPetActions: async (petId, chunckToUpdate) => {
      console.log('ResetPetActions RAN WOOOO SHOULD BE ONLY ONCE');
      try {
        await firestore().collection('pets').doc(petId).update(chunckToUpdate);
      } catch (error) {
        console.log(error);
      }
    },
    // the implementation as a whole is flawed and incomplete
    // only a placeholder for the moment
    incrementAction: async (
      // petId,
      username,
      actionType,
      action,
    ) => {
      const chunkToUpdate = {};
      const dateArray = createDateString();
      const dateString =
        dateArray[0] +
        ' ' +
        dateArray[1] +
        ' ' +
        dateArray[2] +
        ' ' +
        dateArray[3];
      console.log(breadcrumbsRecords);
      if (pet.actionRecords[dateString] === undefined) {
        pet.actionRecords[dateString] = [];
        console.log(pet.actionRecords[dateString]);
      }
      console.log(pet.actionRecords[dateString]);
      const actionRecords = [...pet.actionRecords[dateString]];
      console.log(actionRecords);
      // actionRecords.reverse();
      let newValue = action.done + 1 > action.need ? 0 : action.done + 1;
      const breadcrumbs = `actions.${actionType}.${action.name}.done`;
      const breadcrumbsRecords = `actionRecords.${dateString}`;
      chunkToUpdate[breadcrumbs] = newValue;
      actionRecords.push(
        `${username} completed ${action.name}: ${dateArray[4]}`,
      );
      chunkToUpdate[breadcrumbsRecords] = actionRecords;
      console.log(chunkToUpdate);
      // const breadcrumbs = `actions.${actionType}.${action.actionName}.done`;

      try {
        await firestore()
          .collection('pets')
          .doc(pet.petId)
          .update(chunkToUpdate);
      } catch (error) {
        console.log(error);
      }
    },
    // must pass an object to update function that correctly updates
    // action data
    updateAction: async (petId, actionType, actionName, action, callback) => {
      let chunkToUpdate = {};
      if (actionName != action.name) {
        chunkToUpdate[
          `actions.${actionType}.${actionName}`
        ] = firestore.FieldValue.delete();
      }

      chunkToUpdate[`actions.${actionType}.${action.name}`] = action;

      try {
        await firestore().collection('pets').doc(petId).update(chunkToUpdate);
        callback();
      } catch (error) {
        console.log(error);
      }
    },
    createAction: async (petId, actionType, action, callback) => {
      let chunkToAdd = {};
      let actionToCreate = {
        name: action.name,
        description: action.description,
        frequency: action.frequency,
        need: action.need,
        done: 0,
        records: [],
        currentDayTime: firestore.Timestamp.fromDate(new Date()),
      };
      chunkToAdd[`actions.${actionType}.${action.name}`] = actionToCreate;

      try {
        console.log('chunk HGHGHGHGHGHGHGHGHGHGHGHGHGHHGHGHGHGHH');
        console.log(chunkToAdd);
        await firestore().collection('pets').doc(petId).update(chunkToAdd);
        callback();
      } catch (error) {
        console.log(error);
      }
    },
    deleteAction: async (petId, actionType, actionName, callback) => {
      const chunkToDelete = {};
      chunkToDelete[
        `actions.${actionType}.${actionName}`
      ] = firestore.FieldValue.delete();

      try {
        console.log(chunkToDelete);
        await firestore().collection('pets').doc(petId).update(chunkToDelete);
        callback();
      } catch (error) {
        console.log(error);
      }
    },
    // must delete image from fb storage as well
    deletePet: async (authUser, pet) => {
      // check if pet is in a group
      // if true, remove pet reference from group and individual owners
      // if false, remove pet from individual owner

      await firestore()
        .collection('groups')
        .where(`petsList.${pet.petId}.name`, '==', pet.name)
        .get()
        .then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            const batch = firestore().batch();

            const snapshot = querySnapshot.docs[0]; // use only the first document, but there should only be one
            const documentRef = snapshot.ref; // now you have a DocumentReference
            await documentRef.get().then((snapshot) => {
              // removes pet from all users in group
              for (let ownerKey in snapshot.data().ownersList) {
                console.log(snapshot.data().ownersList);
                console.log('Uipso');
                console.log(ownerKey);
                let tmpUserRef = firestore().collection('users').doc(ownerKey);
                batch.update(tmpUserRef, {
                  [`petsList.${pet.petId}`]: firestore.FieldValue.delete(),
                });
              }
            });

            // removes pet from group
            batch.update(documentRef, {
              [`petsList.${pet.petId}`]: firestore.FieldValue.delete(),
            });

            // removes pet from pets collection
            const petRef = firestore().collection('pets').doc(pet.petId);
            batch.delete(petRef);
            console.log('passed');

            batch.commit();
          } else {
            console.log('else');
            const batch = firestore().batch();
            const petRef = firestore().collection('pets').doc(pet.petId);
            console.log('This should work: ' + petRef);
            batch.delete(petRef);
            const userRef = firestore().collection('users').doc(authUser.uid);
            const breadcrumbs = `petsList.${pet.petId}`;
            console.log('The breadcrumbs ' + breadcrumbs);
            batch.update(userRef, {
              [breadcrumbs]: firestore.FieldValue.delete(),
            });
            batch.commit();
          }
        });
    },
  };

  return (
    <PetContext.Provider value={{pet, ...petFunctions}}>
      {children}
    </PetContext.Provider>
  );
};
