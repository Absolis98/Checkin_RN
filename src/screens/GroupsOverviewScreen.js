import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import {GroupContext} from '../context/GroupContext';
import Icon from 'react-native-vector-icons/Feather';

// let ownersList = [{name: 'Abraham'}, {name: 'Farid'}];

// TODO:
// Ability to add new owner/pet to group
// Longpress functionality?
// Quick actions that can be done on all pets? Selected pets?
// View of who did what last. Calandar view?

const GroupsOverviewScreen = ({navigation, route}) => {
  const {user} = useContext(UserContext);
  const {group, pullGroupData} = useContext(GroupContext);
  const {groupId} = route.params;
  const [loading, setLoading] = useState(true);
  const [isImageModalVisible, setImageModalVisable] = useState(false);

  // ideally, the groups entity will have more data: like a preview of actions performed
  // there needs to be more data to justify having a group entity

  useEffect(() => {
    const unsubscribe = pullGroupData(groupId);
    if (loading) {
      setLoading(false);
    }

    return unsubscribe;
  }, []);

  const isInGroup = () => {
    let inGroup = false;
    if (!loading && group) {
      for (let owner of group.ownersList) {
        if (owner.ownerId === user.uid) inGroup = true;
      }
      return inGroup;
    } else {
      return null;
    }
  };

  let inGroup = isInGroup();

  if (inGroup === false) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 22}}>You were removed from Group :(</Text>
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
    );
  }

  if (!group) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 22}}>Group was deleted :(</Text>
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
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          height: '20%',
          width: '100%',
          backgroundColor: 'rgb(228, 146, 144)',
          position: 'absolute',
        }}></View>
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: '40%',
              width: '100%',
              backgroundColor: 'rgb(228, 146, 144)',
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
                  backgroundColor: ' rgba(180, 131, 135, 0.75)',
                }}
                onPress={() => navigation.pop()}
                onLongPress={() => navigation.popToTop()}>
                <Icon name={'arrow-left'} size={30} color={'white'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderRadius: 10,
                  marginTop: 20,
                  backgroundColor: ' rgba(180, 131, 135, 0.75)',
                }}
                onPress={() =>
                  navigation.push('UpdateGroupScreen', {
                    group: group,
                    pets: user.petsList,
                    owners: user.ownersList,
                  })
                }>
                <Icon name={'edit'} size={30} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>
          {!loading && group && inGroup && group.groupId === groupId ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                marginTop: '23%',
              }}>
              <TouchableOpacity
                style={[styles.avatar, {marginTop: '-10%'}]}
                onPress={() => setImageModalVisable(!isImageModalVisible)}>
                {group.imageURL ? (
                  <Image style={styles.avatar} source={{uri: group.imageURL}} />
                ) : (
                  <Image
                    style={styles.avatar}
                    source={require('../assets/group.png')}
                  />
                )}
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 60,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: 'white',
                }}>
                {group.groupName}
              </Text>

              <View style={{marginTop: '10%'}}>
                <View style={styles.card}>
                  <View style={styles.listContainer}>
                    <Text style={styles.headerText}>Pets</Text>

                    {group.petsList.length === 0 ? (
                      <Text style={[styles.headerText, {color: 'gray'}]}>
                        - No Pets...
                      </Text>
                    ) : (
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={group.petsList}
                        keyExtractor={(button) => button.petId}
                        renderItem={({item}) => {
                          return (
                            <View>
                              <TouchableOpacity
                                style={styles.CircleList}
                                onPress={() =>
                                  navigation.push('PetDashboardScreen', {
                                    petId: item.petId,
                                  })
                                }>
                                <View style={styles.button}>
                                  {item.imageURL ? (
                                    <Image
                                      // style={styles.avatar}
                                      style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 100,
                                      }}
                                      source={{
                                        uri: item.imageURL,
                                      }}
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
                    )}
                  </View>
                  {/* <TouchableOpacity
            style={styles.toNextScreenBtn}
            onPress={() => {
              console.log('hello there');
              // if (!push) navigation.push('PetDashboardScreen', {pet});
              // else navigation.push(push);
            }}>
            <View>
              <Text>{'>'}</Text>
            </View>
          </TouchableOpacity> */}
                </View>

                <View style={styles.card}>
                  <View style={styles.listContainer}>
                    <Text style={styles.headerText}>Owners</Text>
                    {group.ownersList.length === 0 ? (
                      <Text style={styles.headerText}>- No Pets...</Text>
                    ) : (
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={group.ownersList}
                        keyExtractor={(button) => button.ownerId}
                        renderItem={({item}) => {
                          return (
                            <View>
                              <View
                                style={[styles.CircleList]}
                                // onPress={() => navigation.push('OwnerDashboardScreen')}
                              >
                                <View style={styles.button}>
                                  {item.imageURL ? (
                                    <Image
                                      // style={styles.avatar}
                                      style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 100,
                                      }}
                                      source={{
                                        uri: item.imageURL,
                                      }}
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
                              </View>
                              <Text style={styles.buttonText}>
                                {item.username}
                              </Text>
                            </View>
                          );
                        }}
                      />
                    )}
                  </View>
                  {/* <TouchableOpacity
            style={styles.toNextScreenBtn}
            onPress={() => {
              console.log('hello there');
              // if (!push) navigation.push('PetDashboardScreen', {pet});
              // else navigation.push(push);
            }}>
            <View>
              <Text>{'>'}</Text>
            </View>
          </TouchableOpacity> */}
                </View>
              </View>
              {/* <Button title="Add new pet" onPress={() => alert('Implement me!!!')} />
      <Button title="Add new owner" onPress={() => alert('Implement me!!!')} /> */}

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
                    {group.imageURL !== null ? (
                      <Image
                        // style={styles.avatar}
                        style={{
                          height: 300,
                          width: 300,
                          margin: 5,
                        }}
                        source={{uri: group.imageURL}}
                      />
                    ) : (
                      <Image
                        style={{
                          height: 300,
                          width: 300,
                          margin: 5,
                          backgroundColor: 'white',
                        }}
                        source={require('../assets/group.png')}
                      />
                    )}
                  </View>
                </Pressable>
              </Modal>
            </View>
          ) : (
            (console.log('loading'),
            (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ))
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    margin: '5%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  card: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  body: {
    flex: 3,
    alignItems: 'center',
    // backgroundColor: 'powderblue',
  },
  footer: {
    flex: 1,
    // backgroundColor: 'yellowgreen',
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
  headerText: {
    fontWeight: '600',
    fontSize: 25,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  CircleList: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 10,
  },
  listContainer: {
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    width: '100%',
    marginVertical: '2%',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  toNextScreenBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'pink',
    marginVertical: 5,
  },
});

export default GroupsOverviewScreen;
