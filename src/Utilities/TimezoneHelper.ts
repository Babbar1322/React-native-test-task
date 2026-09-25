/**
 * Timezone Helper Utilities
 * Provides functions to fetch timezone information based on coordinates
 */

/**
 * Fetches timezone for given coordinates using wheretheiss.at API
 * This is a free API that doesn't require authentication
 * 
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns IANA timezone identifier (e.g., "America/New_York") or undefined if failed
 */
export const getTimezoneFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | undefined> => {
  try {
    // Using wheretheiss.at API - free and doesn't require API key
    const response = await fetch(
      `https://api.wheretheiss.at/v1/coordinates/${latitude},${longitude}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.timezone_id) {
      console.log(`Timezone fetched for [${latitude}, ${longitude}]:`, data.timezone_id);
      return data.timezone_id; // e.g., "America/New_York"
    }
    
    console.warn("No timezone_id in response:", data);
    return undefined;
  } catch (error) {
    console.error("Error fetching timezone:", error);
    return undefined;
  }
};

/**
 * Alternative: Get timezone using TimeZoneDB API (requires API key)
 * Sign up at https://timezonedb.com/register to get a free API key
 * 
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param apiKey - TimeZoneDB API key
 * @returns IANA timezone identifier or undefined if failed
 */
export const getTimezoneFromTimeZoneDB = async (
  latitude: number,
  longitude: number,
  apiKey: string
): Promise<string | undefined> => {
  try {
    const response = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=position&lat=${latitude}&lng=${longitude}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === "OK" && data.zoneName) {
      console.log(`Timezone fetched for [${latitude}, ${longitude}]:`, data.zoneName);
      return data.zoneName;
    }
    
    console.warn("TimeZoneDB error:", data.message);
    return undefined;
  } catch (error) {
    console.error("Error fetching timezone from TimeZoneDB:", error);
    return undefined;
  }
};

/**
 * Formats timezone for display
 * 
 * @param timezone - IANA timezone identifier
 * @returns Formatted timezone string or the original if formatting fails
 */
export const formatTimezone = (timezone: string): string => {
  try {
    // Convert "America/New_York" to "America/New York"
    return timezone.replace(/_/g, ' ');
  } catch {
    return timezone;
  }
};

/**
 * Gets current time in a specific timezone
 * 
 * @param timezone - IANA timezone identifier
 * @returns Formatted time string
 */
export const getCurrentTimeInTimezone = (timezone: string): string => {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error("Error getting time for timezone:", error);
    return "";
  }
};

/**
 * Gets timezone abbreviation (e.g., EST, PST)
 * 
 * @param timezone - IANA timezone identifier
 * @returns Timezone abbreviation
 */
export const getTimezoneAbbreviation = (timezone: string): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(part => part.type === 'timeZoneName');
    
    return tzPart ? tzPart.value : timezone;
  } catch (error) {
    console.error("Error getting timezone abbreviation:", error);
    return timezone;
  }
};
