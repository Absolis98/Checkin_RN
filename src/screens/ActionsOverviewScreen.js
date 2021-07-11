import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import {PetContext} from '../context/PetContext';
import Icon from 'react-native-vector-icons/Feather';

const ActionsOverviewScreen = ({navigation, route}) => {
  const {petId, actionType} = route.params;
  const {pet} = useContext(PetContext);

  // const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
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
            onPress={() => navigation.pop()}
            onLongPress={() => navigation.popToTop()}>
            <Icon name={'arrow-left'} size={30} color={'white'} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 40,
              color: 'white',
            }}>
            Actions
          </Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: 'rgba(234, 240, 240, 0.35)',
            }}
            onPress={() =>
              navigation.push('CreatePetActionScreen', {
                petId: petId,
                actionType: actionType,
              })
            }>
            <Icon name={'plus'} size={30} color={'white'} />
          </TouchableOpacity>
        </View>
        {pet ? (
          <View style={styles.container}>
            <View style={{flex: 1}}>
              <FlatList
                data={pet.actions[actionType]}
                keyExtractor={(button) => button.name}
                renderItem={({item}) => {
                  // console.log(item);
                  return (
                    <View style={styles.button}>
                      {/* <TouchableOpacity
                      // style={[styles.CircleList]}
                      onPress={() =>
                        navigation.push('PetActionScreen', {
                          actionType: actionType,
                          action: item,
                          petId: petId,
                        })
                      }> */}
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.actionName}>{item.name}</Text>
                        <Text>{item.description}</Text>
                        <Text>{item.frequency}</Text>
                        <Text>
                          {item.done}/{item.need}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          margin: 9,
                          position: 'absolute',
                          right: 10,
                        }}
                        onPress={() =>
                          navigation.push('EditPetActionScreen', {
                            actionType: actionType,
                            action: item,
                            petId: petId,
                          })
                        }>
                        <Icon name={'edit'} size={40} />
                      </TouchableOpacity>

                      {/* </TouchableOpacity> */}
                    </View>
                  );
                }}
              />
            </View>

            {/* <View>
          <Text style={styles.listTitle}>Actions completed this week:</Text>
        </View>
        <View style={styles.actionsCompContainer}>
          <FlatList
            data={pet.actionRecords}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => {
              // console.log(item);
              return (
                <View>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>{item}</Text>
                  </View>
                </View>
              );
            }}
          />
        </View> */}
          </View>
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
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  actionsContainer: {
    flex: 0.55,
    // backgroundColor: 'cyan',
  },
  actionsCompContainer: {
    flex: 0.45,
    // backgroundColor: 'cyan',
  },
  actionName: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  CircleList: {
    borderRadius: 20,
  },
  button: {
    borderBottomWidth: 1,
    // borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 0,
  },
  actionsCompbutton: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    height: 67,
    backgroundColor: '#fff',
    borderRadius: 0,
  },
  listTitle: {
    fontSize: 25,
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 10,
  },
  btn: {
    marginHorizontal: 15,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#333',
  },
});

export default ActionsOverviewScreen;

// return {
//   headerRight: () => (
//     <TouchableOpacity onPress={() => navigation.navigate('Create')}>
//       <Feather name="plus" size={30} />
//     </TouchableOpacity>
//   ),
// };
