import React, {createContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const uploadButton = ({onPressUpload}) => {
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  // might have to check for default image (dog, cat, other)
  const uploadImage = async (image) => {
    if (image) {
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
  return (
    <View>
      {uploading ? (
        <View>
          <Text>{transferred} % Completed!</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={() => onPressUpload()}>
          <Text>Update Pet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const takePhotoFromCamera = () => {
  ImagePicker.openCamera({
    width: 300,
    height: 300,
    compressImageQuality: 0.7,
    cropping: true,
  }).then((image) => {
    console.log(image);
    const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
    return imageUri;
  });
};

const choosePhotoFromLibrary = () => {
  ImagePicker.openPicker({
    width: 300,
    height: 300,
    compressImageQuality: 0.7,
    cropping: true,
  }).then((image) => {
    console.log(image);
    const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
    return imageUri;
  });
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

    const userRef = firestore().collection('users').doc(authUser.uid);
    batch.update(userRef, {
      [`petsList.${pet.petId}.name`]: petData.name,
      [`petsList.${pet.petId}.species`]: petData.species,
      [`petsList.${pet.petId}.imageURL`]: image,
    });

    await batch.commit().catch((error) => {
      console.log('Something went wrong during the batch write: ' + error);
    });

    navigation.pop();
  } catch (e) {
    console.log(e);
  }
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
    width: 90,
    height: 90,
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
    fontSize: 22,
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
});
