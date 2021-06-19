import React, {useContext} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {PetContext} from '../context/PetContext';
import PetActionForm from '../components/PetActionForm';

const EditPetActionScreen = ({navigation, route}) => {
  const {action, petId, actionType} = route.params;
  const {updateAction, deleteAction} = useContext(PetContext);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
      }}>
      <PetActionForm
        crudType={'Update'}
        initialState={action}
        deleteFunc={() =>
          deleteAction(petId, actionType, action.name, () => navigation.pop(2))
        }
        onSubmit={(updatedAction) =>
          updateAction(petId, actionType, action.name, updatedAction, () =>
            navigation.pop(2),
          )
        }
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    margin: 10,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    // width: '75%',
    height: 40,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  inputTitle: {
    fontSize: 22,
    margin: 10,
    width: '100%',
    paddingLeft: 30,
    // marginRight: '75%',
  },
  toggleBtn: {
    height: 40,
    width: '20%',
    margin: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'limegreen',
    alignItems: 'center',
  },
  isSelected: {
    backgroundColor: 'limegreen',
  },
  notSelected: {
    backgroundColor: 'green',
  },
  createBtn: {
    height: 40,
    width: '70%',
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'pink',
    alignItems: 'center',
  },
});

export default EditPetActionScreen;
