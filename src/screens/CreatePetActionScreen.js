import React, {useContext} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {PetContext} from '../context/PetContext';
import PetActionForm from '../components/PetActionForm';

const CreatePetActionScreen = ({navigation, route}) => {
  const {petId, actionType} = route.params;
  const {createAction} = useContext(PetContext);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
      }}>
      <PetActionForm
        crudType={'Create'}
        onSubmit={(newAction) =>
          createAction(petId, actionType, newAction, () => navigation.pop())
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

export default CreatePetActionScreen;
