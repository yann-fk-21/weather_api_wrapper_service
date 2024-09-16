import { BASE_URL, location } from './config';

export const getWeatherBy = async (location: location) => {
  const response = await fetch(
    BASE_URL +
      `${location.city}, ${location.country}?key=${process.env.API_KEY}`
  );
  return await response.json();
};
