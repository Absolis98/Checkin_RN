import 'react-native-gesture-handler';
import React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';

import PetsScreen from '../screens/PetsScreen';
import CreatePetScreen from '../screens/CreatePetScreen';
import UpdatePetScreen from '../screens/UpdatePetScreen';

import GroupsScreen from '../screens/GroupsScreen';
import GroupsOverviewScreen from '../screens/GroupsOverviewScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import UpdateGroupScreen from '../screens/UpdateGroupScreen';

import OwnersScreen from '../screens/OwnersScreen';

import PetDashboardScreen from '../screens/PetDashboardScreen';
import CreatePetActionScreen from '../screens/CreatePetActionScreen';
import ActionsOverviewScreen from '../screens/ActionsOverviewScreen';
import EditPetActionScreen from '../screens/EditPetActionScreen';
import PetActionScreen from '../screens/PetActionScreen';

import Header from '../components/Header';

import SettingsScreen from '../screens/SettingsScreen';

const HomeStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const HomeTabs = createBottomTabNavigator();

const HomeStackScreen = ({navigation}) => (
  <HomeStack.Navigator
    screenOptions={{
      ...TransitionPresets.SlideFromRightIOS,
      // gestureEnabled: false,
      headerStyle: {
        backgroundColor: 'rgb(242,242,242)',
        shadowColor: 'transparent', // ios
        elevation: 0, // android
      },
      // headerTintColor: '#fff',
      headerTitleStyle: {
        fontSize: 27,
        fontWeight: 'bold',
      },
    }}
    headerMode="float">
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{
        title: 'Checkin',
      }}
      // options={({navigation}) => {
      //   return {
      //     header: () => (
      //       <SafeAreaView>
      //         <Header navigation={navigation} title="Checkin" />
      //       </SafeAreaView>
      //     ),
      //   };
      // }}
    />

    <HomeStack.Screen
      name="GroupsOverviewScreen"
      component={GroupsOverviewScreen}
      options={{
        title: 'Group Overview',
      }}
    />
    <HomeStack.Screen
      name="PetsScreen"
      component={PetsScreen}
      options={{
        title: 'Pets',
      }}
    />
    <HomeStack.Screen
      name="GroupsScreen"
      component={GroupsScreen}
      options={{
        title: 'Groups',
      }}
    />
    <HomeStack.Screen
      name="OwnersScreen"
      component={OwnersScreen}
      options={{
        title: 'Owners',
      }}
    />
    <HomeStack.Screen
      name="PetDashboardScreen"
      component={PetDashboardScreen}
      options={{
        title: 'Dashboard',
      }}
    />
    <HomeStack.Screen
      name="ActionsOverviewScreen"
      component={ActionsOverviewScreen}
    />

    <HomeStack.Screen
      name="CreatePetScreen"
      component={CreatePetScreen}
      options={{
        title: 'Create Pet',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    />

    <HomeStack.Screen
      name="CreatePetActionScreen"
      component={CreatePetActionScreen}
      options={{
        title: 'Create New Action',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    />

    <HomeStack.Screen
      name="UpdatePetScreen"
      component={UpdatePetScreen}
      options={{
        title: 'Update Info',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    />

    <HomeStack.Screen name="PetActionScreen" component={PetActionScreen} />

    <HomeStack.Screen
      name="EditPetActionScreen"
      component={EditPetActionScreen}
      options={{
        title: 'Update Action',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    />

    <HomeStack.Screen
      name="CreateGroupScreen"
      component={CreateGroupScreen}
      options={{
        title: 'Create Group',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    />
    <HomeStack.Screen
      name="UpdateGroupScreen"
      component={UpdateGroupScreen}
      options={{
        title: 'Update Group',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    />
  </HomeStack.Navigator>
);

const SettingsStackScreen = () => (
  <SettingsStack.Navigator
    screenOptions={{
      ...TransitionPresets.SlideFromRightIOS,
      gestureEnabled: false,
      headerStyle: {
        backgroundColor: 'rgb(242,242,242)',
        shadowColor: 'transparent', // ios
        elevation: 0, // android
      },
      // headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
    headerMode="float">
    <SettingsStack.Screen
      name="SettingsScreen"
      component={SettingsScreen}
      options={{
        title: 'Settings',
      }}
    />
  </SettingsStack.Navigator>
);

// make a stack screen for drawer

const AppStack = () => {
  return (
    <HomeTabs.Navigator
      screenOptions={({route}) => ({
        cardStyle: {backgroundColor: '#ffe3de'},
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HomeStackScreen') {
            iconName = focused ? 'home-sharp' : 'home-outline';
          } else if (route.name === 'SettingsStackScreen') {
            iconName = focused ? 'settings-sharp' : 'settings-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <HomeTabs.Screen
        name="HomeStackScreen"
        component={HomeStackScreen}
        options={{title: 'Home'}}
      />

      <HomeTabs.Screen
        name="SettingsStackScreen"
        component={SettingsStackScreen}
        options={{title: 'Settings'}}
      />
    </HomeTabs.Navigator>
  );
};

export default AppStack;
