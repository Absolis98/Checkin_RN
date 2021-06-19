import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ImageBackground,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';

const OwnersScreen = () => {
  const {authUser} = useContext(AuthContext);
  const {user, addCoOwner, deleteCoOwner} = useContext(UserContext);

  const [isAddModalVisible, setVisible] = useState(false);
  const [isDeleteModalVisible, setVisible2] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');

  let ownersList = [
    {name: 'name1'},
    {name: 'name2'},
    {name: 'name3'},
    {name: 'name4'},
    {name: 'name5'},
    {name: 'name6'},
    {name: 'name7'},
    {name: 'name8'},
    {name: 'name9'},
  ];
  return (
    <View style={styles.container}>
      <FlatList
        data={user.ownersList}
        bounces
        keyExtractor={(owner) => owner.ownerId}
        renderItem={({item}) => {
          return (
            <View style={{borderBottomWidth: 1}}>
              <TouchableOpacity
                onLongPress={() => {
                  setVisible2(true);
                  setSelectedOwner(item);
                }}
                style={styles.nameContainer}>
                {item.imageURL !== undefined ? (
                  <ImageBackground
                    // style={styles.avatar}
                    style={{width: 60, height: 60}}
                    imageStyle={{
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.2)',
                      marginLeft: 10,
                    }}
                    source={{uri: item.imageURL}}></ImageBackground>
                ) : (
                  <ImageBackground
                    // style={styles.avatar}
                    style={{width: 60, height: 60}}
                    imageStyle={{
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.2)',
                      marginLeft: 10,
                    }}
                    source={require('../assets/owner.png')}></ImageBackground>
                )}
                <Text style={styles.nameStyle}>{item.username}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {isAddModalVisible ? (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0, .4)',
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}></View>
      ) : null}

      {/* Add Owner Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        // onRequestClose={() => {
        //   // this.closeButtonFunction()
        // }}
      >
        <Pressable
          onPress={() => setVisible(false)}
          style={{
            height: '100%',
            marginTop: 'auto',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            style={{
              height: '25%',
              backgroundColor: '#DEDEDE',
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}
            onPress={() => null}>
            <View style={[styles.inputContainer, {marginVertical: 20}]}>
              <Text style={styles.inputTitle}>Co-Owner's Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="email"
                autoCapitalize={'none'}
                autoCorrect={false}
                value={email}
                onChangeText={(newValue) => setEmail(newValue)}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginHorizontal: 10,
              }}>
              <TouchableOpacity
                style={{
                  marginHorizontal: 1,
                  width: '50%',
                  paddingVertical: 10,
                }}
                onPress={() => {
                  setVisible(!isAddModalVisible);
                }}>
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginHorizontal: 1,
                  width: '50%',
                  paddingVertical: 10,
                }}
                onPress={() => {
                  setVisible(!isAddModalVisible);
                  addCoOwner(authUser, email);
                }}>
                <Text style={styles.modalBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete Owner Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        // onRequestClose={() => {
        //   // this.closeButtonFunction()
        // }}
      >
        <View
          style={{
            height: '25%',
            marginTop: 'auto',
            backgroundColor: 'lightblue',
          }}>
          <View>
            <Button
              title="Cancel"
              onPress={() => {
                setVisible2(!isDeleteModalVisible);
              }}
            />
            <Button
              title="Delete"
              onPress={() => {
                setVisible2(!isDeleteModalVisible);
                deleteCoOwner(authUser.uid, selectedOwner.ownerId);
              }}
            />
          </View>
        </View>
      </Modal>

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
          setVisible(!isAddModalVisible);
        }}>
        <View>
          <Text>Add Co-Owner</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  nameStyle: {
    marginStart: 20,
    fontSize: 20,
    marginTop: 15,
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
    marginRight: '45%',
  },
  modalBtnText: {
    fontSize: 19,
    textAlign: 'center',
    color: 'rgb(40,113,247)',
  },
});

export default OwnersScreen;
