import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  ImageBackground,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

import {UserContext} from '../context/UserContext';

// let groupsList = [];
// Object.keys(checkinDB.pets).forEach((key) => {
//   groupsList.push(checkinDB.pets[key]);
// });
// console.log(checkinDB.groups);
// console.log(groupsList);

// let ownerList = [];
// Object.keys(checkinDB.owners).forEach((key) => {
//   ownerList.push(checkinDB.owners[key]);
// });

const UpdateGroupScreen = ({navigation, route}) => {
  const {user} = useContext(UserContext);
  // consider pulling pets and owners in the previous screen
  // pass as params (saves one read)
  // const [pets, setPets] = useState({petsList: ''});
  const {group, owners, pets} = route.params;
  console.log(group);
  const petsNotInGroup = [];
  for (let i = 0; i < pets.length; i++) {
    if (!pets[i].inGroup) petsNotInGroup.push(pets[i]);
  }

  const ownersNotInTheGroup = [];
  const ownersInTheGroup = [...Object.values(group.ownersList)];
  console.log(ownersInTheGroup);
  console.log(owners);
  let found = false;
  for (let i = 0; i < owners.length; i++) {
    for (let j = 0; j < ownersInTheGroup.length; j++) {
      if (owners[i].ownerId == ownersInTheGroup[j].ownerId) {
        found = true;
        break;
      }
    }
    if (found === true) {
      found = false;
      console.log('AAAAAAAAAAAA');
    } else if (found === false) {
      ownersNotInTheGroup.push(owners[i]);
    }
  }

  //   console.log('---------');
  //   console.log(group);
  //   console.log(owners);
  //   console.log(pets);
  //   console.log('---------');

  const [groupName, setGroupName] = useState(group.groupName);
  const originalImage = group.imageURL;

  const [image, setImage] = useState(group.imageURL);
  const [isOwnerModalVisible, setOwnerModalVisible] = useState(false);
  const [isPetModalVisible, setPetModalVisible] = useState(false);
  const [isAddPhotoModalVisible, setPhotoModalVisible] = useState(false);

  const [addingPetsList, setAddingPetsList] = useState(
    Object.values(group.petsList),
  );

  const [addingOwnersList, setAddingOwnersList] = useState(
    Object.values(group.ownersList),
  );
  const [originalPetsList, setOriginalPetsList] = useState(addingPetsList);
  const [originalOwnersList, setOriginalOwnersList] = useState(
    addingOwnersList,
  );

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      compressImageQuality: 0.1,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        setPhotoModalVisible(!isAddPhotoModalVisible);
      })
      .catch((e) => console.log(e));
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      compressImageQuality: 0.7,
      cropping: true,
    })
      .then((image) => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        setPhotoModalVisible(!isAddPhotoModalVisible);
      })
      .catch((e) => console.log(e));
  };

  const uploadImage = async () => {
    if (!image) return null;
    if (originalImage == image) {
      return image;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    const last = filename.split('.').pop();
    const first = filename.split('.').slice(0, -1).join('.');
    filename = first + Date.now() + '.' + last;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`groupPhotos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transerred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  const submitGroupUpdate = async () => {
    try {
      const imageURL = await uploadImage();

      const batch = firestore().batch();

      const breadcrumbs = `groupsList.${group.groupId}`;
      const chunkToUpdate = {};
      const chunkForUser = {};

      // operate on pets who were added to the group
      for (let i = 0; i < addingPetsList.length; i++) {
        chunkToUpdate[`petsList.${addingPetsList[i].petId}`] = {
          name: addingPetsList[i].name,
          petId: addingPetsList[i].petId,
          inGroup: true,
          imageURL: addingPetsList[i].imageURL,
          species: addingPetsList[i].species,
        };
        chunkForUser[`petsList.${addingPetsList[i].petId}`] = {
          name: addingPetsList[i].name,
          petId: addingPetsList[i].petId,
          inGroup: true,
          imageURL: addingPetsList[i].imageURL,
          species: addingPetsList[i].species,
        };
      }

      // operate on pets who were removed from the group
      for (let i = 0; i < originalPetsList.length; i++) {
        if (!addingPetsList.includes(originalPetsList[i])) {
          chunkToUpdate[
            `petsList.${originalPetsList[i].petId}`
          ] = firestore.FieldValue.delete();
          chunkForUser[`petsList.${originalPetsList[i].petId}`] = {
            name: originalPetsList[i].name,
            petId: originalPetsList[i].petId,
            inGroup: false,
            imageURL: originalPetsList[i].imageURL,
            species: originalPetsList[i].species,
          };
        }
      }

      // new and current users recieve most current group's petList
      // and group is added to their groupsList
      chunkToUpdate[breadcrumbs] = {
        groupId: group.groupId,
        name: groupName,
        imageURL: imageURL,
      };
      chunkForUser[breadcrumbs] = {
        groupId: group.groupId,
        name: groupName,
        imageURL: imageURL,
      };
      for (let i = 0; i < addingOwnersList.length; i++) {
        if (addingOwnersList[i].ownerId !== user.uid) {
          console.log('pass');
          let tmpUserRef = firestore()
            .collection('users')
            .doc(addingOwnersList[i].ownerId);

          batch.update(tmpUserRef, chunkToUpdate);
        } else {
          console.log('pass');
          let tmpUserRef = firestore()
            .collection('users')
            .doc(addingOwnersList[i].ownerId);

          batch.update(tmpUserRef, chunkForUser);
        }
      }

      delete chunkToUpdate[breadcrumbs];

      // new users are added to the chunkToUpdate to be added to groups collection doc
      for (let i = 0; i < addingOwnersList.length; i++) {
        if (!originalOwnersList.includes(addingOwnersList[i])) {
          chunkToUpdate[`ownersList.${addingOwnersList[i].ownerId}`] =
            addingOwnersList[i];
        }
      }

      // removed co-owners will lose reference to original group petsList
      const chunkOfPetsToRemove = {};
      for (let i = 0; i < originalPetsList.length; i++) {
        chunkOfPetsToRemove[
          `petsList.${originalPetsList[i].petId}`
        ] = firestore.FieldValue.delete();
      }
      chunkOfPetsToRemove[breadcrumbs] = firestore.FieldValue.delete();
      for (let i = 0; i < originalOwnersList.length; i++) {
        if (!addingOwnersList.includes(originalOwnersList[i])) {
          let tmpUserRef = firestore()
            .collection('users')
            .doc(originalOwnersList[i].ownerId);
          batch.update(tmpUserRef, chunkOfPetsToRemove);
        }
      }

      // removed co-owners will be reflected on chunkToUpdate
      for (let i = 0; i < originalOwnersList.length; i++) {
        if (!addingOwnersList.includes(originalOwnersList[i])) {
          chunkToUpdate[
            `ownersList.${originalOwnersList[i].ownerId}`
          ] = firestore.FieldValue.delete();
        }
      }

      const groupRef = firestore().collection('groups').doc(group.groupId);
      chunkToUpdate['groupName'] = groupName;
      chunkToUpdate['imageURL'] = imageURL;

      batch.update(groupRef, chunkToUpdate);

      batch.commit();

      navigation.pop();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteGroup = async () => {
    try {
      const batch = firestore().batch();

      const chunkForOthers = {};
      const chunkForUser = {};

      // remove pets for other users, user keeps pets
      for (let i = 0; i < originalPetsList.length; i++) {
        chunkForOthers[
          `petsList.${originalPetsList[i].petId}`
        ] = firestore.FieldValue.delete();
        chunkForUser[`petsList.${originalPetsList[i].petId}.inGroup`] = false;
      }

      chunkForOthers[
        `groupsList.${group.groupId}`
      ] = firestore.FieldValue.delete();
      chunkForUser[
        `groupsList.${group.groupId}`
      ] = firestore.FieldValue.delete();

      for (let i = 0; i < originalOwnersList.length; i++) {
        if (originalOwnersList[i].ownerId !== user.uid) {
          let tmpUserRef = firestore()
            .collection('users')
            .doc(originalOwnersList[i].ownerId);
          batch.update(tmpUserRef, chunkForOthers);
        }
      }

      const userRef = firestore().collection('users').doc(user.uid);

      batch.update(userRef, chunkForUser);

      const groupRef = firestore().collection('groups').doc(group.groupId);

      batch.delete(groupRef);

      await batch.commit();

      navigation.popToTop();
    } catch (e) {
      console.log(e);
    }
  };

  const isInGroup = () => {
    let inGroup = false;
    for (let userGroup of user.groupsList) {
      if (userGroup.groupId === group.groupId) inGroup = true;
    }
    return inGroup;
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.title}>Picture</Text>

          <TouchableOpacity
            onPress={() => setPhotoModalVisible(!isAddPhotoModalVisible)}>
            {image !== null ? (
              <Image style={styles.avatar} source={{uri: image}} />
            ) : (
              <View style={styles.avatar}>
                <Text>+</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            autoCorrect={false}
            value={groupName}
            onChangeText={(newValue) => setGroupName(newValue)}
          />
        </View>

        <View style={{borderTopWidth: 1, marginVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}>
            <Text style={styles.headerText}>Pets</Text>
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={() => {
                setPetModalVisible(!isPetModalVisible);
              }}>
              <Text style={{fontSize: 28, color: 'deepskyblue'}}>+</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={addingPetsList}
            keyExtractor={(button) => button.petId}
            horizontal
            renderItem={({item}) => {
              // console.log(item);
              return (
                <View>
                  <TouchableOpacity
                    style={[styles.CircleList]}
                    // onPress={() =>
                    //   navigation.push('GroupsOverviewScreen', {item})
                    // }
                  >
                    <View style={styles.button}>
                      {item.imageURL !== null ? (
                        <ImageBackground
                          // style={styles.avatar}
                          style={{width: 90, height: 90}}
                          imageStyle={{borderRadius: 100}}
                          source={{uri: item.imageURL}}></ImageBackground>
                      ) : (
                        <ImageBackground
                          // style={styles.avatar}
                          style={{width: 90, height: 90}}
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
        <View style={{borderTopWidth: 1, marginBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
            }}>
            <Text style={styles.headerText}>Co-Owners</Text>
            <TouchableOpacity
              style={{paddingHorizontal: 10}}
              onPress={() => {
                setOwnerModalVisible(!isOwnerModalVisible);
              }}>
              <Text style={{fontSize: 28, color: 'deepskyblue'}}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={addingOwnersList}
            keyExtractor={(button) => button.ownerId}
            horizontal
            renderItem={({item}) => {
              // console.log(item);
              // console.log('Look at this');
              // if (group['ownersList'][item.ownerId])
              return (
                <View>
                  <TouchableOpacity
                    style={[styles.CircleList]}
                    // onPress={() =>
                    //   navigation.push('GroupsOverviewScreen', {item})
                    // }
                  >
                    <View style={styles.button}>
                      {item.imageURL ? (
                        <ImageBackground
                          // style={styles.avatar}
                          style={{width: 90, height: 90}}
                          imageStyle={{borderRadius: 100}}
                          source={{uri: item.imageURL}}></ImageBackground>
                      ) : (
                        <ImageBackground
                          // style={styles.avatar}
                          style={{width: 100, height: 110}}
                          imageStyle={{borderRadius: 100, marginTop: 15}}
                          source={require('../assets/owner.png')}></ImageBackground>
                      )}
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.buttonText}>{item.username}</Text>
                </View>
              );
            }}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isPetModalVisible}
          // onRequestClose={() => {
          //   // this.closeButtonFunction()
          // }}
        >
          <SafeAreaView
            style={{
              height: '50%',
              marginTop: 'auto',
              backgroundColor: '#DEDEDE',
            }}>
            <FlatList
              data={[...Object.values(group.petsList), ...petsNotInGroup]}
              bounces
              keyExtractor={(pets) => pets.petId}
              renderItem={({item}) => {
                console.log('+++++++++++');
                console.log(...Object.values(group.petsList));
                console.log(...petsNotInGroup);
                return (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      backgroundColor: addingPetsList.includes(item)
                        ? 'gray'
                        : null,
                    }}>
                    <Pressable
                      onPress={() => {
                        //   console.log(addingPetsList);
                        //   console.log('+++++++++++');
                        if (!addingPetsList.includes(item)) {
                          // console.log('attempt to go in');
                          setAddingPetsList([...addingPetsList, item]);
                        } else {
                          // console.log("didn't go in");
                          let array = [...addingPetsList];
                          array.splice(array.indexOf(item), 1);
                          setAddingPetsList(array);
                        }
                        console.log('pressed');
                      }}
                      style={styles.nameContainer}>
                      <View style={{flexDirection: 'row'}}>
                        {item.imageURL !== null ? (
                          <ImageBackground
                            // style={styles.avatar}
                            style={styles.image}
                            imageStyle={{borderRadius: 100}}
                            source={{uri: item.imageURL}}></ImageBackground>
                        ) : (
                          <ImageBackground
                            // style={styles.avatar}
                            style={styles.image}
                            imageStyle={{
                              borderRadius: 100,
                              borderWidth: 1,
                              borderColor: 'rgba(0,0,0,0.2)',
                            }}
                            source={
                              item.species === 'Dog'
                                ? require('../assets/dog.png')
                                : item.species === 'Cat'
                                ? require('../assets/cat.png')
                                : require('../assets/other.png')
                            }></ImageBackground>
                        )}
                        <Text style={styles.nameStyle}>{item.name}</Text>
                      </View>
                    </Pressable>
                  </View>
                );
              }}
            />
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setPetModalVisible(!isPetModalVisible);
              }}>
              <Text style={styles.modalBtnText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isOwnerModalVisible}
          // onRequestClose={() => {
          //   // this.closeButtonFunction()
          // }}
        >
          <SafeAreaView
            style={{
              height: '50%',
              marginTop: 'auto',
              backgroundColor: '#DEDEDE',
            }}>
            <FlatList
              data={[
                ...Object.values(group.ownersList),
                ...ownersNotInTheGroup,
              ]}
              bounces
              keyExtractor={(owner) => owner.ownerId}
              renderItem={({item}) => {
                console.log('_____________');
                // console.log(item);
                // console.log(...Object.values(group.ownersList));
                // console.log(...owners);
                console.log(item);
                // if (item['ownerId'] !== user.uid)
                return (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      backgroundColor: addingOwnersList.includes(item)
                        ? 'gray'
                        : null,
                    }}>
                    <Pressable
                      onPress={() => {
                        if (!addingOwnersList.includes(item))
                          setAddingOwnersList([...addingOwnersList, item]);
                        else {
                          let array = [...addingOwnersList];
                          array.splice(array.indexOf(item), 1);
                          setAddingOwnersList(array);
                        }
                      }}
                      style={styles.nameContainer}>
                      <View style={{flexDirection: 'row'}}>
                        {item.imageURL ? (
                          <ImageBackground
                            // style={styles.avatar}
                            style={styles.image}
                            imageStyle={{
                              borderRadius: 100,
                              borderWidth: 1,
                              borderColor: 'rgba(0,0,0,0.2)',
                            }}
                            source={{uri: item.imageURL}}></ImageBackground>
                        ) : (
                          <ImageBackground
                            // style={styles.avatar}
                            style={styles.image}
                            imageStyle={{
                              borderRadius: 100,
                              borderWidth: 1,
                              borderColor: 'rgba(0,0,0,0.2)',
                            }}
                            source={require('../assets/owner.png')}></ImageBackground>
                        )}
                        <Text style={styles.nameStyle}>{item.username}</Text>
                      </View>
                    </Pressable>
                  </View>
                );
              }}
            />
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setOwnerModalVisible(!isOwnerModalVisible);
              }}>
              <Text style={styles.modalBtnText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </View>

      {uploading ? (
        <View>
          <Text style={{textAlign: 'center'}}>{transferred} % Completed!</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
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
          onPress={() => {
            submitGroupUpdate();
            // navigation.pop();
          }}>
          <View>
            <Text>Update Group</Text>
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgb(220,53,69)',
          paddingVertical: 12,
          marginBottom: 10,
          borderRadius: 20,
          marginHorizontal: 40,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
        }}
        onPress={() => {
          deleteGroup();
          // navigation.pop();
        }}>
        <Text style={{color: 'white'}}>Delete Group</Text>
      </TouchableOpacity>

      {isAddPhotoModalVisible || isAddPhotoModalVisible ? (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0, .4)',
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}></View>
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddPhotoModalVisible}
        onRequestClose={() => {
          setPhotoModalVisible(false);
        }}>
        <Pressable
          onPress={() => {
            setPhotoModalVisible(false);
          }}
          style={{
            height: '100%',
            marginTop: 'auto',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            onPress={() => null}
            style={{
              height: '22%',
              backgroundColor: 'white',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}>
            <View>
              <TouchableOpacity
                style={styles.photoModalBtn}
                onPress={() => {
                  takePhotoFromCamera();
                }}>
                <Text style={[styles.modalBtnText, {marginTop: 6}]}>
                  Take Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoModalBtn}
                onPress={() => {
                  choosePhotoFromLibrary();
                }}>
                <Text style={styles.modalBtnText}>Choose From Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoModalBtn}
                onPress={() => {
                  setPhotoModalVisible(!isAddPhotoModalVisible);
                }}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: 'pink',
  },
  title: {
    fontSize: 17,
    margin: 10,
  },
  avatar: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    fontSize: 17,
    margin: 10,
    marginRight: '75%',
  },
  header: {
    flex: 0.35,
    alignItems: 'center',
  },
  groupsContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'cyan',
    flexWrap: 'wrap',
  },
  CircleList: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 100,
    // backgroundColor: 'orange',
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
    width: 90,
    height: 90,
    // backgroundColor: '#fff',
    borderRadius: 50,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 25,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 10,
  },
  nameContainer: {
    paddingVertical: 20,
  },
  nameStyle: {
    marginStart: 20,
    fontSize: 25,
    marginTop: 15,
  },
  modalBtnText: {
    fontSize: 19,
    color: 'rgb(40,113,247)',
    textAlign: 'center',
  },
  modalBtn: {
    marginVertical: 10,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 65,
    height: 65,
    marginLeft: 35,
  },
  photoModalBtn: {
    paddingVertical: 9,
    marginVertical: 1,
    width: '100%',
  },
});

export default UpdateGroupScreen;
