import React, { useEffect, useState } from 'react';

import { View, StyleSheet, ActivityIndicator, Text, Button, Linking } from 'react-native';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';

import LocationPermissionService from '../services/LocationPermissionService';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('');

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const region = { latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 };
          setLocation(region);
          resolve(region);
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  const checkAndFetchLocation = async () => {
    setLoading(true);
    try {
      const granted = await LocationPermissionService.handleLocationPermission();
      const status = await LocationPermissionService.checkLocationPermission();
      setPermissionStatus(LocationPermissionService.getPermissionStatusMessage(status));

      if (granted) {
        await getCurrentLocation();
      } else {
        setLocation(null);
      }
    } catch (error) {
      setPermissionStatus('Location service is not enabled in device.');
      setLocation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAndFetchLocation();
  }, []);

  const openAppSettings = () => {
    Linking.openSettings();
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  if (!location) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          {permissionStatus || 'Location not available.'}
        </Text>
        {permissionStatus?.includes('not granted') && (
          <Button title="Open App Settings" onPress={openAppSettings} />
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
      >
        <Marker coordinate={location} title="You are here" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
});

export default MapScreen;
