import React, {useContext} from 'react';
import {StyleSheet, ScrollView, Text} from 'react-native';
import {PetContext} from '../context/PetContext';
import PetActionForm from '../components/PetActionForm';
import Icon from 'react-native-vector-icons/EvilIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

const PetActionScreen = ({navigation, route}) => {
  const {action, petId, actionType} = route.params;
  const {updateAction, deleteAction} = useContext(PetContext);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{margin: 9}}
          onPress={() =>
            navigation.push('EditPetActionScreen', {
              actionType: actionType,
              action: action,
              petId: petId,
            })
          }>
          <Icon name={'pencil'} size={40} />
        </TouchableOpacity>
      ),
      title: action.name.charAt(0).toUpperCase() + action.name.slice(1),
    });
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
      }}>
      <Text>{action.name}</Text>
      <Text>{action.frequency}</Text>
      <Text>{action.currentDayTime.toDate().getHours()}</Text>
      <Text>
        {action.done}/{action.need}
      </Text>
      {/* <PetActionForm
        crudType={'Update'}
        initialState={action}
        deleteFunc={() =>
          deleteAction(petId, actionType, action.name, () => navigation.pop())
        }
        onSubmit={(updatedAction) =>
          updateAction(petId, actionType, action.name, updatedAction, () =>
            navigation.pop(),
          )
        }
      /> */}
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

export default PetActionScreen;
