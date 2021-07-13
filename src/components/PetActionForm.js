import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RadioButtonGroup from '../components/RadioButtonGroup';

// must be updated. TextInput cannot allow '.' as it messess with firestore

const PetActionForm = ({onSubmit, initialState, crudType, deleteFunc}) => {
  const [name, setName] = useState(initialState?.name);
  const [frequency, setFrequency] = useState(initialState?.frequency);
  const [description, setDescription] = useState(initialState?.description);
  const [freqNum, setFreqNum] = useState(
    initialState?.need ? initialState.need : 3,
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: 'center',
      }}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          autoCorrect={false}
          value={name}
          onChangeText={(newValue) => setName(newValue)}
        />
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            autoCorrect={false}
            value={description}
            onChangeText={(newValue) => setDescription(newValue)}
          />
        </View>
        <Text style={styles.inputTitle}>Frequency:</Text>
        <RadioButtonGroup
          // add a "for ever x" option
          buttonNames={['daily', 'weekly', 'monthly', 'yearly']}
          changeValue={(frequency) => setFrequency(frequency)}
          initialState={initialState?.frequency}
          hiddenUITrigger={['daily', 'weekly', 'monthly', 'yearly']}
          hiddenUI={
            frequency === 'daily' ? (
              <View style={{alignItems: 'center'}}>
                {/* <Text>Daily</Text> */}
                <Text style={{marginVertical: 10, fontSize: 20}}>
                  How many times per day?
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    style={{
                      height: 47,
                      backgroundColor: 'skyblue',
                      padding: 14,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                    onPress={() => {
                      if (freqNum !== 0) setFreqNum(freqNum - 1);
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={{
                      height: 47,
                      width: 35,
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.2)',
                      padding: 10,
                    }}
                    value={freqNum.toString()}
                    onChangeText={(newValue) => setFreqNum(newValue)}
                  />
                  <TouchableOpacity
                    style={{
                      height: 47,
                      backgroundColor: 'skyblue',
                      padding: 14,
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                    onPress={() => {
                      if (freqNum !== 15) setFreqNum(freqNum + 1);
                    }}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* <Text>At what time?</Text> */}
              </View>
            ) : frequency === 'weekly' ? (
              <View>
                <Text>weekly input form</Text>
                <Text>How many times, weekday?, what time</Text>
                <View style={{alignItems: 'center'}}>
                  {/* <Text>Daily</Text> */}
                  <Text style={{marginVertical: 10, fontSize: 20}}>
                    How many times per day?
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{
                        height: 47,
                        backgroundColor: 'skyblue',
                        padding: 14,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                      }}
                      onPress={() => {
                        if (freqNum !== 0) setFreqNum(freqNum - 1);
                      }}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        height: 47,
                        width: 35,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        padding: 10,
                      }}
                      value={freqNum.toString()}
                      onChangeText={(newValue) => setFreqNum(newValue)}
                    />
                    <TouchableOpacity
                      style={{
                        height: 47,
                        backgroundColor: 'skyblue',
                        padding: 14,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                      }}
                      onPress={() => {
                        if (freqNum !== 15) setFreqNum(freqNum + 1);
                      }}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* <Text>At what time?</Text> */}
                </View>
              </View>
            ) : frequency === 'monthly' ? (
              <View>
                <Text>montly input form</Text>
                <Text>How many times, which days, what time</Text>
                <View style={{alignItems: 'center'}}>
                  {/* <Text>Daily</Text> */}
                  <Text style={{marginVertical: 10, fontSize: 20}}>
                    How many times per day?
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{
                        height: 47,
                        backgroundColor: 'skyblue',
                        padding: 14,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                      }}
                      onPress={() => {
                        if (freqNum !== 0) setFreqNum(freqNum - 1);
                      }}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        height: 47,
                        width: 35,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        padding: 10,
                      }}
                      value={freqNum.toString()}
                      onChangeText={(newValue) => setFreqNum(newValue)}
                    />
                    <TouchableOpacity
                      style={{
                        height: 47,
                        backgroundColor: 'skyblue',
                        padding: 14,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                      }}
                      onPress={() => {
                        if (freqNum !== 15) setFreqNum(freqNum + 1);
                      }}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* <Text>At what time?</Text> */}
                </View>
              </View>
            ) : frequency === 'yearly' ? (
              <View>
                <Text>yearly input form</Text>
                <Text>How many times, which month and day, what time</Text>
                <View style={{alignItems: 'center'}}>
                  {/* <Text>Daily</Text> */}
                  <Text style={{marginVertical: 10, fontSize: 20}}>
                    How many times per day?
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={{
                        height: 47,
                        backgroundColor: 'skyblue',
                        padding: 14,
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5,
                      }}
                      onPress={() => {
                        if (freqNum !== 0) setFreqNum(freqNum - 1);
                      }}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>-</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        height: 47,
                        width: 35,
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        padding: 10,
                      }}
                      value={freqNum.toString()}
                      onChangeText={(newValue) => setFreqNum(newValue)}
                    />
                    <TouchableOpacity
                      style={{
                        height: 47,
                        backgroundColor: 'skyblue',
                        padding: 14,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 5,
                      }}
                      onPress={() => {
                        if (freqNum !== 15) setFreqNum(freqNum + 1);
                      }}>
                      <Text style={{fontWeight: 'bold', fontSize: 16}}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* <Text>At what time?</Text> */}
                </View>
              </View>
            ) : null
          }
        />
      </View>

      <TouchableOpacity
        style={styles.createBtn}
        onPress={() => {
          let updatedAction = {};
          initialState?.name !== undefined
            ? (updatedAction = {...initialState})
            : null;
          updatedAction.name = name;
          updatedAction.description = description;
          updatedAction.frequency = frequency;
          initialState?.need !== undefined
            ? initialState.need !== freqNum
              ? initialState.done > freqNum
                ? (updatedAction.done = freqNum)
                : (updatedAction.need = freqNum)
              : (updatedAction.need = freqNum)
            : (updatedAction.need = freqNum);
          updatedAction.need = freqNum;
          console.log(updatedAction);
          onSubmit(updatedAction);
        }}>
        <Text>{crudType} Task</Text>
      </TouchableOpacity>
      {deleteFunc !== undefined ? (
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteFunc()}>
          <Text style={{color: 'white'}}>Delete Action</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    margin: 10,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    // width: '75%',
    height: 40,
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
    // marginRight: '75%',
  },
  createBtn: {
    height: 40,
    width: '70%',
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'pink',
    alignItems: 'center',
  },
  deleteBtn: {
    height: 40,
    width: '70%',
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'rgb(220,53,69)',
    alignItems: 'center',
  },
});

