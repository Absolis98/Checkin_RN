import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../context/AuthContext';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Routes = () => {
  const {authUser, setUser, logout} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (authUser) => {
    setUser(authUser);
    // console.log(user.uid);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {authUser ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Routes;
