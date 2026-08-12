# The WeatherApp

This is my **WeatherApp**, a modern weather forecasting application designed to provide users with current weather conditions, hourly forecasts, weekly forecasts, air conditions, location-based weather, and severe weather notifications.

The application was built using **React**, **TypeScript**, and **Vite**, with a focus on reusable components, responsive design, browser-based data persistence, API integration, location services, and a smooth user experience.

## Overview

### The Challenge

Users should be able to:

* View current weather conditions for a selected location
* View the current temperature, minimum temperature, maximum temperature, and "feels like" temperature
* Search for cities and view their weather information
* Use their current browser location to automatically display local weather
* Save frequently used locations
* Remove saved locations
* Switch between hourly and weekly forecasts
* View air condition information
* Switch between light and dark themes
* Switch between Celsius and Fahrenheit
* Receive severe weather notifications when applicable
* Continue viewing previously loaded weather when offline
* Store application preferences and saved locations using browser localStorage
* View the application across desktop, tablet, and mobile screen sizes
* Receive visual feedback through toast notifications

---

## Preview

![App Preview](src/assets/images/GlowBeauty_Preview.png)

![After adding the link](src/assets/images/Added_Link.png)
### Links

* **Solution URL:** `https://github.com/Sharon-Mashai/`
* **Live Site URL:** Add your deployed Vercel URL here

---

# Getting Started

Follow these instructions to run the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (v18 or later recommended)
* npm (comes with Node.js)

You can verify your installation by running:

```bash
node -v
npm -v
```

## Installation

### 1. Clone the repository

```bash
git clone <your-weather-app-repository-url>
```

### 2. Navigate to the project directory

```bash
cd <weather-app-folder>
```

### 3. Install dependencies

```bash
npm install
```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

Vite will start the application and display something similar to:

```text
Local: http://localhost:5173/
```

Open the URL in your browser to view the application.

The project supports **Hot Module Replacement (HMR)**, meaning changes made during development are reflected in the browser without requiring a full page refresh.

---

## Building for Production

To generate an optimized production build, run:

```bash
npm run build
```

The compiled application will be generated inside the **dist** folder.

---

## Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
```

---

# My Process

## Built With

* React
* TypeScript
* Vite
* Hugeicons React Library
* CSS3
* Flexbox
* Responsive Design
* Component-Based Architecture
* Custom React Hooks
* Browser localStorage
* Weather API
* Geolocation API
* Browser Notification API

---

## Features

### Current Weather

The application displays the current weather conditions for the selected location, including:

* Current temperature
* Weather condition
* Weather icon
* Minimum temperature
* Maximum temperature
* Feels-like temperature
* Location and country

### City Search

Users can search for cities and select a location from the search results.

The search functionality uses a debounce delay before sending the search request, helping prevent an API request from being made for every individual keystroke.

### Current Location

The application can request permission to access the user's browser location.

When permission is granted, the application retrieves the user's coordinates and loads weather information based on their current location.

If location access is denied or unavailable, the application falls back to **Polokwane**.

### Saved Locations

Users can save locations they frequently want to access.

Saved locations can be:

* Added
* Selected
* Removed

Saved locations are persisted using the browser's `localStorage`, allowing them to remain available after refreshing or reopening the application.

### Forecasts

The application provides two forecast views:

* **Hourly Forecast**
* **Weekly Forecast**

Users can switch between these views using the forecast tabs.

### Air Conditions

The application provides additional air condition information based on the available weather and forecast data.

### Themes

Users can switch between:

* Dark theme
* Light theme

The selected theme is stored in localStorage so that the preference remains after refreshing the application.

### Temperature Units

Users can switch between:

* Celsius (°C)
* Fahrenheit (°F)

The selected unit is also persisted using localStorage.

### Severe Weather Notifications

The application checks the current weather condition for severe weather.

When a supported severe weather condition is detected, the application can display a warning notification.

Browser notifications are also supported when notification permission has been granted.

### Offline Support

The application stores the most recently loaded weather information in localStorage.

If the user loses their internet connection, the application can display the cached weather information instead of leaving the weather section empty.

The application also detects changes between online and offline states and attempts to refresh the weather when the connection is restored.

### Toast Notifications

The application uses toast notifications to provide feedback for actions such as:

* Saving a location
* Removing a location
* Changing the current location
* Using cached weather
* Severe weather warnings

---

# What I Learned

While working on this project, I learned how to:

* Build a complete weather application using React and TypeScript.
* Structure an application using reusable React components.
* Work with external weather APIs.
* Fetch current weather and forecast data asynchronously.
* Use `Promise.all()` to retrieve multiple API resources efficiently.
* Work with browser geolocation services.
* Handle browser location permissions.
* Implement city search with debouncing.
* Create reusable custom hooks.
* Persist application state using browser localStorage.
* Implement offline weather caching.
* Detect online and offline browser states.
* Work with browser notifications.
* Manage application state using React hooks.
* Create light and dark themes.
* Build responsive layouts for different screen sizes.
* Handle loading and error states.
* Create reusable toast notification components.
* Separate API logic from UI components.

---

## Custom Local Storage Hook

The application uses a reusable `useLocalStorage` hook to persist data in the browser.

For example:

```tsx
const [theme, setTheme] = useLocalStorage<"dark" | "light">(
  "theme",
  "dark"
);
```

The hook first checks whether a value already exists in localStorage.

If it exists, the stored value is restored.

If no value exists, the provided default value is used.

Whenever the state changes, the new value is automatically stored:

```tsx
useEffect(() => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error("Unable to save data to localStorage.");
  }
}, [key, value]);
```

This allows application preferences and saved locations to persist between sessions.

---

# Application Data

The application stores several pieces of information locally in the browser.

The main localStorage keys include:


`unit` >Stores the selected temperature unit                      
 `theme`>Stores the selected light or dark theme                  
 `savedLocations`> Stores the user's saved locations                         
 `activeCity`> Stores the last active city                               
 `locationPermission`> Stores the application's location permission state        
 `lastWeather`> Stores the most recently loaded weather and forecast data 

No user account is required to use these features.

---

# How It Works

The application follows a simple weather data flow:

```text
User opens the application
        ↓
