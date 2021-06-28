import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
// import {FirebaseContext} from '../context/FirebaseContext';
import {AuthContext} from '../context/AuthContext';

const SignUpScreen = ({navigation}) => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {register} = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={{alignItems: 'center'}}>
      <Image
        style={styles.image}
        imageStyle={{}}
        source={require('../assets/logo.png')}
      />
      <Text style={styles.inputTitle}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        textContentType="username"
        autoCorrect={false}
        value={username}
        onChangeText={(newValue) => setUsername(newValue)}
      />
      <Text style={styles.inputTitle}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        textContentType="emailAddress"
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
        textContentType="newPassword"
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={(newValue) => setPassword(newValue)}
      />
      <Text style={styles.inputTitle}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
        textContentType="newPassword"
        autoCapitalize="none"
        autoCorrect={false}
        value={confirmPassword}
        onChangeText={(newValue) => setConfirmPassword(newValue)}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          if (password === confirmPassword) register(username, email, password);
          else alert('Passwords do not match.');
        }}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity >
        <View></View>
      </TouchableOpacity> */}
    </ScrollView>
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
    height: 130,
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
