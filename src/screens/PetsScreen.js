import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';

const PetsScreen = ({navigation}) => {
  const {user} = useContext(UserContext);

  return (
    <View style={styles.container}>
      <View style={{flex: 3}}>
        <View style={styles.groupsContainer}>
          <Text style={styles.title}>In a Group:</Text>

          <FlatList
            data={user.petsList}
            keyExtractor={(button) => button.petId}
            numColumns={4}
            renderItem={({item}) => {
              console.log(item);
              if (item.inGroup)
                return (
                  <View>
                    <TouchableOpacity
                      style={[styles.CircleList]}
                      onPress={() =>
                        navigation.push('PetDashboardScreen', {
                          petId: item.petId,
                        })
                      }>
                      <View style={styles.button}>
                        {item.imageURL !== null ? (
                          <ImageBackground
                            // style={styles.avatar}
                            style={{width: 90, height: 90}}
                            imageStyle={{borderRadius: 100}}
                            source={{uri: item.imageURL}}></ImageBackground>
                        ) : (
                          <ImageBackground
                            // style={styles.avatar}
                            style={{width: 90, height: 90}}
                            imageStyle={{borderRadius: 100}}
                            source={
                              item.species === 'Dog'
                                ? require('../assets/dog.png')
                                : item.species === 'Cat'
                                ? require('../assets/cat.png')
                                : require('../assets/other.png')
                            }></ImageBackground>
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>{item.name}</Text>
                  </View>
                );
            }}
          />
        </View>
        <View style={styles.groupsContainer}>
          <Text style={styles.title}>Not in an a Group:</Text>
          <FlatList
            data={user.petsList}
            keyExtractor={(button) => button.petId}
            numColumns={4}
            renderItem={({item}) => {
              console.log(item.id);
              if (!item.inGroup)
                return (
                  <View>
                    <TouchableOpacity
                      style={[styles.CircleList]}
                      onPress={() =>
                        navigation.push('PetDashboardScreen', {
                          petId: item.petId,
                        })
                      }>
                      <View style={styles.button}>
                        {item.imageURL !== null ? (
                          <ImageBackground
                            // style={styles.avatar}
                            style={{width: 90, height: 90}}
                            imageStyle={{borderRadius: 100}}
                            source={{uri: item.imageURL}}></ImageBackground>
                        ) : (
                          <ImageBackground
                            // style={styles.avatar}
                            style={{width: 90, height: 90}}
                            imageStyle={{borderRadius: 100}}
                            source={
                              item.species === 'Dog'
                                ? require('../assets/dog.png')
                                : item.species === 'Cat'
                                ? require('../assets/cat.png')
                                : require('../assets/other.png')
                            }></ImageBackground>
                        )}
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>{item.name}</Text>
                  </View>
                );
            }}
          />
        </View>
      </View>

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
          navigation.push('CreatePetScreen');
        }}>
        <Text>Create New Pet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    marginVertical: 15,
  },
  header: {
    flex: 0.2,
    alignItems: 'center',
  },
  groupsContainer: {
    flex: 2,
    alignItems: 'center',
    // flexWrap: 'wrap',
  },
  CircleList: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    // backgroundColor: '#fff',
    borderRadius: 100,
  },
});

export default PetsScreen;
