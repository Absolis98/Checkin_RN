import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import RadioButtonGroup from '../components/RadioButtonGroup';
import Icon from 'react-native-vector-icons/Feather';
import AddPhotoModal from '../components/AddPhotoModal';

const petActions = (species) => {
  switch (species) {
    case 'Dog':
      return {
        essential: {
          Feed: {
            name: 'Feed',
            description: 'Refill food plate.',
            frequency: 'daily',
            need: 3,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Water: {
            name: 'Water',
            description: 'Refill Water bowl.',
            frequency: 'daily',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
        todo: {
          Walk: {
            name: 'Walk',
            description: 'Take on a walk.',
            frequency: 'weekly',
            need: 3,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Brush: {
            name: 'Brush',
            description: 'Give pet a nice Brush.',
            frequency: 'weekly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Play: {
            name: 'Play',
            description:
              'Play and give your pet attention for at least 5 minutes.',
            frequency: 'daily',
            need: 2,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          ['Trim Nails']: {
            name: 'Trim Nails',
            description: 'Trim their nails.',
            frequency: 'monthly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
        medical: {
          ['Tic Med']: {
            name: 'Tic Med',
            description: 'Give pet Tic Med medicine.',
            frequency: 'monthly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
      };
    case 'Cat':
      return {
        essential: {
          Feed: {
            name: 'Feed',
            description: 'Refill food plate.',
            frequency: 'daily',
            need: 3,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Water: {
            name: 'Water',
            description: 'Refill water bowl.',
            frequency: 'daily',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
        todo: {
          litterbox: {
            name: 'litterbox',
            description: 'Clean the litterbox.',
            frequency: 'daily',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Brush: {
            name: 'Brush',
            description: 'Give pet a nice Brush.',
            frequency: 'weekly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Play: {
            name: 'Play',
            description:
              'Play and give your pet attention for at least 5 minutes.',
            frequency: 'daily',
            need: 2,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          ['Trim Nails']: {
            name: 'Trim Nails',
            description: 'Trim their nails.',
            frequency: 'monthly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
        medical: {
          ['Tic Med']: {
            name: 'Tic Med',
            description: 'Give pet Tic Med medicine.',
            frequency: 'monthly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
      };
    default:
      return {
        essential: {
          Feed: {
            name: 'Feed',
            description: 'This is a description',
            frequency: 'daily',
            need: 3,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Water: {
            name: 'Water',
            frequency: 'daily',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
        todo: {
          Brush: {
            name: 'Brush',
            description: 'This is a description',
            frequency: 'weekly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
          Play: {
            name: 'Play',
            description: 'This is a description',
            frequency: 'daily',
            need: 2,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
        medical: {
          ['Tic Med']: {
            name: 'Tic Med',
            description: 'This is a description',
            frequency: 'monthly',
            need: 1,
            done: 0,
            currentDayTime: firestore.Timestamp.fromDate(new Date()),
          },
        },
      };
  }
};

const CreatePetScreen = ({navigation, route}) => {
  const {authUser} = useContext(AuthContext);
  const {user} = useContext(UserContext);

  const [isAddPhotoModalVisible, setPhotoModalVisible] = useState(false);

  const [image, setImage] = useState(null);

  const [name, setName] = useState('');

  const [species, setSpecies] = useState('');
  const [manualSpecies, setManualSpecies] = useState('');

  const [gender, setGender] = useState('');

  const [breed, setBreed] = useState('');

  const [age, setAge] = useState('');

  const [birthday, setBirthday] = useState('');

  const [weight, setWeight] = useState('');

  const [condition, setCondition] = useState('');

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
      cropperCircleOverlay: true,
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
    if (image == null) {
      return null;
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

  const submitPet = async (pet) => {
    try {
      const imageUrl = await uploadImage();

      const batch = firestore().batch();

      const newPetRef = firestore().collection('pets').doc();

      let petId = newPetRef.id;

      let resetDate = new Date();
      new Date(resetDate.setHours(0, 0, 0, 0));
      resetDate.getDay() !== 0
        ? resetDate.setDate(resetDate.getDate() + (8 - resetDate.getDay()))
        : resetDate.setDate(resetDate.getDate() + 1);

      batch.set(newPetRef, {
        // petId: firestore.FieldPath.documentId(),
        petId: petId,
        imageURL: imageUrl,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        age: pet.age,
        weight: pet.weight,
        actions: petActions(pet.species),
        actionRecords: {resetDate: resetDate},
      });

      const userRef = firestore().collection('users').doc(authUser.uid);
      const breadcrumbs = `petsList.${newPetRef.id}`;
      batch.update(userRef, {
        [breadcrumbs]: {
          name: pet.name,
          species: pet.species,
          petId: newPetRef.id,
          inGroup: false,
          imageURL: imageUrl,
        },
      });

      batch.commit().catch((error) => {
        console.log('Something went wrong during the batch write: ' + error);
      });
      navigation.pop();
      navigation.push('PetDashboardScreen', {
        petId: petId,
      });
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
              gender === ''
                ? 'rgb(19, 147, 67)'
                : gender === 'Male'
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
              gender === ''
                ? 'rgb(19, 147, 67)'
                : gender === 'Male'
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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            // backgroundColor: 'pink',
          }}>
          <Text
            style={[styles.inputTitle, {textAlign: 'center', paddingLeft: 0}]}>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name:</Text>
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
            // initialState={pet.species}
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
            // initialState={pet.gender}
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
              style={styles.createBtn}
              onPress={() => {
                // pet = createPet(name, species, gender, age, weight);
                const pet = {
                  name: name,
                  species: species,
                  gender: gender,
                  breed: breed,
                  age: age,
                  weight: weight,
                };
                pet.species === 'Other' ? (pet.species = manualSpecies) : null;
                submitPet(pet);
                // navigation.pop();
                // navigation.push('PetDashboardScreen', {
                //   petId: petId,
                // });
              }}>
              <Text>Create Pet</Text>
            </TouchableOpacity>
          )}

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
                    <Text style={styles.modalBtnText}>Choose From Library</Text>
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 100,
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
  },
  createBtn: {
    height: 40,
    width: '70%',
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'pink',
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

export default CreatePetScreen;
