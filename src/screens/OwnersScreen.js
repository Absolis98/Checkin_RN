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
  Image,
  Pressable,
  SafeAreaView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import Icon from 'react-native-vector-icons/Feather';

const OwnersScreen = ({navigation}) => {
  const {authUser} = useContext(AuthContext);
  const {user, addCoOwner, deleteCoOwner} = useContext(UserContext);

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
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
      {Platform.OS === 'ios' ? (
        <View
          style={{
            height: '10%',
            width: '100%',
            backgroundColor: 'rgb(246, 174, 95)',
            position: 'absolute',
          }}></View>
      ) : null}
      <SafeAreaView style={{flex: 1, width: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
            width: '100%',
            paddingHorizontal: 20,
            backgroundColor: 'rgb(246, 174, 95)',
          }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: ' rgba(180, 120, 50, 0.40)',
            }}
            onPress={() => navigation.pop()}>
            <Icon name={'arrow-left'} size={30} color={'white'} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 40,
              color: 'white',
            }}>
            Owners
          </Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: ' rgba(180, 120, 50, 0.40)',
            }}
            onPress={() => {
              setAddModalVisible(!isAddModalVisible);
            }}>
            <Icon name={'user-plus'} size={30} color={'white'} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={user.ownersList}
          bounces
          keyExtractor={(owner) => owner.ownerId}
          renderItem={({item}) => {
            return (
              <View style={styles.nameContainer}>
                {item.imageURL ? (
                  <Image
                    // style={styles.avatar}
                    style={styles.avatar}
                    source={{uri: item.imageURL}}
                  />
                ) : (
                  <Image
                    // style={styles.avatar}
                    style={styles.avatar}
                    source={require('../assets/owner.png')}
                  />
                )}
                <Text style={styles.nameStyle}>{item.username}</Text>

                <TouchableOpacity
                  style={{
                    margin: 9,
                    position: 'absolute',
                    right: 10,
                  }}
                  onPress={() => {
                    setDeleteModalVisible(true);
                    setSelectedOwner(item);
                  }}>
                  <Icon
                    name={'trash-2'}
                    size={40}
                    color={'rgb(220,53,69)'}
                    // iconStyle={{}}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </SafeAreaView>

      {/* Add Owner Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
        // onRequestClose={() => {
        //   // this.closeButtonFunction()
        // }}
      >
        <Pressable
          onPress={() => {
            setAddModalVisible(false);
          }}
          style={{
            height: '100%',
            marginTop: 'auto',
            justifyContent: 'center',
          }}>
          <Pressable
            onPress={() => null}
            style={{
              height: 210,
              marginHorizontal: '7%',
              backgroundColor: '#DEDEDE',
              borderRadius: 25,
            }}>
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
                  setAddModalVisible(!isAddModalVisible);
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
                  setAddModalVisible(!isAddModalVisible);
                  addCoOwner(email);
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
        <Pressable
          onPress={() => setDeleteModalVisible(false)}
          style={{
            height: '100%',
            marginTop: 'auto',
            justifyContent: 'center',
          }}>
          <Pressable
            style={{
              height: 210,
              marginHorizontal: '7%',
              backgroundColor: '#DEDEDE',
              borderRadius: 25,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => null}>
            <Text
              style={{
                position: 'absolute',
                top: 45,
                fontSize: 20,
                textAlign: 'center',
              }}>
              Are you sure you want to remove {selectedOwner.username}?
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setDeleteModalVisible(!isDeleteModalVisible);
                }}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setDeleteModalVisible(!isDeleteModalVisible);
                  deleteCoOwner(authUser.uid, selectedOwner.ownerId);
                }}>
                <Text style={[styles.modalBtnText, {color: 'rgb(220,53,69)'}]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {isAddModalVisible || isDeleteModalVisible ? (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0, .4)',
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}></View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 8,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    marginLeft: 20,
  },
  nameStyle: {
    marginStart: 25,
    fontSize: 23,
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
  modalBtn: {
    marginHorizontal: 1,
    width: '50%',
    paddingVertical: 10,
    paddingVertical: 9,
    marginVertical: 30,

    // width: '100%',
  },
  modalBtnText: {
    fontSize: 19,
    textAlign: 'center',
    color: 'rgb(40,113,247)',
  },
});

export default OwnersScreen;
