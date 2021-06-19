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

import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';

import checkinDB from '../api/fakeDB';

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

const CreateGroupScreen = ({navigation, route}) => {
  const {authUser} = useContext(AuthContext);
  const {user} = useContext(UserContext);
  // consider pulling pets and owners in the previous screen
  // pass as params (saves one read)
  // const [pets, setPets] = useState({petsList: ''});
  // const {owners, pets} = route.params;

  const [groupName, setGroupName] = useState('');
  const [image, setImage] = useState(null);
  const [isOwnerModalVisible, setOwnerModalVisible] = useState(false);
  const [isPetModalVisible, setPetModalVisible] = useState(false);
  const [isAddPhotoModalVisible, setPhotoModalVisible] = useState(false);

  const [addingPetsList, setAddingPetsList] = useState([]);
  const [addingOwnersList, setAddingOwnersList] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  let groupId;

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
    if (!image) {
      return null;
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

  const submitGroup = async () => {
    try {
      const imageURL = await uploadImage();

      const batch = firestore().batch();

      const newGroupRef = firestore().collection('groups').doc();

      groupId = newGroupRef.id;

      const ownersList = {};
      const petsList = {};

      for (let i = 0; i < addingOwnersList.length; i++) {
        ownersList[addingOwnersList[i].ownerId] = addingOwnersList[i];
      }
      ownersList[authUser.uid] = {
        ownerId: authUser.uid,
        username: authUser.displayName,
      };
      for (let i = 0; i < addingPetsList.length; i++) {
        petsList[addingPetsList[i].petId] = addingPetsList[i];
        petsList[addingPetsList[i].petId].inGroup = true;
      }
      console.log('this one: ' + petsList);
      // console.log(ownerslist);

      batch.set(newGroupRef, {
        // petId: firestore.FieldPath.documentId(),
        groupId: newGroupRef.id,
        groupName: groupName,
        ownersList: ownersList,
        petsList: petsList,
        imageURL: imageURL,
      });
      const chunkToUpdate = {};
      for (let i = 0; i < addingPetsList.length; i++) {
        chunkToUpdate[`petsList.${addingPetsList[i].petId}`] = {
          name: addingPetsList[i].name,
          petId: addingPetsList[i].petId,
          inGroup: true,
          imageURL: addingPetsList[i].imageURL,
          species: addingPetsList[i].species,
        };
      }

      let groupBreadcrumbs = `groupsList.${groupId}`;
      chunkToUpdate[groupBreadcrumbs] = {
        groupId: groupId,
        name: groupName,
        imageURL: imageURL,
      };
      addingOwnersList.forEach((owner) => {
        let tmpUserRef = firestore().collection('users').doc(owner.ownerId);
        // let petBreadcrumbs = `petsList`;

        batch.update(tmpUserRef, chunkToUpdate);
      });
      let tmpUserRef = firestore().collection('users').doc(authUser.uid);
      // let groupBreadcrumbs = `groupsList.${groupId}`;
      // let petBreadcrumbs = `petsList`;
      batch.update(tmpUserRef, chunkToUpdate);

      batch.update(tmpUserRef, {
        [groupBreadcrumbs]: {
          groupId: groupId,
          name: groupName,
          imageURL: imageURL,
        },
      });

      // const userRef = firestore().collection('users').doc(user.uid);
      // const breadcrumbs = `petsList.${newPetRef.id}`;
      // batch.update(userRef, {
      //   [breadcrumbs]: {name: name, petId: newPetRef.id, inGroup: false},
      // });

      await batch.commit().catch((e) => console.log(e));

      navigation.pop();
      navigation.push('GroupsOverviewScreen', {
        groupId: groupId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  console.log(addingPetsList);
  console.log(addingOwnersList);

  // setAddingPetsList([0]);
  // console.log(addingPetsList);
  // console.log(addingPetsList.includes(0));

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
            <Pressable
              onPress={() => {
                setPetModalVisible(!isPetModalVisible);
              }}>
              <Text style={{fontSize: 28, color: 'deepskyblue'}}>+</Text>
            </Pressable>
          </View>

          <FlatList
            data={addingPetsList}
            keyExtractor={(button) => button.petId}
            horizontal
            renderItem={({item}) => {
              // console.log(item);
              if (!item.inGroup)
                return (
                  <View>
                    <TouchableOpacity
                      style={[styles.CircleList]}
                      // onPress={() =>
                      //   navigation.push('PetDashboardScreen', {
                      //     petId: item.petId,
                      //   })
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
            <Pressable
              onPress={() => {
                setOwnerModalVisible(!isOwnerModalVisible);
              }}>
              <Text style={{fontSize: 28, color: 'deepskyblue'}}>+</Text>
            </Pressable>
          </View>
          <FlatList
            data={addingOwnersList}
            keyExtractor={(button) => button.ownerId}
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
                      {item.imageURL !== undefined ? (
                        <ImageBackground
                          // style={styles.avatar}
                          style={{width: 90, height: 90}}
                          imageStyle={{borderRadius: 100}}
                          source={{uri: item.imageURL}}></ImageBackground>
                      ) : (
                        <ImageBackground
                          // style={styles.avatar}
                          style={{width: 110, height: 90}}
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
              data={user.petsList}
              bounces
              keyExtractor={(pets) => pets.petId}
              renderItem={({item}) => {
                if (!item.inGroup)
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
                          if (!addingPetsList.includes(item))
                            setAddingPetsList([...addingPetsList, item]);
                          else {
                            let array = [...addingPetsList];
                            array.splice(array.indexOf(item), 1);
                            setAddingPetsList(array);
                          }
                        }}
                        style={styles.nameContainer}>
                        <View style={{flexDirection: 'row'}}>
                          {item.imageURL !== null ? (
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
              data={user.ownersList}
              bounces
              keyExtractor={(owner) => owner.ownerId}
              renderItem={({item}) => {
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
                        {item.imageURL !== undefined ? (
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
          <Text>{transferred} % Completed!</Text>
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
            submitGroup();
          }}>
          <View>
            <Text>Create Group</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddPhotoModalVisible}
        // onRequestClose={() => {
        //   // this.closeButtonFunction()
        // }}
      >
        <View
          style={{
            height: '40%',
            marginTop: 'auto',
            backgroundColor: 'lightblue',
          }}>
          <View>
            <Button
              title="Cancel"
              onPress={() => {
                setPhotoModalVisible(!isAddPhotoModalVisible);
              }}
            />
            <Button
              title="Take Photo"
              onPress={() => {
                takePhotoFromCamera();
              }}
            />
            <Button
              title="Choose From Library"
              onPress={() => {
                choosePhotoFromLibrary();
              }}
            />
          </View>
        </View>
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
  },
  nameContainer: {
    paddingVertical: 10,
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
});

export default CreateGroupScreen;
