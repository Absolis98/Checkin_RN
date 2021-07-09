import React, {useContext} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import {PetContext} from '../context/PetContext';
import PetActionForm from '../components/PetActionForm';
import Icon from 'react-native-vector-icons/Feather';

const CreatePetActionScreen = ({navigation, route}) => {
  const {petId, actionType} = route.params;
  const {pet, createAction} = useContext(PetContext);

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' ? (
        <View
          style={{
            height: '10%',
            width: '100%',
            backgroundColor:
              pet.gender === 'Male'
                ? '#4c86a8'
                : pet.gender === 'Female'
                ? '#e0777d'
                : '#F3B680',
            position: 'absolute',
          }}></View>
      ) : null}
      <SafeAreaView style={{flex: 1, width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 20,
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
            backgroundColor:
              pet.gender === 'Male'
                ? '#4c86a8'
                : pet.gender === 'Female'
                ? '#e0777d'
                : '#F3B680',
          }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: 'rgba(234, 240, 240, 0.35)',
            }}
            onPress={() => navigation.pop()}>
            <Icon name={'arrow-left'} size={30} color={'white'} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 40,
              color: 'white',
            }}>
            Create Action
          </Text>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
            }}></View>
        </View>
        {pet ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
            }}>
            <PetActionForm
              crudType={'Create'}
              onSubmit={(newAction) =>
                createAction(petId, actionType, newAction, () =>
                  navigation.pop(),
                )
              }
            />
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 30}}>Pet was deleted :(</Text>
            <TouchableOpacity
              onPress={() => navigation.popToTop()}
              style={{
                backgroundColor: 'red',
                padding: 15,
                borderRadius: 15,
                marginTop: 15,
              }}>
              <Text style={{color: 'white'}}>Navigate to Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
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