export default PetActionForm;

// <RadioButtonGroup
//           // add a "for ever x" option
//           buttonNames={['Daily', 'Days', 'Week Days']}
//           changeValue={(frequency) => setFrequency(frequency)}
//           initialState={initialState?.frequency}
//           hiddenUITrigger={['Daily', 'Days', 'Week Days']}
//           hiddenUI={
//             frequency === 'Daily' ? (
//               <View style={{alignItems: 'center'}}>
//                 {/* <Text>Daily</Text> */}
//                 <Text style={{marginVertical: 10, fontSize: 20}}>
//                   Repeat action how many times per day?
//                 </Text>
//                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                   <TouchableOpacity
//                     style={{
//                       height: 47,
//                       backgroundColor: 'skyblue',
//                       padding: 14,
//                       borderTopLeftRadius: 5,
//                       borderBottomLeftRadius: 5,
//                     }}
//                     onPress={() => {
//                       if (freqNum !== 0) setFreqNum(freqNum - 1);
//                     }}>
//                     <Text style={{fontWeight: 'bold', fontSize: 16}}>-</Text>
//                   </TouchableOpacity>
//                   <TextInput
//                     style={{
//                       height: 47,
//                       width: 35,
//                       borderWidth: 1,
//                       borderColor: 'rgba(0,0,0,0.2)',
//                       padding: 10,
//                     }}
//                     value={freqNum.toString()}
//                     onChangeText={(newValue) => setFreqNum(newValue)}
//                   />
//                   <TouchableOpacity
//                     style={{
//                       height: 47,
//                       backgroundColor: 'skyblue',
//                       padding: 14,
//                       borderTopRightRadius: 5,
//                       borderBottomRightRadius: 5,
//                     }}
//                     onPress={() => {
//                       if (freqNum !== 15) setFreqNum(freqNum + 1);
//                     }}>
//                     <Text style={{fontWeight: 'bold', fontSize: 16}}>+</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* <Text>At what time?</Text> */}
//               </View>
//             ) : frequency === 'Days' ? (
//               <View>
//                 <Text>weekly input form</Text>
//                 <Text>Repeat action after how many days?</Text>
//                 <View style={{alignItems: 'center'}}>
//                   {/* <Text>Daily</Text> */}
//                   <Text style={{marginVertical: 10, fontSize: 20}}>
//                     Repeat action after how many days?
//                   </Text>
//                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                     <TouchableOpacity
//                       style={{
//                         height: 47,
//                         backgroundColor: 'skyblue',
//                         padding: 14,
//                         borderTopLeftRadius: 5,
//                         borderBottomLeftRadius: 5,
//                       }}
//                       onPress={() => {
//                         if (freqNum !== 0) setFreqNum(freqNum - 1);
//                       }}>
//                       <Text style={{fontWeight: 'bold', fontSize: 16}}>-</Text>
//                     </TouchableOpacity>
//                     <TextInput
//                       style={{
//                         height: 47,
//                         width: 35,
//                         borderWidth: 1,
//                         borderColor: 'rgba(0,0,0,0.2)',
//                         padding: 10,
//                       }}
//                       value={freqNum.toString()}
//                       onChangeText={(newValue) => setFreqNum(newValue)}
//                     />
//                     <TouchableOpacity
//                       style={{
//                         height: 47,
//                         backgroundColor: 'skyblue',
//                         padding: 14,
//                         borderTopRightRadius: 5,
//                         borderBottomRightRadius: 5,
//                       }}
//                       onPress={() => {
//                         if (freqNum !== 15) setFreqNum(freqNum + 1);
//                       }}>
//                       <Text style={{fontWeight: 'bold', fontSize: 16}}>+</Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* <Text>At what time?</Text> */}
//                 </View>
//               </View>
//             ) : frequency === 'Week Days' ? (
//               <View>
//                 <Text>montly input form</Text>
//                 <Text>How many times, which days, what time</Text>
//                 <View style={{alignItems: 'center'}}>
//                   {/* <Text>Daily</Text> */}
//                   <Text style={{marginVertical: 10, fontSize: 20}}>
//                     Repeat action on which days of the week?
//                   </Text>
//                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
//                     <TouchableOpacity
//                       style={{
//                         height: 47,
//                         backgroundColor: 'skyblue',
//                         padding: 14,
//                         borderTopLeftRadius: 5,
//                         borderBottomLeftRadius: 5,
//                       }}
//                       onPress={() => {
//                         if (freqNum !== 0) setFreqNum(freqNum - 1);
//                       }}>
//                       <Text style={{fontWeight: 'bold', fontSize: 16}}>-</Text>
//                     </TouchableOpacity>
//                     <TextInput
//                       style={{
//                         height: 47,
//                         width: 35,
//                         borderWidth: 1,
//                         borderColor: 'rgba(0,0,0,0.2)',
//                         padding: 10,
//                       }}
//                       value={freqNum.toString()}
//                       onChangeText={(newValue) => setFreqNum(newValue)}
//                     />
//                     <TouchableOpacity
//                       style={{
//                         height: 47,
//                         backgroundColor: 'skyblue',
//                         padding: 14,
//                         borderTopRightRadius: 5,
//                         borderBottomRightRadius: 5,
//                       }}
//                       onPress={() => {
//                         if (freqNum !== 15) setFreqNum(freqNum + 1);
//                       }}>
//                       <Text style={{fontWeight: 'bold', fontSize: 16}}>+</Text>
//                     </TouchableOpacity>
//                   </View>

//                   {/* <Text>At what time?</Text> */}
//                 </View>
//               </View>
//             ) : null
//           }
//         />
