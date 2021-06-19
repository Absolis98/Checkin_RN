import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const QuickActionBtn = ({action, group}) => {
  const navigation = useNavigation();
  //   console.log(action);
  // console.log(pet);
  const setStatusColor = (done, need) => {
    if (done >= 0 && done < need / 2) return {borderColor: 'rgb(217, 83, 79)'};
    else if (done >= need / 2 && done < need - 1)
      return {borderColor: 'rgb(240, 173, 78)'};
    else if (done === need) return {borderColor: 'rgb(40,167,69)'};
  };

  return (
    <TouchableOpacity
      style={[styles.CircleList]}
      onPress={() => {
        alert('You have: ' + action.name);
      }}>
      <View></View>
      <View style={[styles.button, setStatusColor(action.done, action.need)]}>
        <Text style={styles.buttonText}>{action.name}</Text>
        <Text>
          {action.done}/{action.need}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  button: {
    borderWidth: 7,
    // borderColor: 'rgb(40,167,69)',
    // borderColor: 'rgb(240, 173, 78)',
    // borderColor: 'rgb(217, 83, 79)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  CircleList: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default QuickActionBtn;
