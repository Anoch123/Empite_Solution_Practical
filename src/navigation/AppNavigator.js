import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Button } from 'react-native';

import LoginScreen from '../screens/LoginScreen';

import { logoutFirebase } from '../services/firebaseService';

import TabNavigator from './TabNavigator';

import colors from '../constants/colors';

import strings from '../constants/strings';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ isLoggedIn }) => {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen 
            name="Home" 
            component={TabNavigator} 
            options={({ navigation }) => ({
              title: 'Empite Solutions',
              headerRight: () => (
                <Button 
                  title={strings.logout} 
                  onPress={() => logoutFirebase(navigation)} 
                  color={colors.danger}
                />
              ),
            })}
          />
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
