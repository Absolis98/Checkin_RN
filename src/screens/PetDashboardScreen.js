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
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import ActionsButtonList from '../components/ActionsButtonList';
import {PetContext} from '../context/PetContext';
import {UserContext} from '../context/UserContext';
import Icon from 'react-native-vector-icons/Feather';

const dayKey = {
  Mon: 6,
  Tue: 5,
  Wed: 4,
  Thu: 3,
  Fri: 2,
  Sat: 1,
  Sun: 0,
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
  console.log('is loading: ' + loading);

  let recordsList = [];
  if (pet)
    for (let actionDate in pet.actionRecords) {
      //order keys here
      let breadcrumbs = `${actionDate}`;
      recordsList[dayKey[actionDate.slice(0, 3)]] = {
        [breadcrumbs]: pet.actionRecords[actionDate],
      };
      // recordsList.push({[breadcrumbs]: pet.actionRecords[actionDate]});
    }

  console.log(recordsList);

  console.log('is loading: ' + loading);
  useEffect(() => {
    const unsubscribe = pullPetData(petId);
    if (loading) {
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  console.log('is loading: ' + loading);
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  console.log('is loading: ' + loading);
  return (
    <View style={styles.container}>
      {!loading && pet && pet.petId === petId ? (
        <View style={styles.container}>
          <View
            style={{
              height: '10%',
              width: '100%',
              backgroundColor:
                pet.gender === 'Male'
                  ? '#4c86a8'
                  : pet.gender === 'Female'
                  ? '#e0777d'
                  : '#ffc49b',
              position: 'absolute',
            }}></View>
          <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <View
                style={[
                  styles.container,
                  {
                    marginTop: '20%',
                  },
                ]}>
                <View style={styles.body}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                      <View style={{paddingTop: '38%'}}>
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
                      </View>
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
                            backgroundColor: 'rgb(185, 185, 185)',
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
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isImageModalVisible}
                  onRequestClose={() =>
                    setImageModalVisable(!isImageModalVisible)
                  }>
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

              <View
                style={{
                  height: '32%',
                  width: '100%',
                  backgroundColor:
                    pet.gender === 'Male'
                      ? '#4c86a8'
                      : pet.gender === 'Female'
                      ? '#e0777d'
                      : '#ffc49b',
                  borderBottomLeftRadius: 50,
                  borderBottomRightRadius: 50,
                  position: 'absolute',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    paddingHorizontal: 20,
                  }}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 10,
                      marginTop: 20,
                      backgroundColor: 'rgba(234, 240, 240, 0.30)',
                    }}
                    onPress={() => navigation.pop()}>
                    <Icon name={'arrow-left'} size={30} color={'white'} />
                  </TouchableOpacity>

                  {!loading && pet && pet.petId === petId ? (
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        borderRadius: 10,
                        marginTop: 20,
                        backgroundColor: 'rgba(234, 240, 240, 0.30)',
                      }}
                      onPress={() =>
                        navigation.push('UpdatePetScreen', {pet: pet})
                      }>
                      <Icon name={'edit'} size={30} color={'white'} />
                    </TouchableOpacity>
                  ) : (
                    <></>
                  )}
                </View>

                <View style={styles.header}>
                  <Text
                    style={{
                      fontSize: 40,
                      marginTop: '-12%',
                      color: 'white',
                    }}>
                    {pet.name}
                  </Text>

                  <View style={{flexDirection: 'row', marginTop: '-3%'}}>
                    <TouchableOpacity
                      style={{
                        marginVertical: '5%',
                        marginLeft: '10%',
                      }}
                      onPress={() =>
                        setImageModalVisable(!isImageModalVisible)
                      }>
                      {console.log(pet.imageURL)}
                      {pet.imageURL !== null ? (
                        <Image
                          // style={styles.avatar}
                          style={{
                            height: 130,
                            width: 130,
                            borderRadius: 30,
                          }}
                          source={{uri: pet.imageURL}}
                        />
                      ) : (
                        <Image
                          style={{
                            height: 130,
                            width: 130,
                            borderRadius: 30,
                            borderWidth: 1,
                            backgroundColor: 'white',
                            borderColor: 'rgba(0,0,0,0.2)',
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
                      <Text style={{fontWeight: '700', fontSize: 20}}>
                        Species:{' '}
                        <Text style={{fontSize: 20, fontWeight: 'normal'}}>
                          {pet.species.charAt(0).toUpperCase() +
                            pet.species.slice(1)}
                        </Text>
                      </Text>
                      <Text style={{fontWeight: '700', fontSize: 20}}>
                        Gender:{' '}
                        <Text style={{fontSize: 20, fontWeight: 'normal'}}>
                          {pet.gender.charAt(0).toUpperCase() +
                            pet.gender.slice(1)}
                        </Text>
                      </Text>
                      <Text style={{fontWeight: '700', fontSize: 20}}>
                        Breed:{' '}
                        <Text style={{fontSize: 20, fontWeight: 'normal'}}>
                          {pet.breed}
                        </Text>
                      </Text>
                      <Text style={{fontWeight: '700', fontSize: 20}}>
                        Age:{' '}
                        <Text style={{fontSize: 20, fontWeight: 'normal'}}>
                          {pet.age}
                        </Text>
                      </Text>
                      <Text style={{fontWeight: '700', fontSize: 20}}>
                        Weight:{' '}
                        <Text style={{fontSize: 20, fontWeight: 'normal'}}>
                          {pet.weight} lbs
                        </Text>{' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* <Button
        title="firestore"
        onPress={() => {
          navigation.push('dbConfig');
          console.log('Hi');
        }}
      /> */}
          </SafeAreaView>
        </View>
      ) : pet === null ? (
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
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  header: {
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // backgroundColor: '#EFDEE4',
    width: '100%',
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
    marginRight: 7,
    marginTop: '5%',
    flex: 1,
  },
  body: {
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
