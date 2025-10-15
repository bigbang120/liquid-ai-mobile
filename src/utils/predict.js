export function predictRiskLocal({ heart_rate, spo2, temperature, resp_rate, rr }) {
  const hr = parseFloat(heart_rate);
  const sp = parseFloat(spo2);
  const temp = parseFloat(temperature);
  const resp = parseFloat(resp_rate);
  const rrInt = parseFloat(rr);

  let tier;
  if (hr > 120 || sp < 90 || temp > 39 || resp > 25 || rrInt < 0.6) {
    tier = 2;
  } else if (hr > 100 || sp < 94 || temp > 37.8 || resp > 20 || rrInt < 0.8) {
    tier = 1;
  } else {
    tier = 0;
  }

  const messages = ['Normal', 'Elevated risk', 'Critical'];
  return { tier, message: messages[tier] };
}
