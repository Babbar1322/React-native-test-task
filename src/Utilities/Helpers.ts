import dayjs from 'dayjs';
import { PermissionsAndroid, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import IMAGES from '../Assets/Images';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as FileSystem from 'react-native-fs';
import { decode } from 'base64-arraybuffer';
import React from 'react';
import {
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';
import COLORS from './Colors';

export const showToast = (
  type: 'success' | 'error' | 'info' | 'warning',
  title: string,
  meessage?: string,
) => {
  switch (type) {
    case 'success':
      Toast.show({
        type: 'success',
        text1: title,
        text2: meessage,
      });
      break;
    case 'error':
      Toast.show({
        type: 'error',
        text1: title,
        text2: meessage,
      });
      break;
    case 'info':
      Toast.show({
        type: 'info',
        text1: title,
        text2: meessage,
      });
      break;
    case 'warning':
      Toast.show({
        type: 'warning',
        text1: title,
        text2: meessage,
      });
      break;
    default:
      break;
  }
};

export const showInAppNotification = (
  title: string,
  body: string,
  icon?: any, // Pass a require('./path') here
) => {
  Toast.show({
    type: 'inAppNotification',
    text1: title,
    text2: body,
    topOffset: 60,
    visibilityTime: 6000,
    props: { icon }, // Passing custom icon to the config
  });
};

export const getRandomColor = () => {
  // Maximum value to ensure the color isn't too light (0-255 scale)
  const maxValue = 128; // Adjust this value to make colors darker or lighter, but keep it below 255/2 for readability

  let color = '#';
  for (let i = 0; i < 3; i++) {
    // We only need 3 components (RGB)
    // Generate a random number from 0 to maxValue
    let component = Math.floor(Math.random() * (maxValue + 1)).toString(16);
    // Ensure the component is two digits
    color += component.length === 1 ? '0' + component : component;
  }
  return color;
};

export const convertStringToDate = (dateString: string) => {
  // The format "Do MMM YYYY" matches "20th Mar 2025"
  const date = dayjs(dateString, 'Do MMM YYYY');

  if (date.isValid()) {
    // Convert to Date object if needed
    return date.toDate();
  } else {
    console.error('Invalid date string provided:', dateString);
    return null; // or throw an error, or return a default date
  }
};

// Function to calculate distance between two coordinates using Haversine formula
export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const hasAndroidPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }

  const getCheckPermissionPromise = async (): Promise<boolean> => {
    if (Number(Platform.Version) >= 33) {
      return Promise.all([
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ),
        PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ),
      ]).then(
        ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
          hasReadMediaImagesPermission && hasReadMediaVideoPermission,
      );
    } else {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  };

  const hasPermission = await getCheckPermissionPromise();
  if (hasPermission) {
    return true;
  }

  const getRequestPermissionPromise = (): Promise<boolean> => {
    if (Number(Platform.Version) >= 33) {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]).then(
        (statuses) =>
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
            PermissionsAndroid.RESULTS.GRANTED,
      );
    } else {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
    }
  };

  return await getRequestPermissionPromise();
};

export const showCustomToast = (
  type: 'success' | 'error' | 'info',
  message: string,
) => {
  Toast.show({
    type: 'customToast',
    text1: message,
    props: { type },
  });
};

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // difference in seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hr${
      Math.floor(diff / 3600) > 1 ? 's' : ''
    } ago`;
  if (diff < 2592000)
    return `${Math.floor(diff / 86400)} day${
      Math.floor(diff / 86400) > 1 ? 's' : ''
    } ago`;
  if (diff < 31536000)
    return `${Math.floor(diff / 2592000)} month${
      Math.floor(diff / 2592000) > 1 ? 's' : ''
    } ago`;
  return `${Math.floor(diff / 31536000)} year${
    Math.floor(diff / 31536000) > 1 ? 's' : ''
  } ago`;
};

export const calculateMaxDistance = (
  latitudeDelta: number,
  latitude: number,
): number => {
  // Approximate conversion: 1 degree of latitude ≈ 111 km
  const latDistance = latitudeDelta * 111;

  // Longitude conversion depends on latitude (due to Earth's curvature)
  const longitudeConversionFactor = Math.cos((latitude * Math.PI) / 180);
  const lonDistance = latitudeDelta * 111 * longitudeConversionFactor;

  // Use the larger of the two to cover the visible map area
  const distance = Math.max(latDistance, lonDistance);

  // Set reasonable bounds for maxDistance (e.g., 1 km to 100 km)
  return Math.min(Math.max(distance, 1), 100); // Min 1 km, max 100 km
};

export const calculateAge = (dob?: string): string => {
  if (!dob) return 'Not specified';
  try {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    if (isNaN(birthDate.getTime())) return 'Not specified';
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return `${age}`;
  } catch (error) {
    return 'Not specified';
  }
};

export const getFullImageUrl = (subPath: string) => {
  if (subPath && subPath.includes('https://')) {
    return subPath;
  }
  const path = `https://baccvs-bucket.s3.eu-north-1.amazonaws.com/${subPath}`;
  return path;
};

