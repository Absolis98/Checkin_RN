import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
// import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import checkinDB from '../api/fakeDB';

// const dbConfig = {

//   projectId: 'checkin-b1252',
//   appId: '1:938450961498:android:f19d5a40b8b060038c4463',
//   apiKey: 'AIzaSyA2FYSNOpEAGeT9CRw9lrKQ9_EqRod8Z1c',

//   authDomain: 'your-auth-domain-b1234.firebaseapp.com',
//   databaseURL: 'https://your-database-name.firebaseio.com',
//   storageBucket: 'your-project-id-1234.appspot.com',
//   messagingSenderId: '12345-insert-yourse',
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(dbConfig);
// }

// export {firebase};

class dbConfig extends Component {
  state = {
    groups: [],
  };
  constructor(props) {
    super(props);
    this.subscriber = firestore()
      .collection('groups')
      .onSnapshot((docs) => {
        let groups = [];
        docs.forEach((doc) => {
          groups.push(doc.data());
        });
        this.setState({groups});
      });
  }

  addRandomMember = async () => {
    let name = Math.random().toString(36).substring(7);
    firestore().collection('groups').add({
      name,
    });
  };

  render() {
    return (
      <View>
        <Button title="Add Random Owner" onPress={this.addRandomMember} />
        {this.state.groups.map((groupMem, index) => (
          <View key={index}>
            <Text>{groupMem.name}</Text>
          </View>
        ))}
      </View>
    );
  }
}

export default dbConfig;

// firestore()
//       .collection('groups')
//       .get()
//       .then((querySnapshot) => {
//         console.log('Total in group: ', querySnapshot.size);
//         querySnapshot.forEach((documentSnapshot) => {
//           console.log(
//             'Group names: ',
//             documentSnapshot.id,
//             documentSnapshot.data(),
//           );
//         });
//       });getUser = async () => {
//     const userDocument = await firestore()
//       .collection('groups')
//       .doc('owners')
//       .get();
//     console.log(userDocument);
//   };

//   getPets = async () => {
//     const pets = await firestore()
//       .collection('groups')
//       .where('type', '==', 'Cat')
//       .get();
//     console.log(userDocument);
//   };
