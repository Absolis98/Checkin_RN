import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  FlatList,
} from 'react-native';
import ActionsButtonList from '../components/ActionsButtonList';
import {PetContext} from '../context/PetContext';
import {UserContext} from '../context/UserContext';

const dayKey = {
  Sun: 6,
  Mon: 5,
  Tue: 4,
  Wed: 3,
  Thu: 2,
  Fri: 1,
  Sat: 0,
};

const ActionsCard = ({dayActions}) => {
  console.log('heyyyyyyyyyyyyyy');
  console.log(dayActions);

  const date = Object.keys(dayActions)[0];
  if (date !== 'flag')
    return (
      <View>
        <Text style={{fontSize: 20, margin: 10}}>{date}</Text>
        {dayActions[date]
          .slice(0)
          .reverse()
          .map((record, index) => {
            return (
              <View style={styles.historySliver} key={index}>
                <Text>{record}</Text>
              </View>
            );
          })}

        {/* <Text style={styles.historyText}>{dayActions[date]}</Text> */}
      </View>
    );
  else {
    return null;
  }
};

const PetDashboardScreen = ({route, navigation}) => {
  const {petId} = route.params;
  const {pet, pullPetData, incrementAction} = useContext(PetContext);
  const {user} = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(true);
  const [isImageModalVisible, setImageModalVisable] = useState(false);

  let recordsList = [];
  if (pet !== undefined)
    for (let actionDate in pet.actionRecords) {
      //order keys here
      let breadcrumbs = `${actionDate}`;
      recordsList[dayKey[actionDate.slice(0, 3)]] = {
        [breadcrumbs]: pet.actionRecords[actionDate],
      };
      // recordsList.push({[breadcrumbs]: pet.actionRecords[actionDate]});
    }

  console.log(recordsList);

  useEffect(() => {
    const unsubscribe = pullPetData(petId);
    if (loading) {
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      {!loading && pet !== undefined && pet.petId === petId ? (
        <View style={styles.container}>
          <View style={styles.body}>
            <FlatList
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  <ActionsButtonList
                    title={'Essential'}
                    incrementAction={incrementAction}
                    username={user.username}
                    pet={pet}
                    type={'essential'}
                  />
                  <ActionsButtonList
                    title={'To-do'}
                    incrementAction={incrementAction}
                    username={user.username}
                    pet={pet}
                    type={'todo'}
                  />
                  <ActionsButtonList
                    title={'Medical'}
                    incrementAction={incrementAction}
                    username={user.username}
                    pet={pet}
                    type={'medical'}
                  />
                  <Text style={styles.headerText}>Week History</Text>
                </>
              }
              data={hidden === false ? recordsList : null}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => {
                // console.log(item);
                console.log(item);
                console.log(item !== undefined);
                return item !== undefined ? (
                  <ActionsCard dayActions={item} />
                ) : // <View>
                //   <View style={styles.historySliver}>
                //     <Text style={styles.historyText}>{item}</Text>
                //   </View>
                // </View>
                null;
              }}
              ListFooterComponent={
                <TouchableOpacity onPress={() => setHidden(!hidden)}>
                  <View
                    style={{
                      backgroundColor: 'pink',
                      marginVertical: 10,
                      marginHorizontal: 15,
                      borderRadius: 7,
                      paddingVertical: 10,
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.2)',
                    }}>
                    <Text style={{fontSize: 15, textAlign: 'center'}}>
                      {hidden === true ? 'Show History' : 'Close History'}
                    </Text>
                  </View>
                </TouchableOpacity>
              }
            />
          </View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => setImageModalVisable(!isImageModalVisible)}>
              {console.log(pet.imageURL)}
              {pet.imageURL !== null ? (
                <Image
                  // style={styles.avatar}
                  style={{
                    height: 130,
                    width: 130,
                    margin: 20,
                    borderRadius: 100,
                  }}
                  source={{uri: pet.imageURL}}
                />
              ) : (
                <Image
                  style={{
                    height: 130,
                    width: 130,
                    margin: 20,
                    borderRadius: 100,
                  }}
                  source={
                    pet.species === 'Dog'
                      ? require('../assets/dog.png')
                      : pet.species === 'Cat'
                      ? require('../assets/cat.png')
                      : require('../assets/other.png')
                  }
                />
              )}
            </TouchableOpacity>

            <View style={styles.subHeader}>
              <Text style={{fontSize: 28}}>{pet.name}</Text>
              <Text style={{fontWeight: 'bold'}}>
                Species:{' '}
                <Text style={{fontSize: 15, fontWeight: 'normal'}}>
                  {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
                </Text>
              </Text>
              <Text style={{fontWeight: 'bold'}}>
                Gender:{' '}
                <Text style={{fontSize: 15, fontWeight: 'normal'}}>
                  {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                </Text>
              </Text>
              <Text style={{fontWeight: 'bold'}}>
                Breed: <Text style={{fontWeight: 'normal'}}>{pet.breed}</Text>
              </Text>
              <Text style={{fontWeight: 'bold'}}>
                Age: <Text style={{fontWeight: 'normal'}}>{pet.age}</Text>
              </Text>
              <Text style={{fontWeight: 'bold'}}>
                Weight:{' '}
                <Text style={{fontWeight: 'normal'}}>{pet.weight} lbs</Text>{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.push('UpdatePetScreen', {pet: pet})}>
                <View
                  style={{
                    backgroundColor: 'pink',
                    marginTop: 10,
                    marginBottom: 3,
                    borderRadius: 7,
                    paddingVertical: 4,
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                  }}>
                  <Text style={{fontSize: 15, textAlign: 'center'}}>
                    Edit Info
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isImageModalVisible}
            onRequestClose={() => setImageModalVisable(!isImageModalVisible)}>
            <Pressable
              onPress={() => setImageModalVisable(!isImageModalVisible)}
              style={{
                height: '100%',
                marginTop: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0, .4)',
              }}>
              <View
                style={{
                  backgroundColor: 'black',
                }}>
                {pet.imageURL !== null ? (
                  <Image
                    // style={styles.avatar}
                    style={{
                      height: 300,
                      width: 300,
                      margin: 5,
                    }}
                    source={{uri: pet.imageURL}}
                  />
                ) : (
                  <Image
                    style={{
                      height: 300,
                      width: 300,
                      margin: 5,
                      backgroundColor: 'white',
                    }}
                    source={
                      pet.species === 'Dog'
                        ? require('../assets/dog.png')
                        : pet.species === 'Cat'
                        ? require('../assets/cat.png')
                        : require('../assets/other.png')
                    }
                  />
                )}
              </View>
            </Pressable>
          </Modal>
        </View>
      ) : (
        console.log('nothing')
      )}

      {/* <Button
        title="firestore"
        onPress={() => {
          navigation.push('dbConfig');
          console.log('Hi');
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#EFDEE4',
    width: '100%',
    position: 'absolute',
  },
  avatar: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    width: 120,
    height: 120,
    backgroundColor: 'pink',
    borderRadius: 50,
    marginLeft: 20,
  },
  subHeader: {
    marginLeft: 25,
  },
  body: {
    flex: 3,
    paddingTop: 180,
    // backgroundColor: '#EFDEE4',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  navText: {
    margin: 40,
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  footer: {
    flex: 1,
    backgroundColor: 'green',
  },
  historyArea: {
    borderTopWidth: 1,
    width: '100%',
    marginVertical: 5,
  },
  headerText: {marginLeft: 15, fontSize: 28},

  actionsCompContainer: {
    flex: 0.45,
    // backgroundColor: 'cyan',
  },
  historyText: {
    color: 'black',
    marginLeft: '10%',
    // textAlign: 'center',
  },
  historySliver: {
    borderBottomWidth: 1,
    // borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: '3%',
    borderRadius: 10,
    marginVertical: 2,

    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 18,
    backgroundColor: '#fff',
  },
});

export default PetDashboardScreen;
