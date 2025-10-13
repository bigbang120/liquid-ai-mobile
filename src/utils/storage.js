import AsyncStorage from '@react-native-async-storage/async-storage';

// Save a single prediction result to local storage
export const savePrediction = async (prediction) => {
  try {
    const existing = await AsyncStorage.getItem('predictions');
    let predictions = existing ? JSON.parse(existing) : [];
    predictions.push(prediction);
    await AsyncStorage.setItem('predictions', JSON.stringify(predictions));
  } catch (e) {
    console.error('Failed to save prediction', e);
  }
};

// Get all predictions from local storage
export const getPredictions = async () => {
  try {
    const value = await AsyncStorage.getItem('predictions');
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('Failed to load predictions', e);
    return [];
  }
};

// Save alerts array to local storage
export const saveAlerts = async (alerts) => {
  try {
    await AsyncStorage.setItem('alerts', JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts', e);
  }
};

// Get alerts from local storage
export const getAlerts = async () => {
  try {
    const value = await AsyncStorage.getItem('alerts');
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('Failed to load alerts', e);
    return [];
  }
};