/**
 * GDPR/EU Privacy: Obfuscates exact coordinates to an approximate location
 * Rounds coordinates to 3 decimal places (~111 meters accuracy per degree)
 * This hides users' exact locations while still showing approximate area
 * @param latitude - Original latitude
 * @param longitude - Original longitude
 * @param precision - Number of decimal places (default: 3, ~111m accuracy)
 * @returns Obfuscated coordinates
 */
export const obfuscateCoordinates = (
  latitude: number,
  longitude: number,
  precision: number = 3,
) => {
  const factor = Math.pow(10, precision);
  return {
    latitude: Math.round(latitude * factor) / factor,
    longitude: Math.round(longitude * factor) / factor,
  };
};

/**
 * Adds random noise to coordinates for extra privacy (optional)
 * Shifts location by up to ~500m randomly
 * @param latitude - Original latitude
 * @param longitude - Original longitude
 * @returns Noisy coordinates
 */
export const addLocationNoise = (
  latitude: number,
  longitude: number,
  noiseRadiusKm: number = 0.5,
) => {
  // Convert radius from km to degrees (approximately)
  const noiseInDegrees = noiseRadiusKm / 111;

  // Random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * noiseInDegrees;

  return {
    latitude: latitude + distance * Math.cos(angle),
    longitude: longitude + distance * Math.sin(angle),
  };
};

/**
 * GDPR-compliant location handler: obfuscates + adds noise
 * Use this for all user locations shown on map
 */
export const getPrivacyCompliantLocation = (
  latitude: number,
  longitude: number,
  options: { obfuscate?: boolean; addNoise?: boolean; precision?: number } = {},
) => {
  const { obfuscate = true, addNoise = true, precision = 3 } = options;

  let lat = latitude;
  let lon = longitude;

  // Step 1: Obfuscate to grid
  if (obfuscate) {
    const obfuscated = obfuscateCoordinates(lat, lon, precision);
    lat = obfuscated.latitude;
    lon = obfuscated.longitude;
  }

  // Step 2: Add random noise for extra privacy
  if (addNoise) {
    const noisy = addLocationNoise(lat, lon, 0.3);
    lat = noisy.latitude;
    lon = noisy.longitude;
  }

  return { latitude: lat, longitude: lon };
};

/**
 * Snap user location to nearest neighborhood center for privacy
 * Common major neighborhoods/areas are predefined
 * User markers will appear at neighborhood center, not exact location
 * @param latitude - User's actual latitude
 * @param longitude - User's actual longitude
 * @returns Nearest neighborhood center coordinates
 */
