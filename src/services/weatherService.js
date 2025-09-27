import axios from 'axios';
import { OPENWEATHER_API_KEY } from '@env';

const DEFAULT_LAT = 6.9271; 
const DEFAULT_LON = 79.8612;

/*
  Get daily forecast (7–9 days)
  cannot get for 16 days because that feature has moved to the paid version
  this was sent by the confirmation email from the openweathermap : 
  Please, note that 16-days daily forecast and History API are not available for Free subscribers
*/
export const getDailyForecast = async (lat = DEFAULT_LAT, lon = DEFAULT_LON) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/3.0/onecall', {
      params: {
        lat,
        lon,
        exclude: 'current,minutely,hourly,alerts',
        units: 'metric',
        appid: OPENWEATHER_API_KEY,
      },
    });
    return response.data.daily; 
  } catch (error) {
    throw new Error('Unable to fetch daily forecast');
  }
};

// Get location name (reverse geocode using OpenWeatherMap One Call)
export const getLocationName = async (lat = DEFAULT_LAT, lon = DEFAULT_LON) => {
  try {
    const response = await axios.get('https://api.openweathermap.org/geo/1.0/reverse', {
      params: {
        lat,
        lon,
        limit: 1,
        appid: OPENWEATHER_API_KEY
      }
    });
    if (response.data && response.data.length > 0) {
      const city = response.data[0].name;
      const country = response.data[0].country;
      return `${city}, ${country}`;
    }
    return 'Unknown Location';
  } catch (error) {
    return 'Unknown Location';
  }
};

// Weather icon
export const getWeatherIconUrl = (icon) => {
  if (!icon) return null;
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};
