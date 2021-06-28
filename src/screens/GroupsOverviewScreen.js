import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Image,
  Modal,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import {GroupContext} from '../context/GroupContext';

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

  return (
    <View style={styles.container}>
      {!loading && group && inGroup && group.groupId === groupId ? (
        <View style={styles.container}>
          <View style={styles.body}>
            <TouchableOpacity
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
            <Text style={{fontSize: 30, textAlign: 'center', marginBottom: 15}}>
              {group.groupName}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.listContainer}>
                <Text style={styles.headerText}>Pets</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={group.petsList}
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
                            {item.imageURL !== null ? (
                              <ImageBackground
                                // style={styles.avatar}
                                style={{width: 100, height: 100}}
                                imageStyle={{borderRadius: 100}}
                                source={{uri: item.imageURL}}></ImageBackground>
                            ) : (
                              <ImageBackground
                                // style={styles.avatar}
                                style={{width: 100, height: 100}}
                                imageStyle={{borderRadius: 100}}
                                source={
                                  item.species === 'Dog'
                                    ? require('../assets/dog.png')
                                    : item.species === 'Cat'
                                    ? require('../assets/cat.png')
                                    : require('../assets/other.png')
                                }></ImageBackground>
                            )}
                          </View>
                        </TouchableOpacity>

                        <Text style={styles.buttonText}>{item.name}</Text>
                      </View>
                    );
                  }}
                />
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

            <View style={({flex: 1}, {flexDirection: 'row'})}>
              <View style={styles.listContainer}>
                <Text style={styles.headerText}>Owners</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={group.ownersList}
                  keyExtractor={(button) => button.ownerId}
                  renderItem={({item}) => {
                    return (
                      <View>
                        <Pressable
                          style={[styles.CircleList]}
                          // onPress={() => navigation.push('OwnerDashboardScreen')}
                        >
                          <View style={styles.button}>
                            {item.imageURL ? (
                              <ImageBackground
                                // style={styles.avatar}
                                style={{width: 100, height: 100}}
                                imageStyle={{borderRadius: 100}}
                                source={{uri: item.imageURL}}></ImageBackground>
                            ) : (
                              <ImageBackground
                                // style={styles.avatar}
                                style={{width: 130, height: 130}}
                                imageStyle={{borderRadius: 100, marginTop: 15}}
                                source={require('../assets/owner.png')}></ImageBackground>
                            )}
                          </View>
                        </Pressable>
                        <Text style={styles.buttonText}>{item.username}</Text>
                      </View>
                    );
                  }}
                />
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

          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'pink',
              paddingVertical: 12,
              marginBottom: 10,
              borderRadius: 20,
              marginHorizontal: 40,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
            }}
            onPress={() =>
              navigation.push('UpdateGroupScreen', {
                group: group,
                pets: user.petsList,
                owners: user.ownersList,
              })
            }>
            <View>
              <Text>Group Settings</Text>
            </View>
          </TouchableOpacity>

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
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 30,
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
    marginVertical: 5,
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
