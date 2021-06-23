import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import UploadButton from '../api/PhotoStorage';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const EditProfileScreen = ({route, navigation}) => {
  const {username, imageURL, userId} = route.params;

  const {updateUserData} = useContext(UserContext);
  const {changeDisplayName} = useContext(AuthContext);

  const [name, setUsername] = useState(username);
  const originalImage = imageURL;
  const [image, setImage] = useState(imageURL);
  const [isAddPhotoModalVisible, setPhotoModalVisible] = useState(false);
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
      compressImageQuality: 0.75,
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

  // might have to check for default image (dog, cat, other)
  const uploadImage = async (image) => {
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

    const storageRef = storage().ref(`ownerPhotos/${filename}`);
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

  const submitForm = async (username, image) => {
    try {
      const imageURL = await uploadImage(image);
      //   const imageURL = null;

      const batch = firestore().batch();

      const userRef = firestore().collection('users').doc(userId);

      batch.update(userRef, {
        username: username,
        imageURL: imageURL,
      });
      console.log('pass 0');

      await firestore()
        .collection('users')
        .where(`ownersList.${userId}.ownerId`, '==', userId)
        .get()
        .then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.docs.forEach((doc) => {
              console.log('hahahahahahhahahahahahh');
              console.log(doc.ref);
              let docRef = doc.ref;
              batch.update(docRef, {
                [`ownersList.${userId}.username`]: username,
                [`ownersList.${userId}.imageURL`]: imageURL,
              });
            });
          } else {
            console.log('does not exist');
          }
        });
      console.log('pass 1');

      await firestore()
        .collection('groups')
        .where(`ownersList.${userId}.ownerId`, '==', userId)
        .get()
        .then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.docs.forEach((doc) => {
              let docRef = doc.ref;
              batch.update(docRef, {
                [`ownersList.${userId}.username`]: username,
                [`ownersList.${userId}.imageURL`]: imageURL,
              });
            });
          } else {
            console.log('does not exist');
          }
        });
      console.log('pass 2');

      batch.commit().catch((error) => {
        console.log('Something went wrong during the batch write: ' + error);
      });
      console.log('pass 3');

      navigation.pop();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <TouchableOpacity
        style={styles.avatar}
        onPress={() => setPhotoModalVisible(true)}>
        {image ? (
          <Image
            // style={styles.avatar}
            style={{width: 125, height: 125, borderRadius: 100}}
            source={{uri: image}}
          />
        ) : (
          <Image
            // style={styles.avatar}
            style={{width: 125, height: 125, borderRadius: 100}}
            source={require('../assets/owner.png')}
          />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Species"
          autoCorrect={false}
          value={name}
          onChangeText={(newValue) => setUsername(newValue)}
        />
      </View>
      {/* <UploadButton
        onPressUpload={submitForm}
        image={image}
        originalImage={originalImage}
      /> */}

      {uploading ? (
        <View>
          <Text>{transferred} % Completed!</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            width: '60%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            marginTop: 10,
            borderRadius: 15,
            marginLeft: 20,
            marginRight: 5,
            shadowColor: 'rgba(0,0,0, .4)', // IOS
            shadowOffset: {height: 1, width: 1}, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            elevation: 2, // Android
            backgroundColor: 'pink',
          }}
          onPress={() => {
            console.log('save');
            submitForm(name, image);
            // navigation.pop();
            // navigation.push('PetDashboardScreen', {
            //   petId: petId,
            // });
          }}>
          <Text>Save</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: 125,
    height: 125,
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
    // marginRight: '75%',
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

export default EditProfileScreen;
