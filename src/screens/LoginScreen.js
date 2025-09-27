import React, { useState } from 'react';

import { Text, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { validateEmail } from '../utils/validation';

import CustomTextInput from '../components/CustomTextInput';

import CustomButton from '../components/CustomButton';

import { signInWithFirebase, signInWithFacebook, signUpToEmpite } from '../services/firebaseService';

import Icon from 'react-native-vector-icons/MaterialIcons';

import colors from '../constants/colors';

import strings from '../constants/strings';

import assets from '../constants/assets';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firebaseLoading, setFirebaseLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !validateEmail(email)) return Alert.alert('Invalid Email', 'Please enter a valid email');
    if (!password) return Alert.alert('Password Required', 'Please enter your password');

    setFirebaseLoading(true);
    try { await signInWithFirebase(email, password); }
    catch (error) { Alert.alert('Firebase Login Failed', error.message); }
    finally { setFirebaseLoading(false); }
  };

  const handleFacebookLogin = async () => {
    setFacebookLoading(true);
    try { await signInWithFacebook(); }
    catch (error) { Alert.alert('Facebook Login Failed', error.message); }
    finally { setFacebookLoading(false); }
  };

  const handleRegister = async () => {
    if (!email || !validateEmail(email)) return Alert.alert('Invalid Email', 'Please enter a valid email');
    if (!password) return Alert.alert('Password Required', 'Please enter your password');
    
    setRegistrationLoading(true);
    try { await signUpToEmpite(email, password); }
    catch (error) { Alert.alert('Sign Up Failed', error.message); }
    finally { setRegistrationLoading(false); }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcomeTitle}>{strings.welcomeTitle}</Text>
        <Text style={styles.loginTitle}>{strings.loginTitle}</Text>
        <CustomTextInput placeholder={strings.emailPlaceholder} value={email} onChangeText={setEmail} />
        <CustomTextInput placeholder={strings.passwordPlaceholder} value={password} onChangeText={setPassword} secureTextEntry />
        <CustomButton
          title={strings.FirebaseLoginButton}
          onPress={handleLogin}
          loading={firebaseLoading}
          backgroundColor={colors.primary}
          textColor={colors.white}
          icon={null}
        />
        <CustomButton
          title={strings.facebookLoginButton}
          onPress={handleFacebookLogin}
          loading={facebookLoading}
          backgroundColor={colors.primary}
          textColor={colors.white}
          icon={<Icon name="facebook" size={25} color={colors.white} />}
        />
        <CustomButton
          title={strings.registerButton}
          onPress={handleRegister}
          loading={registrationLoading}
          backgroundColor={colors.danger}
          textColor={colors.white}
          icon={null}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  welcomeTitle: { fontSize: 24, marginBottom: 1, textAlign: 'center' },
  loginTitle: { fontSize: 16, marginBottom: 20, textAlign: 'center', color: colors.secondary },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 30 },
});

export default LoginScreen;
