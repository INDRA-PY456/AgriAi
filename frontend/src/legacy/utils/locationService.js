import { findNearestLocation, findLocation } from '../data/demoLocations.js';

/**
 * Demo implementation. Can be replaced with real geocoding APIs.
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearestLocation(position.coords.latitude, position.coords.longitude);
        resolve(nearest);
      },
      (error) => {
        reject(new Error("Unable to retrieve your location. Please check your permissions."));
      }
    );
  });
};

/**
 * Demo implementation. Can be replaced with real geocoding APIs.
 */
export const geocodeLocation = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(findLocation(query));
    }, 500);
  });
};

/**
 * Demo implementation. Can be replaced with real reverse geocoding APIs.
 */
export const reverseGeocode = (lat, lng) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(findNearestLocation(lat, lng));
    }, 300);
  });
};
