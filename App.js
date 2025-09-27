import React, { useEffect, useState } from 'react';

import AppNavigator from './src/navigation/AppNavigator';

import LoadingScreen from './src/screens/LoadingScreen';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {auth} from './src/config/firebase';

import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return <LoadingScreen message="Initializing Data..." />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator isLoggedIn={!!user} />
    </GestureHandlerRootView>
  );
};

export default App;

