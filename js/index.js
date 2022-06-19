const APP_ID = "df13d8e5fd626a11958e854ce8c63ab1";
const DEFAULT_VALUE = "--";


const searchInput = document.querySelector('#search-input');
const cityName = document.querySelector(".city-name");
const weatherState = document.querySelector(".weather-state");
const weatherIcon = document.querySelector(".weather-icon");
const temprature = document.querySelector(".temperature");


const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const humidity = document.querySelector(".humidity");
const windSpeed = document.querySelector(".wind-speed");




searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            console.log('[Search Input]', data);
        
        
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            weatherState.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            weatherIcon.setAttribute('src', `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temprature.innerHTML = Math.round(data.main.temp) || DEFAULT_VALUE;

            sunrise.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
            sunset.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
            humidity.innerHTML = data.main.humidity + "%" || DEFAULT_VALUE;
            windSpeed.innerHTML = (data.wind.speed).toFixed(2) + " km/h" || DEFAULT_VALUE;
        });
});

//voice assistance

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "vi-VI";
console.log(recognition)
recognition.continuous = false;

const container = document.querySelector(".container");
const microphone = document.querySelector(".microphone");

const handleVoice = (text) => {
    const handleText = text.toLowerCase();
    if(handleText.includes("thời tiết tại")){
       const location = handleText.split("tại")[1].trim();
       searchInput.value = location;

       const changeEvent = new Event("change");
       searchInput.dispatchEvent(changeEvent);
       return;
    }
    if(handleText.includes("thay đổi màu nền")) {
        const color = handleText.split("nền")[1].trim();
        container.style.background = color;
        return;
    }
    if(handleText.includes("màu nền mặc định")) {
        container.style.background = "";
    }
}


microphone.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Hãy nói: Thời tiết tại thành phố bạn muốn (Ví dụ: thời tiết tại đà nẵng)")

    recognition.start();
    microphone.classList.add("recording");
});

recognition.onspeechend = () => {
    recognition.stop();
    microphone.classList.remove("recording");
}

recognition.onerror = (err) => {
    console.log(err)
}

recognition.onresult = (e) => {
    console.log('onresult', e)

    const text = e.results[0][0].transcript;

    handleVoice(text);
}