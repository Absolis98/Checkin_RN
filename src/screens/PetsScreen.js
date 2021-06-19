import React, {useContext} from 'react';
import {View, Text, StyleSheet, FlatList, ImageBackground} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
          navigation.push('CreatePetScreen');
        }}>
        <View>
          <Text>Create New Pet</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
