import React from 'react';
import {AuthProvider} from '../context/AuthContext';
import {UserProvider} from '../context/UserContext';
import {GroupProvider} from '../context/GroupContext';
import {PetProvider} from '../context/PetContext';
import Routes from './Routes';

const Providers = () => {
  return (
    <PetProvider>
      <GroupProvider>
        <UserProvider>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </UserProvider>
      </GroupProvider>
    </PetProvider>
  );
};

export default Providers;
