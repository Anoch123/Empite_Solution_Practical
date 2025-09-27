// src/services/LocationPermissionService.js
import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

class LocationPermissionService {
  static PERMISSION_STATUS = {
    GRANTED: 'granted',
    DENIED: 'denied',
    NEVER_ASK_AGAIN: 'never_ask_again',
    UNKNOWN: 'unknown',
    NOT_REQUIRED: 'not_required' // For iOS or when permission is not needed
  };

  /**
   * Check if location permission is granted
   * @returns {Promise<string>} Permission status
   */
  static async checkLocationPermission() {
    if (Platform.OS !== 'android') {
      return this.PERMISSION_STATUS.NOT_REQUIRED;
    }

    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      return granted ? this.PERMISSION_STATUS.GRANTED : this.PERMISSION_STATUS.DENIED;
    } catch (error) {
      return this.PERMISSION_STATUS.UNKNOWN;
    }
  }

  /**
   * Request location permission with custom messaging
   * @param {Object} options - Permission request options
   * @returns {Promise<string>} Permission status after request
   */
  static async requestLocationPermission(options = {}) {
    if (Platform.OS !== 'android') {
      return this.PERMISSION_STATUS.NOT_REQUIRED;
    }

    const defaultOptions = {
      title: 'Location Permission Required',
      message: 'This app needs access to your location to provide location-based services.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
      showSettingsAlert: true,
    };

    const permissionOptions = { ...defaultOptions, ...options };

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: permissionOptions.title,
          message: permissionOptions.message,
          buttonNeutral: permissionOptions.buttonNeutral,
          buttonNegative: permissionOptions.buttonNegative,
          buttonPositive: permissionOptions.buttonPositive,
        }
      );

      switch (result) {
        case PermissionsAndroid.RESULTS.GRANTED:
          return this.PERMISSION_STATUS.GRANTED;
          
        case PermissionsAndroid.RESULTS.DENIED:
          return this.PERMISSION_STATUS.DENIED;
          
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          if (permissionOptions.showSettingsAlert) {
            this.showSettingsAlert();
          }
          return this.PERMISSION_STATUS.NEVER_ASK_AGAIN;
          
        default:
          return this.PERMISSION_STATUS.DENIED;
      }
    } catch (error) {
      return this.PERMISSION_STATUS.UNKNOWN;
    }
  }

  /**
   * Request multiple location-related permissions
   * @returns {Promise<Object>} Object with permission statuses
   */
  static async requestAllLocationPermissions() {
    if (Platform.OS !== 'android') {
      return {
        fineLocation: this.PERMISSION_STATUS.NOT_REQUIRED,
        coarseLocation: this.PERMISSION_STATUS.NOT_REQUIRED,
      };
    }

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      return {
        fineLocation: this.mapPermissionResult(results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]),
        coarseLocation: this.mapPermissionResult(results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]),
      };
    } catch (error) {
      return {
        fineLocation: this.PERMISSION_STATUS.UNKNOWN,
        coarseLocation: this.PERMISSION_STATUS.UNKNOWN,
      };
    }
  }

  /**
   * Show alert to direct user to app settings
   */
  static showSettingsAlert() {
    Alert.alert(
      'Permission Required',
      'Location permission has been permanently denied. Please enable it in app settings to use location features.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings().catch(() => {
              Alert.alert('Error', 'Unable to open settings');
            });
          },
        },
      ]
    );
  }

  /**
   * Handle permission request with user-friendly flow
   * @param {Object} options - Options for permission handling
   * @returns {Promise<boolean>} Whether permission was granted
   */
  static async handleLocationPermission(options = {}) {
    try {
      // First check current permission status
      const currentStatus = await this.checkLocationPermission();
      
      if (currentStatus === this.PERMISSION_STATUS.GRANTED) {
        return true;
      }

      if (currentStatus === this.PERMISSION_STATUS.NOT_REQUIRED) {
        return true;
      }

      // Request permission
      const result = await this.requestLocationPermission(options.requestOptions);
      
      return result === this.PERMISSION_STATUS.GRANTED;
    } catch (error) {
      return false;
    }
  }

  /**
   * Show permission rationale dialog
   * @param {Object} options - Rationale options
   */
  static showPermissionRationale(options = {}) {
    return new Promise((resolve) => {
      const defaultOptions = {
        title: 'Location Access Needed',
        message: 'This app needs location access to provide you with location-based features and services.',
        buttonText: 'Continue',
      };

      const rationaleOptions = { ...defaultOptions, ...options };

      Alert.alert(
        rationaleOptions.title,
        rationaleOptions.message,
        [
          {
            text: rationaleOptions.buttonText,
            onPress: () => resolve(),
          },
        ]
      );
    });
  }

  /**
   * Map Android permission result to our status constants
   * @param {string} result - Android permission result
   * @returns {string} Our permission status
   */
  static mapPermissionResult(result) {
    switch (result) {
      case PermissionsAndroid.RESULTS.GRANTED:
        return this.PERMISSION_STATUS.GRANTED;
      case PermissionsAndroid.RESULTS.DENIED:
        return this.PERMISSION_STATUS.DENIED;
      case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
        return this.PERMISSION_STATUS.NEVER_ASK_AGAIN;
      default:
        return this.PERMISSION_STATUS.UNKNOWN;
    }
  }

  /**
   * Get user-friendly permission status message
   * @param {string} status - Permission status
   * @returns {string} User-friendly message
   */
  static getPermissionStatusMessage(status) {
    switch (status) {
      case this.PERMISSION_STATUS.GRANTED:
        return 'Location permission is granted';
      case this.PERMISSION_STATUS.DENIED:
        return 'Location permission is denied';
      case this.PERMISSION_STATUS.NEVER_ASK_AGAIN:
        return 'Location permission is permanently denied. Please enable in settings.';
      case this.PERMISSION_STATUS.NOT_REQUIRED:
        return 'Location permission is not required on this platform';
      case this.PERMISSION_STATUS.UNKNOWN:
        return 'Location permission status is unknown';
      default:
        return 'Unknown permission status';
    }
  }
}

export default LocationPermissionService;