export const snapToNearestNeighborhood = (
  latitude: number,
  longitude: number,
) => {
  // Major Paris neighborhoods and cities (can be extended for other regions)
  const neighborhoods = [
    // Central Paris Arrondissements
    { name: '1er Arrondissement', lat: 48.861111, lon: 2.341667 },
    { name: '2e Arrondissement', lat: 48.8652, lon: 2.3561 },
    { name: '3e Arrondissement', lat: 48.8649, lon: 2.3607 },
    { name: '4e Arrondissement', lat: 48.8531, lon: 2.362 },
    { name: '5e Arrondissement', lat: 48.8455, lon: 2.3485 },
    { name: '6e Arrondissement', lat: 48.8461, lon: 2.3331 },
    { name: '7e Arrondissement', lat: 48.8566, lon: 2.3136 },
    { name: '8e Arrondissement', lat: 48.872, lon: 2.3071 },
    { name: '9e Arrondissement', lat: 48.8783, lon: 2.3372 },
    { name: '10e Arrondissement', lat: 48.8708, lon: 2.3616 },
    { name: '11e Arrondissement', lat: 48.8605, lon: 2.3741 },
    { name: '12e Arrondissement', lat: 48.8401, lon: 2.3951 },
    { name: '13e Arrondissement', lat: 48.8247, lon: 2.362 },
    { name: '14e Arrondissement', lat: 48.8309, lon: 2.327 },
    { name: '15e Arrondissement', lat: 48.8413, lon: 2.2876 },
    { name: '16e Arrondissement', lat: 48.8627, lon: 2.2753 },
    { name: '17e Arrondissement', lat: 48.8808, lon: 2.2933 },
    { name: '18e Arrondissement', lat: 48.8877, lon: 2.3431 },
    { name: '19e Arrondissement', lat: 48.8823, lon: 2.3859 },
    { name: '20e Arrondissement', lat: 48.8704, lon: 2.3997 },

    // Surrounding suburbs and communes
    { name: 'Boulogne-Billancourt', lat: 48.8355, lon: 2.2385 },
    { name: 'Neuilly-sur-Seine', lat: 48.8821, lon: 2.2617 },
    { name: 'Saint-Denis', lat: 48.9356, lon: 2.357 },
    { name: 'Montreuil', lat: 48.8629, lon: 2.4409 },
    { name: 'Vincennes', lat: 48.8463, lon: 2.4384 },
    { name: 'Créteil', lat: 48.7829, lon: 2.4523 },
    { name: 'Ivry-sur-Seine', lat: 48.8137, lon: 2.3792 },
    { name: 'Vitry-sur-Seine', lat: 48.7878, lon: 2.396 },
    { name: 'Versailles', lat: 48.8049, lon: 2.1303 },
  ];

  // Calculate distance to each neighborhood and find nearest
  let nearestNeighborhood = neighborhoods[0];
  let minDistance = Infinity;

  neighborhoods.forEach((neighborhood) => {
    const distance = getDistance(
      latitude,
      longitude,
      neighborhood.lat,
      neighborhood.lon,
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestNeighborhood = neighborhood;
    }
  });

  return {
    latitude: nearestNeighborhood.lat,
    longitude: nearestNeighborhood.lon,
    neighborhoodName: nearestNeighborhood.name,
  };
};

/**
 * Adds a subtle offset to marker coordinates to prevent flickering/overlap
 * when multiple users are at the same location
 * Uses circular positioning around the center point
 * @param latitude - Center latitude
 * @param longitude - Center longitude
 * @param index - Marker index (affects offset angle)
 * @param radiusKm - Offset radius in km (default: 0.05 km = 50m)
 * @returns Offset coordinates
 */
export const addMarkerOffset = (
  latitude: number,
  longitude: number,
  index: number,
  radiusKm: number = 0.05,
) => {
  // Convert radius from km to degrees (approximately)
  const radiusInDegrees = radiusKm / 111;

  // Distribute markers in a circle around the center
  const angle = (index * 360) / 8; // Distribute up to 8 markers around circle
  const angleRad = (angle * Math.PI) / 180;

  const offsetLat = latitude + radiusInDegrees * Math.cos(angleRad);
  const offsetLon = longitude + radiusInDegrees * Math.sin(angleRad);

  return {
    latitude: parseFloat(offsetLat.toFixed(6)),
    longitude: parseFloat(offsetLon.toFixed(6)),
  };
};

// Helper function to map static image names to actual image sources
export const getStaticBackgroundImage = (imageName: string) => {
  const imageMap: Record<string, any> = {
    BaccvsSpecial1: IMAGES.BaccvsSpecial1,
    BaccvsSpecial2: IMAGES.BaccvsSpecial2,
    BaccvsSpecial3: IMAGES.BaccvsSpecial3,
    BaccvsSpecial4: IMAGES.BaccvsSpecial4,
    BaccvsSpecial5: IMAGES.BaccvsSpecial5,
    BaccvsSpecial6: IMAGES.BaccvsSpecial6,
    BaccvsSpecial7: IMAGES.BaccvsSpecial7,
    BaccvsSpecial8: IMAGES.BaccvsSpecial8,
    BaccvsSpecial9: IMAGES.BaccvsSpecial9,
    BaccvsSpecial10: IMAGES.BaccvsSpecial10,
    BaccvsSpecial11: IMAGES.BaccvsSpecial11,
    BaccvsSpecial12: IMAGES.BaccvsSpecial12,
    BaccvsSpecial13: IMAGES.BaccvsSpecial13,
    BaccvsSpecial14: IMAGES.BaccvsSpecial14,
    BaccvsSpecial15: IMAGES.BaccvsSpecial15,
  };
  return imageMap[imageName] || IMAGES.chatBackground;
};

