import React, { useEffect, useState } from 'react';

import { View, Text, StyleSheet, Image } from 'react-native';

import colors from '../constants/colors';

import assets from '../constants/assets';

import { auth } from '../config/firebase';

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: 'No Name',
    email: 'No Email',
    photoURL: assets.logo,
  });
  const [loginType, setLoginType] = useState('Email/Password');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Determine login typ
      let type = 'Email/Password';
      currentUser.providerData.forEach(provider => {
        if (provider.providerId === 'facebook.com') type = 'Facebook';
      });
      setLoginType(type);

      // Set user details with safe fallbacks
      const name = currentUser.displayName?.trim() || 'No Name';
      const email = currentUser.email || 'No Email';
      const photoURL = currentUser.photoURL?.trim() || assets.logo;

      setUser({ name, email, photoURL });
    }
  }, []);

  // Render initials if no photo
  const renderAvatar = () => {
    if (typeof user.photoURL === 'string' && user.photoURL.startsWith('http')) {
      return <Image source={{ uri: user.photoURL }} style={styles.avatar} resizeMode="cover" />;
    }
    // Local asset or fallback initials
    if (user.photoURL) {
      return <Image source={user.photoURL} style={styles.avatar} resizeMode="cover" />;
    }
    // Fallback: initials circle
    const initials = user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    return (
      <View style={[styles.avatar, styles.initialsContainer]}>
        <Text style={styles.initialsText}>{initials}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderAvatar()}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.loginType}>Login via: {loginType}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
  initialsContainer: { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  initialsText: { color: colors.white, fontSize: 40, fontWeight: 'bold' },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 16, color: colors.secondary, marginBottom: 5 },
  loginType: { fontSize: 16, color: colors.secondary, marginBottom: 20 },
});

export default ProfileScreen;
