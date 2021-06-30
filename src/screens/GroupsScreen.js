import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {UserContext} from '../context/UserContext';

const GroupsScreen = ({navigation}) => {
  const {user} = useContext(UserContext);

  // let groupList = [
  //   {name: 'group1'},
  //   {name: 'group2'},
  //   {name: 'group3'},
  //   {name: 'group4'},
  //   {name: 'group5'},
  //   {name: 'group6'},
  //   {name: 'group7'},
  //   {name: 'group8'},
  //   {name: 'group9'},
  //   {name: 'group10'},
  //   {name: '2group1'},
  //   {name: '2group2'},
  //   {name: '2group3'},
  //   {name: '2group4'},
  //   {name: '2group5'},
  //   {name: '2group6'},
  //   {name: '2group7'},
  //   {name: '2group8'},
  //   {name: '2group9'},
  //   {name: '2group10'},
  //   {name: '3group1'},
  //   {name: '3group2'},
  //   {name: '3group3'},
  //   {name: '3group4'},
  //   {name: '3group5'},
  //   {name: '3group6'},
  //   {name: '3group7'},
  //   {name: '3group8'},
  //   {name: '3group9'},
  //   {name: '3group10'},
  // ];

  return (
    <View style={styles.container}>
      <View
        style={{
          height: '20%',
          width: '100%',
          backgroundColor: 'rgb(228, 146, 144)',
          position: 'absolute',
        }}></View>
      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          {/* <View
            style={{
              height: '10%',
              paddingHorizontal: 10,
              paddingVertical: 13,
              borderRadius: 10,
              marginTop: 30,
              backgroundColor: '#eaf0f0',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
              }}>
              <Text>{'Hellllo'}</Text>
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              height: '40%',
              width: '100%',
              backgroundColor: 'rgb(228, 146, 144)',
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              position: 'absolute',
            }}>
            <View
              style={{
                // backgroundColor: 'red',
                margin: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontWeight: '600', fontSize: 70, color: 'white'}}>
                Groups
              </Text>
            </View>
          </View>
          <FlatList
            contentContainerStyle={{paddingTop: 170}}
            data={user.groupsList}
            keyExtractor={(button) => button.groupId}
            renderItem={({item}) => {
              console.log(item);
              return (
                <View>
                  <TouchableOpacity
                    style={[styles.CircleList]}
                    onPress={() =>
                      navigation.push('GroupsOverviewScreen', {
                        groupId: item.groupId,
                        // user's co-owners and pets list
                        // only purpose is to be used in update group screen
                      })
                    }>
                    <View style={styles.button}>
                      <View
                        style={{
                          position: 'absolute',
                          left: 20,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: 'rgba(0,0,0,0.2)',
                          // backgroundColor: 'pink',
                        }}>
                        {item.imageURL ? (
                          <ImageBackground
                            // style={styles.avatar}
                            style={{width: 125, height: 125}}
                            imageStyle={{borderRadius: 20}}
                            source={{uri: item.imageURL}}></ImageBackground>
                        ) : (
                          <ImageBackground
                            // style={styles.avatar}
                            style={{width: 125, height: 125}}
                            imageStyle={{borderRadius: 20}}
                            source={require('../assets/group.png')}></ImageBackground>
                        )}
                      </View>

                      <Text style={styles.buttonText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </SafeAreaView>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            width: '70%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            borderRadius: 15,
            shadowColor: 'rgba(0,0,0, .4)', // IOS
            shadowOffset: {height: 1, width: 1}, // IOS
            shadowOpacity: 1, // IOS
            shadowRadius: 1, //IOS
            elevation: 2, // Android
            backgroundColor: 'pink',
          }}
          onPress={() => {
            navigation.push('CreateGroupScreen', {username: user.username});
          }}>
          <Text>Create New Group</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'pink',
  },
  header: {
    flex: 1,
    alignItems: 'center',
  },
  groupsContainer: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'cyan',
    flexWrap: 'wrap',
  },
  CircleList: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 10,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: {height: 1, width: 1}, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    elevation: 2, // Android
  },
  buttonText: {
    color: 'black',
    fontSize: 25,
    textAlign: 'center',
    width: '100%',
    paddingLeft: 70,
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 400,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 25,
    // backgroundColor: '',
  },
  headerText: {
    fontWeight: '600',
    fontSize: 30,
    paddingTop: 5,
    paddingBottom: 5,
  },
  nameContainer: {
    paddingVertical: 20,
  },
  nameStyle: {
    marginStart: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    // width: '75%',
    height: 40,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  inputTitle: {
    fontSize: 17,
    margin: 10,
    marginRight: '45%',
  },
});

export default GroupsScreen;
