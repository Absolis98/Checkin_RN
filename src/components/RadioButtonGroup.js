import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

// Todo: Implement a dynamic hiddenUITrigger functionality
// - Passing a radio button name as a prop where if selected,
//   triggers the hidden UI to appear

const RadioButtonGroup = ({
  buttonNames,
  changeValue,
  initialState,
  hiddenUITrigger,
  hiddenUI,
}) => {
  const [currentSelection, setCurrentSelection] = useState(
    initialState === undefined
      ? undefined
      : !buttonNames.includes(initialState)
      ? 'Other'
      : initialState,
  );
  const [hidden, setHidden] = useState(
    initialState === undefined
      ? true
      : hiddenUITrigger?.includes(currentSelection)
      ? false
      : true,
  );
  console.log(currentSelection);
  console.log(hidden);

  const toggleBtns = (buttonName) => {
    if (initialState !== undefined || currentSelection !== undefined)
      return buttonName !== currentSelection
        ? styles.notSelected
        : styles.isSelected;
  };

  const renderButtons = (buttonNames) => {
    const buttons = [];
    buttonNames.forEach((buttonName) => {
      buttons.push(
        <TouchableOpacity
          key={buttonName}
          style={[styles.toggleBtn, toggleBtns(buttonName)]}
          onPress={() => {
            setCurrentSelection(buttonName);
            changeValue(buttonName);
            hiddenUITrigger?.includes(buttonName)
              ? setHidden(false)
              : setHidden(true);
          }}>
          <Text>{buttonName}</Text>
        </TouchableOpacity>,
      );
    });
    return buttons;
  };

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{flexDirection: 'row'}}>{renderButtons(buttonNames)}</View>
      <View style={{flexDirection: 'row'}}>{hidden ? null : hiddenUI}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleBtn: {
    height: 40,
    width: '20%',
    margin: '2%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'limegreen',
    alignItems: 'center',
  },
  isSelected: {
    backgroundColor: 'limegreen',
  },
  notSelected: {
    backgroundColor: 'green',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    // width: '75%',
    height: 50,
    width: '90%',
    lineHeight: 21,
    fontSize: 17,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  inputTitle: {
    fontSize: 22,
    margin: 10,
    width: '100%',
    paddingLeft: 30,
    // marginRight: '75%',
  },
});

export default RadioButtonGroup;
