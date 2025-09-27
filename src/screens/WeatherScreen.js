import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Button,
  Linking
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';

import { getDailyForecast, getWeatherIconUrl, getLocationName } from '../services/weatherService';

import LocationPermissionService from '../services/LocationPermissionService';

const WeatherScreen = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState('');

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
          resolve({ latitude, longitude });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  // Fetch weather data
  const checkAndFetch = async () => {
    setLoading(true);
    try {
      const granted = await LocationPermissionService.handleLocationPermission();
      const status = await LocationPermissionService.checkLocationPermission();
      setPermissionStatus(LocationPermissionService.getPermissionStatusMessage(status));

      if (granted) {
        const location = await getCurrentLocation();
        const dailyData = await getDailyForecast(location.latitude, location.longitude);
        const locName = await getLocationName(location.latitude, location.longitude);

        setLocationName(locName);
        setWeather(dailyData || []);
      } else {
        setWeather([]);
        setCoordinates({ latitude: null, longitude: null });
        setLocationName('');
        setPermissionStatus('Location permission not granted. Please enable it in app settings.');
      }
    } catch (error) {
      setPermissionStatus('Location service is not enabled in device.');
      setWeather([]);
      setCoordinates({ latitude: null, longitude: null });
      setLocationName('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAndFetch();
  }, []);

  const openAppSettings = () => Linking.openSettings();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const renderItem = ({ item }) => {
    const tempDay = item.temp.day.toFixed(1);
    const tempMin = item.temp.min.toFixed(1);
    const tempMax = item.temp.max.toFixed(1);
    const feelsLike = item.feels_like.day.toFixed(1);
    const pop = item.pop ? Math.round(item.pop * 100) : 0;
    const windDeg = item.wind_deg || 0;

    const date = new Date(item.dt * 1000);
    const formattedDate = date.toLocaleDateString('en-CA', { weekday: 'short', day: 'numeric', month: 'short' });

    return (
      <View style={styles.card}>
        {item.weather?.[0]?.icon && (
          <Image source={{ uri: getWeatherIconUrl(item.weather[0].icon) }} style={styles.icon} />
        )}
        <View style={styles.details}>
          <Text style={styles.dateTime}>{formattedDate}</Text>
          <Text style={styles.temp}>
            {tempDay}°C (Min: {tempMin}°C / Max: {tempMax}°C) | Feels like {feelsLike}°C
          </Text>
          <Text style={styles.desc}>{item.weather?.[0]?.description || 'No description'}</Text>
          <Text style={styles.info}>
            🌧 Rain: {pop}% | 💨 Wind: {item.wind_speed} m/s{' '}
            <Text style={{ transform: [{ rotate: `${windDeg}deg` }] }}>⬆</Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {coordinates.latitude && coordinates.longitude && (
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>Current Location: {locationName}</Text>
        </View>
      )}

      {permissionStatus ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{permissionStatus}</Text>
          {permissionStatus.includes('not granted') && (
            <Button title="Open App Settings" onPress={openAppSettings} />
          )}
        </View>
      ) : null}

      <FlatList
        data={weather}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  statusContainer: { flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, },
  statusText: { fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333', },
  coordinatesContainer: { marginBottom: 10, padding: 10, backgroundColor: '#e8f5e8', borderRadius: 8 },
  coordinatesText: { fontSize: 14, fontWeight: 'bold', color: '#2d5a2d' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#e0f7fa',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  icon: { width: 50, height: 50, marginRight: 10 },
  details: { flex: 1 },
  dateTime: { fontWeight: 'bold', marginBottom: 2 },
  temp: { fontSize: 16, marginBottom: 2 },
  desc: { fontStyle: 'italic', marginBottom: 2 },
  info: { fontSize: 12, color: '#555' },
});

export default WeatherScreen;
