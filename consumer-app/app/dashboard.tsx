import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Button } from 'react-native';
import { getDashboard } from '../lib/api';

function statusColor(status: string) {
  switch (status && status.toLowerCase()) {
    case 'high':
    case 'elevated':
      return 'red';
    case 'medium':
    case 'lower_than_usual':
      return 'orange';
    default:
      return 'green';
  }
}

export default function Dashboard() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getDashboard('user123');
      setData(res);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ marginBottom: 10 }}>Could not load your dashboard data.</Text>
        <Button title="Retry" onPress={fetchData} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Today\'s Status</Text>
      {data.headline && (
        <Text style={{ fontSize: 16, marginBottom: 10 }}>{data.headline}</Text>
      )}
      {data.overall_risk && (
        <Text style={{ fontSize: 16, marginBottom: 20 }}>
          Overall risk: {String(data.overall_risk).toUpperCase()}
        </Text>
      )}
      {data.signals &&
        Object.entries(data.signals).map(([key, val]: [string, any]) => {
          const color = statusColor(val.status);
          return (
            <View
              key={key}
              style={{
                marginBottom: 10,
                padding: 10,
                borderWidth: 1,
                borderColor: color,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}:
              </Text>
              <Text>Baseline: {val.baseline}</Text>
              <Text>Current: {val.current}</Text>
              <Text>
                Status:{' '}
                <Text style={{ color }}>
                  {val.status}
                </Text>
              </Text>
            </View>
          );
        })}
      {data.alerts && data.alerts.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Alerts</Text>
          {data.alerts.map((alert: any, index: number) => {
            const severityColor = statusColor(alert.severity);
            return (
              <View
                key={index}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  borderWidth: 1,
                  borderColor: severityColor,
                  borderRadius: 5,
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>{alert.title}</Text>
                <Text>{alert.detail}</Text>
                <Text>
                  Severity:{' '}
                  <Text style={{ color: severityColor }}>
                    {alert.severity}
                  </Text>
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
