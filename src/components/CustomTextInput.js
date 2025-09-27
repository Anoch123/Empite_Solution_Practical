import React from 'react';

import { TextInput, StyleSheet } from 'react-native';

import colors from '../constants/colors';

const CustomTextInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={colors.secondary}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    color: colors.black,
  },
});

export default CustomTextInput;