Application loads weather data
        ↓
Current weather + forecast are displayed
        ↓
User can search for another city
        ↓
Weather data is retrieved from the API
        ↓
Selected city becomes the active location
        ↓
User can save the location
        ↓
Saved location is stored in localStorage
```

For location-based weather:

```text
User grants location permission
        ↓
Browser provides latitude + longitude
        ↓
Weather API receives the coordinates
        ↓
Current weather + forecast are retrieved
        ↓
Weather information is displayed
```

For offline support:

```text
Weather API request
        ↓
Weather data successfully loaded
        ↓
Weather snapshot saved to localStorage
        ↓
Internet connection is lost
        ↓
Cached weather is displayed
```

---

# State Management

The application uses React state and custom hooks to manage different parts of the application.

Examples include:

```tsx
const [weather, setWeather] = useState<WeatherData | null>(null);

const [forecast, setForecast] =
  useState<ForecastData | null>(null);

const [forecastTab, setForecastTab] =
  useState<"hourly" | "weekly">("hourly");
```

Persistent settings use the custom `useLocalStorage` hook:

```tsx
const [unit, setUnit] =
  useLocalStorage<TemperatureUnit>("unit", "C");

const [theme, setTheme] =
  useLocalStorage<"dark" | "light">("theme", "dark");
```

This separates temporary UI state from information that needs to survive a page refresh.

---

# Loading and Error Handling

The application provides feedback while weather information is being retrieved.

A reusable `Loading` component is displayed when the application is waiting for its initial weather data:

```tsx
if (loading && !weather) {
  return (
    <div className="app">
      <Loading message="Loading weather..." />
    </div>
  );
}
```

The application also handles failed API requests.

When an API request fails, the application first checks whether cached weather data is available.

If cached data exists, it is displayed.

If no cached data exists, an error message is shown.

This provides a better experience when the user has a temporary network problem.

---

# Continued Development

In future versions of the application, I would like to improve my skills and expand the application with:

* More detailed severe weather alerts
* Improved weather alert information
* More advanced weather visualizations
* Weather radar integration
* Additional forecast information
* Better accessibility support
* Unit and integration testing
* Progressive Web App (PWA) support
* More advanced offline capabilities
* Improved API error handling
* More advanced location management
* Weather data synchronization
* Performance optimizations

---

# Useful Resources

* React Documentation – https://react.dev
* TypeScript Handbook – https://www.typescriptlang.org/docs/
* Vite Documentation – https://vite.dev
* Hugeicons – https://hugeicons.com
* MDN Web Docs – https://developer.mozilla.org
* OpenWeather Documentation – https://openweathermap.org/api

---

# Author

**Sharon Mashai**

* GitHub: `https://github.com/Sharon-Mashai`

---

# Acknowledgments

Special thanks to **Mentors and Facilitators** for providing practical front-end development challenges that encourage developers to strengthen their React, TypeScript, API integration, responsive design, and UI development skills.

This project provided an opportunity to apply these concepts to a practical weather application while exploring browser APIs such as **Geolocation**, **Notifications**, and **localStorage**.

The project also helped strengthen my understanding of asynchronous API requests, reusable React components, custom hooks, state management, offline caching, responsive design, and user-focused application development.
