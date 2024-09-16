import redisClient from '../services/redis/redis';
import { location } from '../services/weather_api/config';
import { getWeatherBy } from '../services/weather_api/weather_api';

const EXPIRATION_TIME = 7200;

export const getForeCast = async (req, res, next) => {
  const location: location = {
    city: req.query.city,
    country: req.query.country,
  };

  let weeklyWeatherData;
  let statusCode = 200;
  try {
    if ((await doesCacheExist()) === 0) initializeCache();

    if (await isPresentInTheCache(location)) {
      weeklyWeatherData = await getWeeklyWeatherDataOf(location);
      return res
        .status(statusCode)
        .json({ weekly_weather_data: weeklyWeatherData });
    }

    if (!(await isPresentInTheCache(location))) {
      addLocationInCache(location);
      weeklyWeatherData = await saveWeatherDataOf(location);
    }

    return res
      .status(statusCode)
      .json({ weekly_weather_data: weeklyWeatherData });
  } catch (err) {
    console.log(err);
  }
};

const isPresentInTheCache = async (location: location) => {
  const isPresent = await redisClient.sIsMember('cities', location.city);
  return isPresent;
};

const doesCacheExist = async () => {
  const isExistcache = await redisClient.exists('cities');
  return isExistcache;
};

const initializeCache = async () => {
  await redisClient.sAdd('cities', 'init');
};

const addLocationInCache = async (location: location) => {
  await redisClient.sAdd('cities', location.city);
  //   await redisClient.setEx('cities', EXPIRATION_TIME, location.city);
  return location.city;
};

const getWeeklyWeatherDataOf = async (location: location) => {
  const weeklyWeatherData = await redisClient.hGetAll(
    `weekly_weather_datas:${location.city}`
  );
  return weeklyWeatherData;
};

const saveWeatherDataOf = async (location: location) => {
  const weatherData = await getWeatherBy(location);
  const weeklyWeatherData = weatherData.currentConditions;

  const weeklyWeatherDataSaved = {
    datetime: weeklyWeatherData.datetime,
    datetimeEpoch: weeklyWeatherData.datetimeEpoch,
    temp: weeklyWeatherData.precip,
    feelslike: weeklyWeatherData.feelslike,
    humidity: weeklyWeatherData.humidity,
    dew: weeklyWeatherData.dew,
    precip: weeklyWeatherData.precip,
  };

  console.log(weeklyWeatherData);

  await redisClient.hSet(`weekly_weather_datas:${location.city}`, {
    ...weeklyWeatherDataSaved,
  });
  return weeklyWeatherDataSaved;
};
