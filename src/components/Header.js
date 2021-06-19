import React from 'react';
import {View, Text, StyleSheet, Button, SafeAreaView} from 'react-native';
import {HeaderBackButton} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';

const Header = (props) => {
  // const openMenu = () => {
  //   navigation.openDrawer();
  // };
  const route = useRoute();
  console.log('_________________');
  console.log(route.name);

  return (
    <SafeAreaView style={styles.header}>
      {/* <Button
        style={styles.hamburgerIcon}
        title="="
        onPress={() => alert('keep me?')}
        //  onPress={openMenu}
      /> */}
      {route.name !== 'HomeScreen' ? (
        <HeaderBackButton {...props} onPress={() => props.navigation.pop()} />
      ) : null}

      <View>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
      {/* <Button title="i" onPress={() => alert('HELP!')} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333',
    letterSpacing: 1,
  },
  hamburgerIcon: {
    position: 'absolute',
    left: 40,
  },
});

export default Header;
