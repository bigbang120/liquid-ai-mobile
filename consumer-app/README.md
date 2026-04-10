# Liquid AI consumer app starter

A fresh consumer-facing mobile app scaffold for Liquid AI.

## Product goal

This app is the public product layer.
It helps a person connect devices, build a personal baseline, review daily readings, and receive early-awareness alerts.

## Initial screens

- onboarding
- connect wearable
- baseline status
- home dashboard
- alerts
- trends
- readings history
- profile and privacy

## Recommended run command

Create a fresh Expo app shell and move this folder into the project root if you want a cleaner reset:

```bash
npx create-expo-app@latest --template default@sdk-55
```

Expo recommends Expo Router for new Expo projects, so this starter uses a file-based route layout.

## Suggested API contract

- `POST /v1/profile`
- `POST /v1/readings/batch`
- `GET /v1/baseline/:userId`
- `GET /v1/risk/latest/:userId`
- `GET /v1/alerts/:userId`

## Notes

This is a wellness and early-awareness consumer layer. It should avoid medical or diagnostic claims.
