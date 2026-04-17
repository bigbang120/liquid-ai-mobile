const API_BASE_URL = 'http://localhost:8000';

export async function sendReadings(data) {
  const response = await fetch(API_BASE_URL + '/v1/readings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to send readings');
  }
  return response.json();
}

export async function getDashboard(userId) {
  const response = await fetch(API_BASE_URL + '/v1/dashboard/' + userId);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard');
  }
  return response.json();
}
