import axios from "axios";
const APIKEY = '81f8a9c3d7461071793c9dcccb4a64d4'

export const searchCity = (data) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://api.openweathermap.org/geo/1.0/direct?q=${data}&appid=${APIKEY}`,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return axios.request(config)
}

export const getWeatherCity = (data) => {
    
    data.exclude = 'daily'

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${data.lat}&lon=${data.lon}&exclude=${data.exclude}&appid=${APIKEY}&units=metric&lang=ru`,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return axios.request(config)
}

export const getWeatherForecast = (data) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://api.openweathermap.org/data/2.5/forecast?id=${data}&appid=${APIKEY}&units=metric&lang=ru`,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return axios.request(config)
}