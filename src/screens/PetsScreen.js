import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {AuthContext} from '../context/AuthContext';
import {UserContext} from '../context/UserContext';

// idea for layout. create a 3x2 grid of pets you can swipe horizontally from
// So max 6 pets are shown at once, swipe to see the next 6

const PetsScreen = ({navigation}) => {
  const {user} = useContext(UserContext);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <View
          style={{
            height: '10%',
            width: '100%',
            backgroundColor: 'rgb(19, 147, 67)',
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
            backgroundColor: 'rgb(19, 147, 67)',
          }}>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: ' rgba(120, 130, 140, 0.45)',
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
            Pets
          </Text>
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              marginVertical: 20,
              backgroundColor: ' rgba(120, 130, 140, 0.45)',
            }}
            onPress={() => {
              navigation.push('CreatePetScreen');
            }}>
            <Icon name={'plus'} size={30} color={'white'} />
          </TouchableOpacity>
        </View>
        <View style={styles.petsContainer}>
          <Text style={styles.title}>In a Group:</Text>

          <ScrollView
            horizontal
            style={{flex: 1}}
            contentContainerStyle={{flex: 1}}>
            <FlatList
              data={user.petsList}
              contentContainerStyle={{
                alignSelf: 'flex-start',
              }}
              keyExtractor={(button) => button.petId}
              numColumns={Math.ceil(user.petsList.length / 2)}
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
          </ScrollView>
        </View>
        <View style={styles.petsContainer}>
          <Text style={styles.title}>Not in an a Group:</Text>
          <ScrollView
            horizontal
            style={{flex: 1}}
            contentContainerStyle={{flex: 1}}>
            <FlatList
              data={user.petsList}
              keyExtractor={(button) => button.petId}
              numColumns={Math.ceil(user.petsList.length / 2)}
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
          </ScrollView>
        </View>
      </SafeAreaView>
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
  petsContainer: {
    flex: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    marginHorizontal: 10,
    borderRadius: 40,
    marginVertical: 10,
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