/**
 * Get neighbourhood/district name from latitude and longitude using Google Maps Reverse Geocoding
 * @param latitude - The latitude coordinate
 * @param longitude - The longitude coordinate
 * @returns Promise<string> - The neighbourhood or district name
 */
export const getNeighbourhoodFromCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Baccvs/1.0',
      },
    });

    const data = await response.json();

    if (!data?.address) return null;

    return (
      data.address.neighbourhood ||
      data.address.suburb ||
      data.address.city_district ||
      data.address.county ||
      data.address.city ||
      null
    );
  } catch (error) {
    console.error('Nominatim reverse geocoding failed:', error);
    return null;
  }
};

// Helper function to format date from "MMM D, YYYY" to "YYYY-MM-DD"
export const formatDateToISO = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to format time from "hh:mm A" to "HH:mm"
export const formatTimeToMilitaryTime = (timeString: string): string => {
  if (!timeString) return '';
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, '0')}:${minutes}`;
};

interface PhotoType {
  uri: string;
  fileName: string;
  type: string;
}

export const uploadDirectlyToS3 = async (photo: PhotoType): Promise<string> => {
  const region = 'eu-north-1';
  const bucketName = 'baccvs-bucket';
  const key = `uploads/${photo.fileName}`;

  const s3Client = new S3Client({
    region: region,
    credentials: {
      accessKeyId: 'YOUR_AWS_ACCESS_KEY',
      secretAccessKey: 'YOUR_AWS_SECRET_KEY',
    },
  });

  try {
    const base64 = await FileSystem.readFile(photo.uri, 'base64');
    const arrayBuffer = decode(base64);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: new Uint8Array(arrayBuffer),
      ContentType: photo.type,
    });

    await s3Client.send(command);
    console.log('Upload Success!');

    // Return the public URL
    return `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(
      key,
    )}`;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export const resetAndNavigate = (name: string) => {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name }],
      }),
    );
  }
};

// Reverse geocode to get address from coordinates
export const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          'User-Agent': 'BaccvsApp/1.0',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    } else {
      return 'Unknown location';
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return 'Location address unavailable';
  }
};

export function getEventStatus(
  utcDateTime: string,
  startTime: string,
  endTime: string,
) {
  if (!utcDateTime || !startTime || !endTime) return 'UNKNOWN';

  const now = new Date();

  // Base date from utcDateTime
  const eventDate = new Date(utcDateTime);

  // Clone for start & end
  const startDateTime = new Date(eventDate);
  const endDateTime = new Date(eventDate);

  // Apply start time
  const [startHour, startMinute] = startTime.split(':').map(Number);
  startDateTime.setHours(startHour, startMinute, 0, 0);

  // Apply end time
  const [endHour, endMinute] = endTime.split(':').map(Number);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  // Handle overnight events (e.g. 22:00 - 02:00)
  if (endDateTime <= startDateTime) {
    endDateTime.setDate(endDateTime.getDate() + 1);
  }

  if (now < startDateTime) return 'Upcoming';
  if (now >= startDateTime && now <= endDateTime) return 'Ongoing';
  return 'Past';
}

const TAG_COLORS = [
  { bg: COLORS.greenLight, text: COLORS.greenFade },
  { bg: COLORS.voilet, text: COLORS.purpleFade },
  { bg: COLORS.redpink, text: COLORS.pinkFade },
  { bg: COLORS.bluePInk, text: COLORS.white },
  { bg: COLORS.orange, text: COLORS.white },
];

export const getColorFromString = (value: string) => {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
};

export const getTimeLeftColor = (date: string) => {
  const now = dayjs();
  const eventDate = dayjs(date);

  const diffInMonths = eventDate.diff(now, 'month');
  const diffInDays = eventDate.diff(now, 'day');
  const diffInHours = eventDate.diff(now, 'hour');

  if (diffInMonths >= 1) {
    return '#04D312'; // 🟢 months
  }

  if (diffInDays >= 1) {
    return '#D38B04'; // 🟠 days
  }

  return COLORS.Red; // 🔴 hours
};

export const formatHeightDisplay = (h: string | number | undefined | null) => {
  if (!h) return '';
  const num = typeof h === 'string' ? parseFloat(h) : h;
  if (!isNaN(num)) {
    return num < 10 ? `${h} ft` : `${h} cm`;
  }
  return String(h);
};
