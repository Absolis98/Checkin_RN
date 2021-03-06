import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';

const SettingsScreen = ({navigation}) => {
  const {authUser, logout} = useContext(AuthContext);
  const {user} = useContext(UserContext);

  return (
    <SafeAreaView style={{flex: 1}}>
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
          <Text style={{fontSize: 25}}>{authUser.displayName}</Text>
          <View style={[styles.button]}>
            {user.imageURL !== undefined ? (
              <ImageBackground
                // style={styles.avatar}
                style={{width: 100, height: 100}}
                imageStyle={{borderRadius: 100}}
                source={{uri: user.imageURL}}></ImageBackground>
            ) : (
              <ImageBackground
                // style={styles.avatar}
                style={{width: 100, height: 100}}
                imageStyle={{borderRadius: 100}}
                source={require('../assets/owner.png')}></ImageBackground>
            )}
          </View>
          <Text style={{fontSize: 17, marginTop: 5}}>
            Pets: {user.petsList.length}
          </Text>
          <Text style={{fontSize: 17, marginTop: 5}}>
            Groups: {user.groupsList.length}
          </Text>
          <Text style={{fontSize: 17, marginTop: 5}}>
            Co-Owners: {user.ownersList.length}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 12,
          marginBottom: 10,
          borderRadius: 15,
          marginHorizontal: 40,
          borderWidth: 5,
          borderColor: 'rgb(220,53,69)',
        }}
        onPress={() => {
          logout();
        }}>
        <View>
          <Text
            style={{color: 'rgb(220,53,69)', fontSize: 20, fontWeight: '500'}}>
            Logout
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'skyblue',
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
