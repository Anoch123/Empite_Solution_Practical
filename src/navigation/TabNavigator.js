import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

import WeatherScreen from '../screens/WeatherScreen';

import MapScreen from '../screens/MapScreen';

import ProfileScreen from '../screens/ProfileScreen';

import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Weather') iconName = focused ? 'cloud-outline' : 'cloud';
          else if (route.name === 'Nearby Restaurants') iconName = focused ? 'restaurant' : 'restaurant-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
      })}
    >
      <Tab.Screen name="Weather" component={WeatherScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Nearby Restaurants" component={MapScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
