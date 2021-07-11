import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Platform,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';
import Icon from 'react-native-vector-icons/Feather';

const SettingsScreen = ({navigation}) => {
  const {authUser, logout} = useContext(AuthContext);
  const {user} = useContext(UserContext);

  console.log(user);
  // console.log(user.petsLIst.length);

  const [isImageModalVisible, setImageModalVisable] = useState(false);

  return (
    <View style={{flex: 1}}>
      {Platform.OS === 'ios' ? (
        <View
          style={{
            height: '10%',
            width: '100%',
            backgroundColor: '#564787',
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
            backgroundColor: '#564787',
          }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: ' rgba(140, 140, 140, 0.40)',
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
            Settings
          </Text>
          <View
            style={{
              paddingHorizontal: 25,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
            }}></View>
        </View>
        {user ? (
          <View style={{flex: 1}}>
            <Text style={styles.headerText}>Account</Text>
            <View
              style={{
                backgroundColor: 'white',
                paddingVertical: 20,
                marginHorizontal: 20,
                borderRadius: 15,
                alignItems: 'center',
                shadowColor: 'rgba(0,0,0, .4)', // IOS
                shadowOffset: {height: 1, width: 1}, // IOS
                shadowOpacity: 1, // IOS
                shadowRadius: 1, //IOS
                elevation: 2, // Android
              }}>
              <Text style={{fontSize: 25}}>{user.username}</Text>
              <TouchableOpacity
                onPress={() => setImageModalVisable(true)}
                style={[styles.button]}>
                {user.imageURL ? (
                  <Image
                    // style={styles.avatar}
                    style={{width: 120, height: 120, borderRadius: 100}}
                    source={{uri: user.imageURL}}
                  />
                ) : (
                  <Image
                    // style={styles.avatar}
                    style={{width: 120, height: 120, borderRadius: 100}}
                    source={require('../assets/owner.png')}
                  />
                )}
              </TouchableOpacity>
              <Text style={{fontSize: 17, marginTop: 5}}>
                Pets: {user.petsList ? user.petsList.length : '0'}
              </Text>
              <Text style={{fontSize: 17, marginTop: 5}}>
                Groups: {user.groupsList ? user.groupsList.length : '0'}
              </Text>
              <Text style={{fontSize: 17, marginTop: 5}}>
                Co-Owners: {user.ownersList ? user.ownersList.length : '0'}
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                style={{
                  flex: 1,
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
                  backgroundColor: 'white',
                }}
                onPress={() => {
                  navigation.push('EditProfileScreen', {
                    username: user.username,
                    imageURL: user.imageURL,
                    userId: authUser.uid,
                  });
                }}>
                <Text>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  marginTop: 10,
                  borderRadius: 15,
                  marginLeft: 5,
                  marginRight: 20,
                  borderWidth: 5,
                  backgroundColor: 'white',
                  borderColor: 'rgb(220,53,69)',
                }}
                onPress={() => {
                  logout();
                }}>
                <Text
                  style={{
                    color: 'rgb(220,53,69)',
                    fontSize: 20,
                    fontWeight: '500',
                  }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType="fade"
              transparent={true}
              visible={isImageModalVisible}
              onRequestClose={() => setImageModalVisable(!isImageModalVisible)}>
              <Pressable
                onPress={() => setImageModalVisable(!isImageModalVisible)}
                style={{
                  height: '100%',
                  marginTop: 'auto',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0,0,0, .4)',
                }}>
                <View
                  style={{
                    backgroundColor: 'black',
                  }}>
                  {user.imageURL ? (
                    <Image
                      // style={styles.avatar}
                      style={{
                        height: 300,
                        width: 300,
                        margin: 5,
                      }}
                      source={{uri: user.imageURL}}
                    />
                  ) : (
                    <Image
                      style={{
                        height: 300,
                        width: 300,
                        margin: 5,
                        backgroundColor: 'white',
                      }}
                      source={require('../assets/owner.png')}
                    />
                  )}
                </View>
              </Pressable>
            </Modal>
          </View>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Nothing to see here</Text>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  headerText: {
    fontWeight: '600',
    fontSize: 25,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 15,
    marginLeft: 15,
  },
});

export default SettingsScreen;
