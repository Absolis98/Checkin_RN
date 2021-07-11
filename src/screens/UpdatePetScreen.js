import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {AuthContext} from '../context/AuthContext';
import {PetContext} from '../context/PetContext';
import RadioButtonGroup from '../components/RadioButtonGroup';
import Icon from 'react-native-vector-icons/Feather';

const UpdatePetScreen = ({navigation, route}) => {
  const {authUser} = useContext(AuthContext);
  const {pet: petContext, deletePet} = useContext(PetContext);

  const {pet} = route.params;

  const [isAddPhotoModalVisible, setPhotoModalVisible] = useState(false);

  const originalImage = pet.imageURL;

  const [image, setImage] = useState(pet.imageURL);
  console.log(image);

  const [name, setName] = useState(pet.name);

  // const [name, setName] = useState('');

  const [species, setSpecies] = useState(pet.species);
  const [manualSpecies, setManualSpecies] = useState(
    pet.species !== undefined ? pet.species : '',
  );

  const [gender, setGender] = useState(pet.gender);

  const [breed, setBreed] = useState(pet.breed);

  const [age, setAge] = useState(pet.age);

  const [birthday, setBirthday] = useState();

  const [weight, setWeight] = useState(pet.weight);

  const [condition, setCondition] = useState('');

  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
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

  // might have to check for default image (dog, cat, other)
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

    const storageRef = storage().ref(`petPhotos/${filename}`);
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

  const submitPet = async (petData) => {
    try {
      const imageURL = await uploadImage();

      const batch = firestore().batch();

      const petRef = firestore().collection('pets').doc(pet.petId);
      console.log('This should work: ' + petRef);

      batch.update(petRef, {
        imageURL: imageURL,
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        gender: petData.gender,
        age: petData.age,
        weight: petData.weight,
      });

      await firestore()
        .collection('groups')
        .where(`petsList.${pet.petId}.name`, '==', pet.name)
        .get()
        .then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            const snapshot = querySnapshot.docs[0]; // use only the first document, but there should only be one
            const documentRef = snapshot.ref; // now you have a DocumentReference
            await documentRef.get().then((snapshot) => {
              // changes pet data for all owners associated with pet
              for (let ownerKey in snapshot.data().ownersList) {
                let tmpUserRef = firestore().collection('users').doc(ownerKey);
                batch.update(tmpUserRef, {
                  [`petsList.${pet.petId}.name`]: petData.name,
                  [`petsList.${pet.petId}.species`]: petData.species,
                  [`petsList.${pet.petId}.imageURL`]: imageURL,
                });
              }
            });
            console.log('ibp');
            batch.update(documentRef, {
              [`petsList.${pet.petId}.name`]: petData.name,
              [`petsList.${pet.petId}.species`]: petData.species,
              [`petsList.${pet.petId}.imageURL`]: imageURL,
            });
          } else {
            // changes pet data for the sole owner
            const userRef = firestore().collection('users').doc(authUser.uid);
            batch.update(userRef, {
              [`petsList.${pet.petId}.name`]: petData.name,
              [`petsList.${pet.petId}.species`]: petData.species,
              [`petsList.${pet.petId}.imageURL`]: imageURL,
            });
          }
        });

      await batch.commit().catch((error) => {
        console.log('Something went wrong during the batch write: ' + error);
      });

      navigation.pop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' ? (
        <View
          style={{
            height: '10%',
            width: '100%',
            backgroundColor:
              gender === 'Male'
                ? '#4c86a8'
                : gender === 'Female'
                ? '#e0777d'
                : '#F3B680',
            position: 'absolute',
          }}></View>
      ) : null}
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
            width: '100%',
            paddingHorizontal: 20,
            backgroundColor:
              gender === 'Male'
                ? '#4c86a8'
                : gender === 'Female'
                ? '#e0777d'
                : '#F3B680',
          }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: ' rgba(120, 130, 140, 0.45)',
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
            Create Pet
          </Text>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
            }}></View>
        </View>
        {petContext ? (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              // backgroundColor: 'pink',
            }}>
            <Text
              style={[
                styles.inputTitle,
                {textAlign: 'center', paddingLeft: 0},
              ]}>
              Picture
            </Text>

            <TouchableOpacity
              onPress={() => {
                setPhotoModalVisible(!isAddPhotoModalVisible);
              }}>
              {image ? (
                <Image
                  // style={styles.avatar}
                  style={styles.avatar}
                  imageStyle={{}}
                  source={{uri: image}}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text>+</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.inputTitle}>Name:</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                autoCorrect={false}
                value={name}
                onChangeText={(newValue) => setName(newValue)}
              />
            </View>

            <Text style={styles.inputTitle}>Species:</Text>
            <RadioButtonGroup
              buttonNames={['Dog', 'Cat', 'Other']}
              initialState={pet.species}
              changeValue={(species) => setSpecies(species)}
              hiddenUITrigger={['Other']}
              hiddenUI={
                <View style={styles.inputContainer}>
                  <Text style={styles.inputTitle}>Please Specify:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Species"
                    autoCorrect={false}
                    value={manualSpecies}
                    onChangeText={(newValue) => setManualSpecies(newValue)}
                  />
                </View>
              }
            />

            <Text style={styles.inputTitle}>Gender:</Text>
            <RadioButtonGroup
              buttonNames={['Male', 'Female', 'Other']}
              changeValue={(gender) => setGender(gender)}
              initialState={pet.gender}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Breed:</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                autoCorrect={false}
                value={breed}
                onChangeText={(newValue) => setBreed(newValue)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Age:</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                keyboardType="numeric"
                autoCorrect={false}
                value={age}
                onChangeText={(newValue) => setAge(newValue)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Weight:</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                keyboardType="numeric"
                autoCorrect={false}
                value={weight}
                onChangeText={(newValue) => setWeight(newValue)}
              />
            </View>

            {uploading ? (
              <View>
                <Text>{transferred} % Completed!</Text>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => {
                  const petData = {
                    name: name,
                    species: species,
                    gender: gender,
                    breed: breed,
                    age: age,
                    weight: weight,
                  };
                  petData.species === 'Other'
                    ? (petData.species = manualSpecies)
                    : null;
                  submitPet(petData);
                  // navigation.pop();
                  // navigation.push('PetDashboardScreen', {
                  //   petId: petId,
                  // });
                }}>
                <Text>Update Pet</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                // pet = createPet(name, species, gender, age, weight);
                deletePet(authUser, pet);
                navigation.popToTop();
              }}>
              <Text style={{color: 'white'}}>Delete Pet</Text>
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
                      style={styles.modalBtn}
                      onPress={() => {
                        takePhotoFromCamera();
                      }}>
                      <Text style={[styles.modalBtnText, {marginTop: 6}]}>
                        Take Photo
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() => {
                        choosePhotoFromLibrary();
                      }}>
                      <Text style={styles.modalBtnText}>
                        Choose From Library
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.modalBtn}
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
    fontSize: 28,
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
    borderRadius: 100,
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
    fontSize: 25,
    margin: 10,
    width: '100%',
    paddingLeft: 30,
    // marginRight: '75%',
  },
  updateBtn: {
    height: 40,
    width: '70%',
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    color: 'white',
    backgroundColor: 'pink',
    alignItems: 'center',
  },
  deleteBtn: {
    height: 40,
    width: '70%',
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgb(220,53,69)',
    alignItems: 'center',
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

export default UpdatePetScreen;
