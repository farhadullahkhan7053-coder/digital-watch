export type Screen = 'watch' | 'fitness' | 'weather' | 'reminders';

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
}

export interface Reminder {
  id: string;
  text: string;
  time: string;
  completed: boolean;
}
