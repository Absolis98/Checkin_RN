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
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const AddPhotoModal = () => {
  const [isAddPhotoModalVisible, setPhotoModalVisible] = useState(false);
  return (
    <View>
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

const styles = StyleSheet.create({});

export default AddPhotoModal;
