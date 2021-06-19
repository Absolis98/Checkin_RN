import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

const Header = ({action}) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={action}>
      <Text style={styles.headerText}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 15,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#333',
  },
  hamburgerIcon: {
    position: 'absolute',
    left: 40,
  },
});

export default Header;
