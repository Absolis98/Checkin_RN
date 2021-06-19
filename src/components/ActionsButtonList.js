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
    <View style={({flex: 1}, {flexDirection: 'row'})}>
      <View style={styles.listContainer}>
        <Text style={{marginLeft: 15, fontSize: 28}}>{title}</Text>
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
        style={styles.toNextScreenBtn}
        onPress={() => {
          navigation.push('ActionsOverviewScreen', {
            petId: pet.petId,
            actionType: type,
          });
        }}>
        <View>
          <Text>{'>'}</Text>
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
  listContainer: {
    borderColor: 'gray',
    borderBottomWidth: 1,
    // borderBottomWidth: 1,
    width: '90%',
    marginVertical: 5,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'pink',
    marginVertical: 5,
  },
});
