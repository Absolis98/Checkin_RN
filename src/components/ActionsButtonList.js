import React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export default ActionsButtonList = ({
  title,
  username,
  pet,
  type,
  incrementAction,
}) => {
  const navigation = useNavigation();

  const setStatusColor = (done, need) => {
    if (done >= 0 && done < need / 2) return {borderColor: 'rgb(217, 83, 79)'};
    else if (done >= need / 2 && done <= need - 1)
      return {borderColor: 'rgb(240, 173, 78)'};
    else if (done === need) return {borderColor: 'rgb(40,167,69)'};
  };

  // const sortedActions = sortData(pet.actions[type]);

  return (
    <View style={styles.card}>
      <View style={styles.listContainer}>
        <Text style={{marginLeft: 15, fontSize: 25}}>{title}</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={pet.actions[type]}
          keyExtractor={(button) => button.name}
          renderItem={({item}) => {
            return (
              //<QuickActionBtn action={item} />;

              <TouchableOpacity
                style={[styles.CircleList]}
                onPress={() => {
                  if (item.done === item.need) return alert("You're done");
                  incrementAction(username, type, item);
                }}>
                <View
                  style={[styles.button, setStatusColor(item.done, item.need)]}>
                  <Text style={styles.buttonText}>{item.name}</Text>
                  <Text>
                    {item.done}/{item.need}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.toNextScreenBtn,
          {
            backgroundColor:
              pet.gender === 'Male'
                ? '#4c86a8'
                : pet.gender === 'Female'
                ? '#e0777d'
                : '#F3B680',
          },
        ]}
        onPress={() => {
          navigation.push('ActionsOverviewScreen', {
            petId: pet.petId,
            actionType: type,
          });
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(234, 240, 240, 0.35)',
          }}>
          <Text style={{color: 'white', fontSize: 22}}>{'>'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  CircleList: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 5,
  },
  listContainer: {
    // borderBottomWidth: 1,
    width: '90%',
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 18,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  button: {
    borderWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  toNextScreenBtn: {
    flex: 1,
    borderLeftWidth: 2,
    borderColor: 'rgba(0, 0, 0,0.35)',
    // backgroundColor: 'rgb(96, 169, 246)',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
});
