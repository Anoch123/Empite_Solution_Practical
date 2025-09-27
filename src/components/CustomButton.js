import React from 'react';

import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

import colors from '../constants/colors';

const CustomButton = ({ 
  title, 
  onPress, 
  loading, 
  backgroundColor = colors.primary, 
  textColor = colors.white, 
  icon = null
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor }]} 
      onPress={onPress} 
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
