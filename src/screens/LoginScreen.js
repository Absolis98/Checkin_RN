import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';

const SignUpScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const {login} = useContext(AuthContext);

  return (
    <View style={{alignItems: 'center'}}>
      <Image
        style={styles.image}
        imageStyle={{}}
        source={require('../assets/logo.png')}
      />
      <Text style={styles.inputTitle}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={(newValue) => setEmail(newValue)}
      />
      <Text style={styles.inputTitle}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={(newValue) => setPassword(newValue)}
      />
      {/* <TouchableOpacity >
        <View></View>
      </TouchableOpacity> */}
      <View style={{flexDirection: 'row', alignItems: 'space-around'}}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => login(email, password)}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.push('SignUpScreen')}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    // width: '75%',
    height: 50,
    lineHeight: 21,
    fontSize: 17,
    width: '90%',
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
  },
  image: {
    marginVertical: 35,
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  btnText: {
    fontSize: 22,
    color: 'rgb(40,113,247)',
  },
  btn: {
    marginTop: 20,
    marginHorizontal: 30,
  },
});

export default SignUpScreen;
