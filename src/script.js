document.addEventListener("DOMContentLoaded", () => {


    const API_KEY = "f872f972c6004a74a9b131043262001";



    const cityInput = document.getElementById("cityInput");

    const cityBtn = document.getElementById("getWeatherBtn");

    const temp = document.getElementById("temp");

    const weatherDesc = document.getElementById("weatherDesc");

    const weatherImage = document.getElementById("weatherImage");

    const feelsLike = document.getElementById("feelsLike")

    const feelsLikeCaption = document.getElementById("feelsLikeCaption")

    const aqi = document.getElementById("aqi")

    const aqiCaption = document.getElementById("aqiCaption")

    const visibility = document.getElementById("visibility")

    const visibilityCaption = document.getElementById("visibilityCaption")

    const humidity = document.getElementById("humidity")

    const humidityCaption = document.getElementById("humidityCaption")

    const sunRise = document.getElementById("sunRise")

    const sunSet = document.getElementById("sunSet")

    const moonRise = document.getElementById("moonRise")

    const moonSet = document.getElementById("moonSet")

    const windSpeed = document.getElementById("windSpeed")

    const windDirection = document.getElementById("windDirection")

    const maxWindSpeed = document.getElementById("maxWindSpeed")

    const cloud = document.getElementById("cloud")

    const minMaxTemp = document.getElementById("minMaxTemp")









    getWeather()

    cityBtn.addEventListener("click", getWeather);

    cityInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            getWeather()
        }
    })





    function getWeather() {

        const city = cityInput.value;

        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=yes`)

            .then(Response => Response.json())
            .then(data => {
                temp.innerText = `${data.current.temp_c}°C`;

                weatherDesc.innerText = data.current.condition.text;

                weatherImage.src = data.current.condition.icon;

                feelsLike.innerText = `${data.current.feelslike_c}°C`;

                feelsLikeCap(feelsLike.innerText, temp.innerText);

                aqiCalculator(data.current.air_quality.pm2_5);

                visibilityBlock(data.current.vis_km);

                humidityBlock(data.current.humidity);

                sunRise.innerText = `${data.forecast.forecastday[0].astro.sunrise}`;

                sunSet.innerText = `${data.forecast.forecastday[0].astro.sunset}`;

                moonRise.innerText = `${data.forecast.forecastday[0].astro.moonrise}`;

                moonSet.innerText = `${data.forecast.forecastday[0].astro.moonset}`

                windSpeed.innerText = `${data.current.wind_kph} km/h`;

                windDirection.innerText = `From: ${data.current.wind_dir}`;

                maxWindSpeed.innerText = `Max Wind: ${data.forecast.forecastday[0].day.maxwind_kph} km/h`;

                cloud.innerText = `${data.current.cloud}%`;

                // New Data Points
                const pressure = document.getElementById("pressure");
                const precip = document.getElementById("precip");

                if (pressure) pressure.innerText = data.current.pressure_mb;
                if (precip) precip.innerText = data.current.precip_mm;

                const currentUv = document.getElementById("currentUv");
                const currentUvCaption = document.getElementById("currentUvCaption");

                if (currentUv) {
                    const uv = data.current.uv;
                    currentUv.innerText = uv;

                    if (currentUvCaption) {
                        if (uv <= 2) currentUvCaption.innerText = "Low";
                        else if (uv <= 5) currentUvCaption.innerText = "Moderate";
                        else if (uv <= 7) currentUvCaption.innerText = "High";
                        else if (uv <= 10) currentUvCaption.innerText = "Very High";
                        else currentUvCaption.innerText = "Extreme";
                    }
                }

                minMaxTemp.innerText = `${data.forecast.forecastday[0].day.mintemp_c}°C / ${data.forecast.forecastday[0].day.maxtemp_c}°C`;


                const forecastData = [data.forecast.forecastday[0], data.forecast.forecastday[1], data.forecast.forecastday[2]];

                const dayForecastContainer = document.getElementById("dayForecastContainer");

                dayForecastContainer.innerHTML = "";

                forecastData.forEach(value => {
                    const card = document.createElement("div");
                    card.className = "flex items-center justify-between bg-white/5 px-5 py-4 rounded-xl cursor-default";

                    // Left: Date & Condition
                    const leftSide = document.createElement("div");
                    leftSide.className = "flex flex-col gap-1";

                    const forecastDate = document.createElement("div");
                    forecastDate.className = "font-medium text-lg leading-tight"
                    const dateObj = new Date(value.date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                    forecastDate.innerText = dayName;

                    const conditionText = document.createElement("div");
                    conditionText.className = "text-xs opacity-60 font-light truncate max-w-[120px]";

                    if (value.day && value.day.condition) {
                        conditionText.innerText = value.day.condition.text;
                    } else {
                        conditionText.innerText = "";
                    }

                    leftSide.appendChild(forecastDate);
                    leftSide.appendChild(conditionText);

                    // Center: Rain Chance
                    const centerSide = document.createElement("div");
                    centerSide.className = "flex flex-col items-center justify-center hidden sm:flex";

                    let rainChance = 0;
                    if (value.day && value.day.daily_chance_of_rain) {
                        rainChance = value.day.daily_chance_of_rain;
                    }

                    if (rainChance > 0) {
                        const rainText = document.createElement("span");
                        rainText.className = "text-xs font-semibold text-blue-300";
                        rainText.innerText = `💧 ${rainChance}%`;
                        centerSide.appendChild(rainText);
                    }


                    // Right: Icon & Temps
                    const rightSide = document.createElement("div");
                    rightSide.className = "flex items-center gap-4";

                    const icon = document.createElement("img");
                    if (value.day && value.day.condition) {
                        icon.src = value.day.condition.icon;
                    }
                    icon.className = "w-10 h-10 object-contain drop-shadow-sm"

                    const tempDiv = document.createElement("div");
                    tempDiv.className = "flex flex-col items-end";

                    const maxTemp = document.createElement("div");
                    maxTemp.className = "font-bold text-lg leading-none"
                    if (value.day) {
                        maxTemp.innerText = `${Math.round(value.day.maxtemp_c)}°`;
                    }

                    const minTemp = document.createElement("div");
                    minTemp.className = "text-sm opacity-60 leading-none mt-1"
                    if (value.day) {
                        minTemp.innerText = `${Math.round(value.day.mintemp_c)}°`;
                    }

                    tempDiv.appendChild(maxTemp);
                    tempDiv.appendChild(minTemp);

                    rightSide.appendChild(icon);
                    rightSide.appendChild(tempDiv);

                    card.appendChild(leftSide);
                    card.appendChild(centerSide);
                    card.appendChild(rightSide);

                    dayForecastContainer.appendChild(card);

                });


                const uvIndexContainer = document.getElementById("uvIndexContainer");

                if (uvIndexContainer) {
                    uvIndexContainer.innerHTML = "";

                    forecastData.forEach(value => {
                        const card = document.createElement("div");
                        card.className = "flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl";

                        const forecastDate = document.createElement("div");
                        forecastDate.className = "text-sm opacity-80"
                        const [year, month, date] = value.date.split("-");
                        const dateObj = new Date(value.date);
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                        forecastDate.innerText = `${dayName}`;

                        const uvInfo = document.createElement("div");
                        uvInfo.className = "flex items-center gap-2";

                        const dayTemp = document.createElement("div");
                        dayTemp.className = "font-bold text-lg"
                        dayTemp.innerText = `${value.day.uv}`;

                        const caption = document.createElement("div");
                        caption.className = "text-xs px-2 py-1 rounded bg-white/20 font-medium"

                        if (value.day.uv <= 2) {
                            caption.innerText = "Low"
                            caption.classList.add("text-green-300")
                        }
                        else if (value.day.uv <= 5) {
                            caption.innerText = "Mod"
                            caption.classList.add("text-yellow-300")
                        }
                        else if (value.day.uv <= 7) {
                            caption.innerText = "High"
                            caption.classList.add("text-orange-300")
                        }
                        else if (value.day.uv <= 10) {
                            caption.innerText = "Very High"
                            caption.classList.add("text-red-300")
                        }
                        else {
                            caption.innerText = "Extreme"
                            caption.classList.add("text-purple-300")
                        }

                        uvInfo.appendChild(dayTemp);
                        uvInfo.appendChild(caption);

                        card.appendChild(forecastDate);
                        card.appendChild(uvInfo);

                        uvIndexContainer.appendChild(card);

                    });
                }

                hourlyforecastdata(city, data);
                historicalWeather(city);


            })







    }


    function hourlyforecastdata(city, data) {




        const time = data.location.localtime_epoch;
        const date = new Date(time * 1000);
        const presentHour = date.getHours();
        const nextHours = []

        for (let i = 1; i <= 24; i++) {
            nextHours.push((presentHour + i) % 24);
        }


        const hourlyForecastContainer = document.getElementById("hourlyForecastContainer");


        hourlyForecastContainer.innerHTML = "";

        nextHours.forEach(hour => {


            if (hour > presentHour) {

                const card = document.createElement("div");
                card.className = "flex flex-col flex-shrink-0 justify-center items-center p-3 bg-white/5 rounded-xl min-w-[80px] hover:bg-white/10 transition-colors";

                const timeBlock = document.createElement("div")
                timeBlock.className = "pb-1 text-xs opacity-80"
                timeBlock.innerText = (data.forecast.forecastday[0].hour[hour].time).split(" ")[1];

                const icon = document.createElement("img");
                icon.src = data.forecast.forecastday[0].hour[hour].condition.icon;
                icon.className = "object-contain w-10 h-10 my-1"

                const avgTemp = document.createElement("div");
                avgTemp.className = "text-sm font-bold"
                avgTemp.innerText = `${Math.round(data.forecast.forecastday[0].hour[hour].temp_c)}°`;

                card.appendChild(timeBlock)
                card.appendChild(icon)
                card.appendChild(avgTemp)

                hourlyForecastContainer.appendChild(card);

            }
            else {
                const card = document.createElement("div");
                card.classList = "flex flex-col flex-shrink-0 justify-center items-center p-3 bg-white/5 rounded-xl min-w-[80px] hover:bg-white/10 transition-colors";

                const timeBlock = document.createElement("div")
                timeBlock.classList = "pb-1 text-xs opacity-80"
                timeBlock.innerText = (data.forecast.forecastday[1].hour[hour].time).split(" ")[1];

                const icon = document.createElement("img");
                icon.src = data.forecast.forecastday[1].hour[hour].condition.icon;
                icon.classList = "object-contain w-10 h-10 my-1"

                const avgTemp = document.createElement("div");
                avgTemp.classList = "text-sm font-bold"
                avgTemp.innerText = `${Math.round(data.forecast.forecastday[1].hour[hour].temp_c)}°`;


                card.appendChild(timeBlock)
                card.appendChild(icon)
                card.appendChild(avgTemp)

                hourlyForecastContainer.appendChild(card);


            }

        });






    }



    function historicalWeather(city) {

        const historicData = [];

        const historicDataContainer = document.getElementById("historicDataContainer");

        historicDataContainer.innerHTML = "";

        for (let i = 1; i < 8; i++) {
            const today = new Date();
            const lastDate = new Date(today);
            lastDate.setDate(today.getDate() - i);
            const yyyy = lastDate.getFullYear();
            const mm = String(lastDate.getMonth() + 1).padStart(2, '0');
            const dd = String(lastDate.getDate()).padStart(2, '0');
            const requiredDate = `${yyyy}-${mm}-${dd}`;
            historicData.push(requiredDate);
        }


        historicData.forEach(value => {

            fetch(`http://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${city}&dt=${value}`)
                .then(Response => Response.json())
                .then(data => {


                    const card = document.createElement("div");
                    card.className = "flex items-center justify-between p-3 bg-white/5 rounded-xl shrink-0";

                    const date = document.createElement("div")
                    date.className = "text-sm opacity-80"
                    const [y, m, d] = value.split('-');
                    const dateObj = new Date(value);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    date.innerText = `${dayName}, ${d}/${m}`;

                    const rightSide = document.createElement("div");
                    rightSide.className = "flex items-center gap-2";

                    const icon = document.createElement("img");
                    icon.src = data.forecast.forecastday[0].day.condition.icon;
                    icon.className = "object-contain w-8 h-8"

                    const avgTemp = document.createElement("div");
                    avgTemp.className = "text-sm font-bold w-10 text-right"
                    avgTemp.innerText = `${Math.round(data.forecast.forecastday[0].day.avgtemp_c)}°`;

                    rightSide.appendChild(icon)
                    rightSide.appendChild(avgTemp)

                    card.appendChild(date)
                    card.appendChild(rightSide)

                    historicDataContainer.appendChild(card);
                })
        });
    }


    function feelsLikeCap(feelsLike, temp) {
        if (!feelsLikeCaption) return;
        if (feelsLike == temp) {
            feelsLikeCaption.innerText = "Conditions feel normal and balanced."
        }
        else {
            feelsLikeCaption.innerText = "Feels different due to humidity & wind"
        }
    }


    function aqiCalculator(pm) {
        if (!aqi || !aqiCaption) return;
        let aqiValue;
        if (pm > 0 && pm <= 12) {
            aqiValue = (50 / 12) * pm;
            aqi.innerText = Math.round(aqiValue);
            aqiCaption.innerText = "Breathe easy today 🌿"
        }
        else if (pm > 12 && pm <= 35.4) {
            aqiValue = ((49 / 23.3) * (pm - 12.1) + 51)
            aqi.innerText = Math.round(aqiValue);
            aqiCaption.innerText = "Air's okay, go enjoy 🍃"
        }
        else if (pm > 35.4 && pm <= 55.4) {
            aqiValue = ((49 / 19.9) * (pm - 35.5) + 101)
            aqi.innerText = Math.round(aqiValue);
            aqiCaption.innerText = "Sensitive lungs, beware ⚠️"
        }
        else if (pm > 55.4 && pm <= 150.4) {
            aqiValue = ((49 / 94.9) * (pm - 55.5) + 151)
            aqi.innerText = Math.round(aqiValue);
            aqiCaption.innerText = "Take it easy outside 🏠"
        }
        else if (pm > 150.4 && pm <= 250.4) {
            aqiValue = ((99 / 99.9) * (pm - 150.5) + 201)
            aqi.innerText = Math.round(aqiValue);
            aqiCaption.innerText = "Danger! Stay protected 🚫"
        }
        else {
            aqiValue = ((199 / 249.5) * (pm - 250.5) + 301)
            aqi.innerText = Math.round(aqiValue);
            aqiCaption.innerText = "Air alert! Stay indoors 🛑"
        }

    }


    function visibilityBlock(visibilityKm) {
        if (!visibility || !visibilityCaption) return;
        visibility.innerText = `${visibilityKm} Km`;
        if (visibilityKm >= 10) {
            visibilityCaption.innerText = "Clear day, excellent visibility ✅"
        }
        else if (visibilityKm < 10 && visibilityKm >= 5) {
            visibilityCaption.innerText = "Slight haze, still good"
        }
        else if (visibilityKm < 5 && visibilityKm >= 1) {
            visibilityCaption.innerText = "Heavy haze, poor visibility ⚠️"
        }
        else {
            visibilityCaption.innerText = "Very foggy, dangerous conditions 🚨"
        }

    }


    function humidityBlock(humidityValue) {
        if (!humidity) return;
        humidity.innerText = `${humidityValue}%`
        if (!humidityCaption) return;

        if (humidityValue <= 30) {
            humidityCaption.innerText = "Dry air with low moisture 🌵"
        }
        else if (humidityValue > 30 && humidityValue <= 60) {
            humidityCaption.innerText = "Balanced moisture for comfortable air 🙂"
        }
        else if (humidityValue > 60 && humidityValue <= 80) {
            humidityCaption.innerText = "Sticky air with heavy moisture"
        }
        else {
            humidityCaption.innerText = "Oppressive humidity causing discomfort"
        }

    }

















});
