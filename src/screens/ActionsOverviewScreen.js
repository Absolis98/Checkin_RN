import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {PetContext} from '../context/PetContext';
import Icon from 'react-native-vector-icons/EvilIcons';

const ActionsOverviewScreen = ({navigation, route}) => {
  const {petId, actionType} = route.params;
  const {pet} = useContext(PetContext);

  // const [loading, setLoading] = useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.push('CreatePetActionScreen', {
              petId: petId,
              actionType: actionType,
            })
          }>
          <Text style={styles.headerText}>+</Text>
        </TouchableOpacity>
      ),
      title: actionType.charAt(0).toUpperCase() + actionType.slice(1),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {pet ? (
        <View style={styles.container}>
          <View style={{flex: 1}}>
            <FlatList
              ListHeaderComponent={
                <Text style={styles.listTitle}>Actions</Text>
              }
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
                      <Icon name={'pencil'} size={40} />
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
        console.log('nothing')
      )}
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
