// Add this function to your Helpers.tsx file
export const geocodeAddress = async (
  address: string
): Promise<{
  latitude: number;
  longitude: number;
  success: boolean;
  error?: string;
}> => {
  try {
    // Use Google's Geocoding API (you'll need an API key)
    const apiKey = "YOUR_GOOGLE_API_KEY"; // Replace with your actual API key
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        success: true,
      };
    } else {
      console.error("Geocoding error:", data.status);
      // Fallback to random coordinates near a major city if geocoding fails
      return {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1, // NYC with slight randomization
        longitude: -74.006 + (Math.random() - 0.5) * 0.1,
        success: false,
        error: `Geocoding failed: ${data.status}`,
      };
    }
  } catch (error) {
    console.error("Error in geocoding:", error);
    // Fallback to random coordinates if the API call fails
    return {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1, // NYC with slight randomization
      longitude: -74.006 + (Math.random() - 0.5) * 0.1,
      success: false,
      error: `API error: ${error}`,
    };
  }
};

// Alternative implementation without API key (using OpenStreetMap Nominatim)
export const geocodeAddressOSM = async (
  address: string
): Promise<{
  latitude: number;
  longitude: number;
  success: boolean;
  error?: string;
}> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "YourAppName/1.0", // Required by Nominatim's terms of use
      },
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        success: true,
      };
    } else {
      console.error("Geocoding error: No results found");
      // Fallback to random coordinates
      return {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.006 + (Math.random() - 0.5) * 0.1,
        success: false,
        error: "No results found",
      };
    }
  } catch (error) {
    console.error("Error in geocoding:", error);
    // Fallback to random coordinates
    return {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.006 + (Math.random() - 0.5) * 0.1,
      success: false,
      error: `API error: ${error}`,
    };
  }
};
