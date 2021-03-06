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
  ImageBackground,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {AuthContext} from '../context/AuthContext';
import RadioButtonGroup from '../components/RadioButtonGroup';

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

const CreatePetScreen = ({navigation}) => {
  const {authUser} = useContext(AuthContext);

  const [isAddPhotoModalVisible, setVisible] = useState(false);

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
        setVisible(!isAddPhotoModalVisible);
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
        setVisible(!isAddPhotoModalVisible);
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

      batch.set(newPetRef, {
        // petId: firestore.FieldPath.documentId(),
        petId: petId,
        imageURL: imageUrl,
        ownerIds: {
          [authUser.uid]: {
            username: authUser.disPlayName,
            ownerId: authUser.uid,
          },
        },
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        gender: pet.gender,
        age: pet.age,
        weight: pet.weight,
        actions: petActions(pet.species),
        actionRecords: {},
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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
        // backgroundColor: 'pink',
      }}>
      <Text style={styles.title}>Picture</Text>
      <TouchableOpacity
        onPress={() => {
          setVisible(!isAddPhotoModalVisible);
        }}>
        {image !== null ? (
          <ImageBackground
            // style={styles.avatar}
            style={[styles.avatar, {backgroundColor: 'white'}]}
            imageStyle={{borderRadius: 100}}
            source={{uri: image}}></ImageBackground>
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
                setVisible(!isAddPhotoModalVisible);
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
    width: 90,
    height: 90,
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
    fontSize: 22,
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
});

export default CreatePetScreen;
