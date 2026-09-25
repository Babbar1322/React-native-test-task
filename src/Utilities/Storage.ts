import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLocalStorageData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return null; // Return null if no value exists

    // For token, return the raw value
    if (key === "token") return value;

    try {
      return JSON.parse(value); // Try to parse as JSON
    } catch (error) {
      console.warn(
        `Could not parse "${key}" as JSON, returning raw value:`,
        value
      );
      return value; // Return the raw string if parsing fails
    }
  } catch (error) {
    console.error(`Error retrieving ${key} from storage:`, error);
    return null;
  }
};

export const storeLocalStorageData = async (key: string, value: any) => {
  try {
    // For token, store as raw string
    if (key === "token") {
      await AsyncStorage.setItem(key, value);
    } else {
      // For other data, store as JSON string
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error storing ${key} in storage:`, error);
    throw error;
  }
};

export const deleteLocalStorageData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from storage:`, error);
    throw error;
  }
};
