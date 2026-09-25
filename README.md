***

# Baccvs - The Ultimate Social & Event Super App

A production-grade React Native application that redefines the "Super App" concept by seamlessly integrating Dating, Event Ticketing, Real-time Communities, Social Feeds, and Professional Services into a single, highly performant ecosystem. 

Built with scalability and fluid user experience in mind, this application leverages complex hardware integrations, real-time WebSockets, and native-driven animations to deliver a premium native feel on both iOS and Android.

## 🚀 Tech Stack

- **Core Framework:** React Native (v0.76.7) & React (v18.3.1)
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`) for centralized, predictable state management.
- **Routing & Navigation:** React Navigation v7 (Native Stack, Bottom Tabs, Drawer) handling complex, deeply nested navigation flows.
- **Hardware & Media Integration:** 
  - `react-native-vision-camera` & `react-native-camera` for ultra-fast QR scanning and media capture.
  - `react-native-video` & `react-native-audio-recorder-player` for rich media playback and recording.
  - `@react-native-camera-roll/camera-roll` & `react-native-image-resizer` for native media handling.
- **Real-Time & Networking:** 
  - `socket.io-client` for low-latency, real-time messaging.
  - `axios` with interceptors for robust API communication.
- **Cloud & Backend Services:** 
  - AWS SDK (`@aws-sdk/client-s3`) for direct, secure cloud storage uploads.
  - Firebase (`@react-native-firebase/app`, `messaging`) for reliable push notifications.
- **Payments & Monetization:** Stripe (`@stripe/stripe-react-native`) and In-App Purchases (`react-native-iap`) for secure, multi-platform financial transactions.
- **UI & Animations:** `react-native-reanimated` (v3) for 60fps native UI thread animations, `@gorhom/bottom-sheet`, and `react-native-gifted-charts` for high-performance analytics rendering.

## ⭐ Spotlight Feature: Real-Time Event Ticketing & Hardware-Accelerated QR Scanner

The most technically demanding feature of Baccvs is the **Event Ticketing Engine**, specifically the hardware-accelerated QR Ticket Scanner used by event organizers to validate tickets at the door.

### Why it was difficult to build:
Managing camera hardware in React Native while simultaneously running smooth UI animations is notoriously difficult. Camera feeds are resource-heavy, leading to memory leaks and battery drain if not properly handled. Furthermore, scanning logic is prone to "ghost scanning" (rapidly triggering the API multiple times for the same QR code), requiring strict debouncing and state control.

### How it works under the hood:
- **Hardware Lifecycle Management:** Built using `react-native-vision-camera`, the scanner utilizes a custom `useIsForeground` hook that listens to the device's `AppState`. The camera component strictly unmounts when the app is pushed to the background, saving battery and preventing hardware locks.
- **Fluid UI & Haptics:** A continuous `Animated.loop` drives a visual scanning line over the camera feed using the Native Driver to prevent JS-thread blocking. Upon a successful scan, `Vibration.vibrate()` fires for instant physical feedback before dynamically transitioning the UI from the camera feed to a detailed Ticket Card.
- **Debounced Validation Engine:** The `useCodeScanner` implementation employs `useRef` guard clauses to ensure that a single QR code only triggers exactly one API validation sequence, completely eliminating race conditions.
- **State Flow:** Once validated, the app securely patches the database to mark the ticket as `used` in real-time, preventing double-entry fraud.

### Specific Technical Problems Solved:
- **Performance Optimization:** Offloaded animations to the UI thread using native drivers.
- **Hardware Memory Leaks:** Strictly bound the camera's `isActive` prop to React Navigation's `useIsFocused()` and the AppState listener.
- **Concurrency & Fraud Prevention:** Engineered strict asynchronous state locks to ensure ticket validity at high-traffic events.

## 🛠 Highlighted Features

Beyond the scanner, Baccvs is an incredibly vast platform packed with complex, production-ready systems:

- **Social Feed & Stories Engine:** Users can create posts, leave comments, and upload ephemeral 24-hour "Stories" (similar to Instagram/Snapchat), demanding heavy cloud storage handling and responsive media rendering.
- **Tinder-Style Dating Engine:** Implemented using `react-native-deck-swiper`, featuring physics-based swipe interactions, matching algorithms, "Purchase Likes" functionality, and rich user profiles.
- **Real-Time Communities & Chat:** Built on `socket.io-client` to support instant 1-on-1 messaging, group chats, typing indicators, and online presence. Includes detailed permissions and privacy controls.
- **Interactive Maps & Geolocation:** Utilizes `react-native-maps` and `react-native-geolocation-service` to discover nearby events, professionals, and users in real-time.
- **Professional Booking System:** Allows users to create professional profiles, manage schedules, accept bookings, and receive payouts directly within the app via Stripe integration.
- **Comprehensive Event Management:** End-to-end event creation, from setting up venues to selling tickets. Organizers can view real-time ticket sales and attendee data through beautifully rendered, interactive charts using `react-native-gifted-charts`.
- **Secondary Ticket Market:** A secure internal economy allowing users to resell or transfer event tickets safely, mitigating ticket scalping.
- **Referral & Reward System:** Integrated dynamic referral links and incentive tracking to drive organic user acquisition.
- **Robust Security & Moderation:** Comprehensive settings for blocking users, reporting posts, managing privacy preferences, and securing accounts with OTP verifications.

## 💡 Why This Project Stands Out

Building a "Super App" requires an extraordinary level of architectural discipline. Baccvs stands out because it doesn't just display data; it orchestrates a symphony of heavy native APIs—from real-time WebSockets and secure financial transactions to raw hardware manipulation (Cameras, GPS, Haptics)—all without sacrificing a frame of animation. Overcoming the challenges of complex state management across deeply nested navigators, optimizing memory for infinite scrolling feeds, integrating rich media like Stories and Audio, and ensuring bulletproof error handling for hardware failures demonstrates a high degree of technical maturity, problem-solving capability, and a deep understanding of the React Native bridge.
