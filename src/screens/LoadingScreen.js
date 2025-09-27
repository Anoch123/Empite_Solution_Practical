import React, { memo } from 'react';

import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import PropTypes from 'prop-types';

import colors from '../constants/colors';

const LoadingScreen = ({ message = 'Loading...', size = 'large', color = colors.primary }) => {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel={message}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: colors.text || '#000',
  },
});

export default memo(LoadingScreen);
