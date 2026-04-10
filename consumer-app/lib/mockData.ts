export const mockProfile = {
  firstName: 'Phoebe',
  ageRange: '25-34',
  goals: ['early awareness', 'energy stability'],
  connectedDevices: ['Apple Health'],
};

export const mockBaseline = {
  restingHeartRate: 65,
  hrv: 42,
  spo2: 98,
  sleepHours: 7.5,
};

export const mockReadings = {
  restingHeartRate: 78,
  hrv: 31,
  spo2: 97,
  sleepHours: 5.8,
};

export const mockAlerts = [
  {
    id: 'a1',
    title: 'Resting heart rate is elevated',
    detail: 'Your resting heart rate is about 20% above baseline.',
    severity: 'medium',
  },
  {
    id: 'a2',
    title: 'Recovery looks lower than usual',
    detail: 'HRV is down from your normal range for the second day in a row.',
    severity: 'medium',
  },
];
