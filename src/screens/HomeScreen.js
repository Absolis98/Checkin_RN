import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {UserContext} from '../context/UserContext';
import {AuthContext} from '../context/AuthContext';

const HomeScreen = ({navigation}) => {
  const isHermes = () => !!global.HermesInternal;
  console.log('is hermes running?');
  console.log(isHermes());
  console.log('running');

  const {authUser} = useContext(AuthContext);
  const {user, pullUserData, addCoOwner} = useContext(UserContext);
  const [email, setEmail] = useState('');

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isActionModalVisible, setActionModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // let isMounted = true;
    const unsubscribe = pullUserData(authUser.uid);
    if (loading) {
      setLoading(false);
    }
    console.log(user);

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {!loading && user ? (
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {/* <Text>
          Welcome {user.displayName}: {user.uid}
        </Text> */}

            {/* Pets Section */}
            <View style={{flexDirection: 'row'}}>
              <View style={styles.petsArea}>
                <Text style={styles.headerText}>Pets</Text>
                <FlatList
                  data={user.petsList}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  keyExtractor={(button) => button.petId}
                  renderItem={({item}) => {
                    return (
                      <View>
                        <TouchableOpacity
                          style={[styles.CircleList]}
                          onPress={() =>
                            navigation.push('PetDashboardScreen', {
                              petId: item.petId,
                            })
                          }>
                          <View style={styles.button}>
                            {console.log(item.imageURL)}
                            {item.imageURL ? (
                              <Image
                                style={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 100,
                                }}
                                source={{uri: item.imageURL}}
                              />
                            ) : (
                              <Image
                                // style={styles.avatar}
                                style={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 100,
                                }}
                                source={
                                  item.species === 'Dog'
                                    ? require('../assets/dog.png')
                                    : item.species === 'Cat'
                                    ? require('../assets/cat.png')
                                    : require('../assets/other.png')
                                }
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>{item.name}</Text>
                      </View>
                    );
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.toNextScreenBtn}
                onPress={() => {
                  navigation.push('PetsScreen');
                  // if (!push) navigation.push('PetDashboardScreen', {pet});
                  // else navigation.push(push);
                }}>
                <View>
                  <Text>{'>'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Groups Section */}

            <View style={{flexDirection: 'row'}}>
              <View style={styles.groupsArea}>
                <Text style={styles.headerText}>Groups</Text>
                <FlatList
                  data={user.groupsList}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  keyExtractor={(button) => button.groupId}
                  renderItem={({item}) => {
                    return (
                      <View>
                        <TouchableOpacity
                          style={[styles.CircleList]}
                          onPress={() =>
                            navigation.push('GroupsOverviewScreen', {
                              groupId: item.groupId,
                              // user's co-owners and pets list
                              // only purpose is to be used in update group screen
                              // owners: owners,
                              // pets: pets,
                            })
                          }>
                          <View style={[styles.button, {borderRadius: 30}]}>
                            {item.imageURL ? (
                              <Image
                                // style={styles.avatar}
                                style={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 30,
                                }}
                                source={{uri: item.imageURL}}
                              />
                            ) : (
                              <Image
                                // style={styles.avatar}
                                style={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 30,
                                }}
                                source={require('../assets/group.png')}
                              />
                            )}
                          </View>
                          <Text style={styles.buttonText}>{item.name}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.toNextScreenBtn}
                onPress={() => {
                  navigation.push('GroupsScreen');
                  // if (!push) navigation.push('PetDashboardScreen', {pet});
                  // else navigation.push(push);
                }}>
                <View>
                  <Text>{'>'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* List Co Owners 
        Instead, we could have a view co owners section in settings
        */}

            <View style={{flexDirection: 'row'}}>
              <View style={styles.coOwnersArea}>
                <Text style={styles.headerText}>Co-Owners</Text>
                <FlatList
                  data={user.ownersList}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  keyExtractor={(button) => button.ownerId}
                  renderItem={({item}) => {
                    return (
                      <View>
                        <TouchableOpacity
                          style={[styles.CircleList]}
                          onLongPress={() => {
                            setAddModalVisible2(true);
                            setSelectedOwnerId(item.ownerId);
                          }}>
                          <View style={styles.button}>
                            {item.imageURL ? (
                              <Image
                                // style={styles.avatar}
                                style={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 100,
                                }}
                                source={{uri: item.imageURL}}
                              />
                            ) : (
                              <Image
                                // style={styles.avatar}
                                style={{
                                  width: 130,
                                  height: 130,
                                  borderRadius: 100,
                                  marginTop: 15,
                                }}
                                source={require('../assets/owner.png')}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                        <Text style={styles.buttonText}>{item.username}</Text>
                      </View>
                    );
                  }}
                />
              </View>
              <TouchableOpacity
                style={styles.toNextScreenBtn}
                onPress={() => {
                  navigation.push('OwnersScreen');
                  // if (!push) navigation.push('PetDashboardScreen', {pet});
                  // else navigation.push(push);
                }}>
                <View>
                  <Text>{'>'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {isActionModalVisible || isAddModalVisible ? (
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0, .4)',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                }}></View>
            ) : null}

            {/* History */}
            {/* What if history is only shown if the user clicks on a button?
            - Lowers # of read/writes
        */}
            {/* <View style={styles.historyArea}>
              <Text style={styles.headerText}>History</Text>
              <Text style={{fontSize: 18, marginLeft: 6}}>
                Kanye completed task: Garfield, Clean Litterbox
              </Text>
              <Text style={{fontSize: 18, marginLeft: 6}}>
                Kanye completed task: Roid, Tic Medicine
              </Text>
              <Text style={{fontSize: 18, marginLeft: 6}}>
                Kanye completed task: Test, Feed
              </Text>
              <Text style={{fontSize: 18, marginLeft: 6}}>
                Elite561 completed task: Doge, Feed
              </Text>
              <Text style={{fontSize: 18, marginLeft: 6}}>
                Elite561 completed task: Test, Walk
              </Text>
            </View> */}

            {/* Add Owner Modal */}

            {/* Action Button Modal */}

            <Modal
              animationType="slide"
              transparent={true}
              visible={isActionModalVisible}
              onRequestClose={() =>
                setActionModalVisible(!isActionModalVisible)
              }
              // onRequestClose={() => {
              //   // this.closeButtonFunction()
              // }}
            >
              <Pressable
                onPress={() => {
                  setAddModalVisible(false);
                  setActionModalVisible(false);
                }}
                style={{
                  height: '100%',
                  marginTop: 'auto',
                  justifyContent: 'flex-end',
                }}>
                <Pressable
                  onPress={() => null}
                  style={{
                    height: '25%',
                    backgroundColor: 'white',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                  }}>
                  <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => {
                        setActionModalVisible(!isActionModalVisible);
                        navigation.push('CreatePetScreen');
                      }}>
                      <Text style={styles.modalBtnText}>Create New Pet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => {
                        setAddModalVisible(!isAddModalVisible);
                        setActionModalVisible(!isActionModalVisible);
                      }}>
                      <Text style={styles.modalBtnText}>Add Co-Owner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => {
                        setActionModalVisible(!isActionModalVisible);
                        navigation.push('CreateGroupScreen', {
                          owners: user.ownersList,
                          pets: user.petsList,
                        });
                      }}>
                      <Text style={styles.modalBtnText}>Create New Group</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => {
                        setActionModalVisible(!isActionModalVisible);
                      }}>
                      <Text style={styles.modalBtnText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
            <Modal
              animationType="fade"
              transparent={true}
              visible={isAddModalVisible}
              onRequestClose={() => setAddModalVisible(!isAddModalVisible)}
              // onRequestClose={() => {
              //   // this.closeButtonFunction()
              // }}
            >
              <Pressable
                onPress={() => {
                  setAddModalVisible(false);
                  setActionModalVisible(false);
                }}
                style={{
                  height: '100%',
                  marginTop: 'auto',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    height: 210,
                    marginHorizontal: '7%',
                    backgroundColor: '#DEDEDE',
                    borderRadius: 25,
                  }}>
                  <View style={[styles.inputContainer, {marginVertical: 20}]}>
                    <Text style={styles.inputTitle}>Co-Owner's Email:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="email"
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      value={email}
                      onChangeText={(newValue) => setEmail(newValue)}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      marginHorizontal: 10,
                    }}>
                    <TouchableOpacity
                      style={{
                        marginHorizontal: 1,
                        width: '50%',
                        paddingVertical: 10,
                      }}
                      onPress={() => {
                        setAddModalVisible(!isAddModalVisible);
                      }}>
                      <Text style={styles.modalBtnText}>Close</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        marginHorizontal: 1,
                        width: '50%',
                        paddingVertical: 10,
                      }}
                      onPress={() => {
                        setAddModalVisible(!isAddModalVisible);
                        addCoOwner(authUser, email);
                      }}>
                      <Text style={styles.modalBtnText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            </Modal>
          </ScrollView>
          <TouchableOpacity
            style={{
              width: 75,
              height: 75,
              borderRadius: 100,
              position: 'absolute',
              right: 20,
              bottom: 20,
            }}
            onPress={() => {
              setActionModalVisible(!isActionModalVisible);
            }}>
            <View
              style={{
                backgroundColor: 'skyblue',
                justifyContent: 'center',
                alignItems: 'center',
                width: 75,
                height: 75,
                borderRadius: 100,
                shadowColor: 'rgba(0,0,0, .4)', // IOS
                shadowOffset: {height: 1, width: 1}, // IOS
                shadowOpacity: 1, // IOS
                shadowRadius: 1, //IOS
                elevation: 2, // Android
              }}>
              <Text style={{fontSize: 35, fontWeight: 'bold', color: 'white'}}>
                +
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text>Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  groupsArea: {
    // flex: 3,
    // backgroundColor: 'skyblue',
    width: '90%',
    marginVertical: 5,
  },
  petsArea: {
    width: '90%',
    marginVertical: 5,
  },
  coOwnersArea: {
    width: '90%',
    marginVertical: 5,
  },
  historyArea: {
    borderTopWidth: 1,
    width: '100%',
    marginVertical: 5,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 25,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
  },
  CircleList: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#fff',
  },
  toNextScreenBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'pink',
    marginVertical: 5,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    // width: '75%',
    height: 50,
    lineHeight: 21,
    fontSize: 17,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  inputTitle: {
    fontSize: 22,
    margin: 10,
  },
  modalBtnText: {
    fontSize: 19,
    textAlign: 'center',
    color: 'rgb(40,113,247)',
  },
  modalBtn: {
    paddingVertical: 9,
    marginVertical: 1,
    width: '100%',
  },
});

export default HomeScreen;

{
}
