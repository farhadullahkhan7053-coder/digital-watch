import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

export function useWatchData() {
  const [time, setTime] = useState(new Date());
  const [steps, setSteps] = useState(4231);
  const [heartRate, setHeartRate] = useState(72);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate step counting and heart rate fluctuations
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    const hrInterval = setInterval(() => {
      setHeartRate(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(60, Math.min(160, prev + change));
      });
    }, 3000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(hrInterval);
    };
  }, []);

  // Fetch weather (mocked for now, but could use geolocation)
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // In a real app, we'd call a weather API here.
        // For this demo, we'll just set some realistic mock data.
        setWeather({
          temp: 22,
          condition: 'Partly Cloudy',
          location: 'San Francisco'
        });
      }, () => {
        setWeather({
          temp: 18,
          condition: 'Cloudy',
          location: 'Unknown'
        });
      });
    }
  }, []);

  return { time, steps, heartRate, weather };
}
