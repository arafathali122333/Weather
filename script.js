let apiKey = 'c7454c08b61b911ac66a1d35ea58d684',
    area, date = new Date(),
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    tempArr = [],
    apiURL, preArea, data;

//get latitude,longitude value   
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(e) {
            apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${e.coords.latitude}&lon=${e.coords.longitude}&appid=${apiKey}`;
            preArea = undefined, area = undefined;
            getData();
        });
    } else {
        alert("location not able to access");
    }
};
getLocation();

//getData from API
async function getData(area) {
    data = false;
    data = await fetch(apiURL).then(function(res) {
        if (res.status == 200) {
            return res.json();
        } else if (res.status == 404) {
            alert("Please enter correct location");
            throw new Error("invalid_location");
        } else {
            throw new Error("Something went wrong...");
        }
    }).then(function(data) {
        return data;
    }).catch(function(err) {
        console.log(err.message);
        //recall for any network issues
        if (err.message != 'invalid_location') {
            setTimeout(getData, 2000);
        }
    });
    //check multiple diff i/p function display the last one
    if (preArea == area) {
        display(data);
    }
}

//onclick,enter to get and display the data
function checker(e) {
    if (e.key == 'Enter' || e.type == 'click') {
        area = document.getElementById("area_ip").value.trim();
        if (area != '') {
            apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${area}&appid=${apiKey}`;
            if (preArea) {
                //same i/p only call the first one function
                if (preArea == area && data) {
                    preArea = area;
                    getData(area);
                } else if (preArea != area) {
                    preArea = area;
                    getData(area);
                }
            } else {
                preArea = area;
                getData(area);
            }
        } else {
            alert("Please type your location");
        }
    }
}


//display weather data
function display(data) {
    //get data and change units some data
    todayTemp = Math.round(data.list[1].main.temp - 273.15) + '℃',
        todayTempFeelsLike = Math.round(data.list[1].main.feels_like - 273.15) + '℃',
        locationName = data.city.name + ", " + data.city.country,
        description = data.list[1].weather[0].description,
        windSpeed = data.list[1].wind.speed + 'm/s',
        humidity = data.list[1].main.humidity + '%',
        visibility = (data.list[1].visibility) / 1000 + 'km',
        icon = data.list[1].weather[0].icon,
        day = date.getDay();
    //display today weather data
    document.getElementsByClassName("weather_5days")[0].innerHTML = "";
    document.getElementById('unit_change').innerHTML = '℉';
    document.getElementById("weather_img").src = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
    document.getElementById("temp").innerHTML = todayTemp;
    document.getElementById("desc").innerHTML = description;
    document.getElementById("location").innerHTML = locationName;
    document.getElementById("temp_feels_like").innerHTML = '🛰️ Feels like ' + '<b>' + todayTempFeelsLike + '<b>';
    document.getElementById("wind_speed").innerHTML = '🌊 wind speed: ' + windSpeed;
    document.getElementById("humidity").innerHTML = ' 💧 humidity: ' + humidity;
    document.getElementById("visibility").innerHTML = '🌫️ visibility: ' + visibility;
    document.getElementsByClassName("weather_today")[0].style.display = 'flex';
    //display other 4 days weather data
    for (let i in data.list) {
        if (parseInt(data.list[i].dt_txt.split(' ')[1]) === 9 && parseInt(data.list[i].dt_txt.split('-')[2]) !== date.getDate()) {
            document.getElementsByClassName("weather_5days")[0].innerHTML += `<div class="weather_today_left">
            <div><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"></div>
            <div>
                <p class="temp_daily">${Math.round(data.list[i].main.temp - 273.15) + '℃'}</p>
                <p id="date_dailyweather">${data.list[i].dt_txt.split(' ')[0]}</p>
                <p id="windspeed_daily">${days[++day]}</p>
                <br>
            </div>
        </div>`;
            tempArr.push(Math.round(data.list[i].main.temp - 273.15));
        }
    }
}

//change the unit celcius to farenheit and vice-versa
function unitChange(e) {
    let btn = e.srcElement.innerText;
    document.getElementById("temp").innerHTML = (btn == '℉' ? (Math.round((parseInt(todayTemp) * 9 / 5) + 32)) + '℉' : todayTemp);
    document.getElementById("temp_feels_like").innerHTML = '🛰️ Feels like ' + '<b>' + (btn == '℉' ? (Math.round((parseInt(todayTempFeelsLike) * 9 / 5) + 32)) + '℉' : todayTempFeelsLike) + '<b>';
    for (let i in document.getElementsByClassName('temp_daily')) {
        document.getElementsByClassName('temp_daily')[i].innerHTML = btn == '℉' ? Math.round((tempArr[i] * 9 / 5 + 32)) + '℉' : tempArr[i] + '℃';
    }
    btn == '℉' ? e.srcElement.innerText = '℃' : e.srcElement.innerText = '℉';
}