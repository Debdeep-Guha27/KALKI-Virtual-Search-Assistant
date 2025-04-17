import './style.css'
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();
    if (hour >= 0 && hour < 12) {
        speak("Good Morning Sir...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Sir...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing KALKI...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

async function getWeather() {

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  let url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=auto:ip`
    try {
        let response = await fetch(url);
        let data = await response.json();
        let weatherText = `The current temperature in ${data.location.name} is ${data.current.temp_c} degrees Celsius with ${data.current.condition.text}.`;
        speak(weatherText);
    } catch (error) {
        speak("Sorry, I couldn't fetch the weather information.");
    }
    
}

async function getJoke() {
    try {
        let response = await fetch('https://official-joke-api.appspot.com/random_joke');
        let data = await response.json();
        speak(`${data.setup} ... ${data.punchline}`);
    } catch (error) {
        speak("Sorry, I couldn't fetch a joke at the moment.");
    }
    
}

async function getNews() {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  let url = `https://gnews.io/api/v4/top-headlines?lang=en&country=us&token=${apiKey}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        speak(`Here is the latest news: ${data.articles[0].title}`);
    } catch (error) {
        speak("Sorry, I couldn't fetch the news at the moment.");
    }
    
}
async function solveMath(expression) {
    try {
        let response = await fetch(`https://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}`);
        let result = await response.text();
        speak(`The result is ${result}`);
    } catch {
        speak("I couldn't calculate that.");
    }
    
}
function adjustVolume(action) {
    let mediaElements = document.querySelectorAll("video, audio");

    if (mediaElements.length === 0) {
        speak("No media found to adjust volume.");
        return;
    }

    mediaElements.forEach(media => {
        if (action === "increase" && media.volume < 1) {
            media.volume = Math.min(1, media.volume + 0.1);
            speak("Increasing volume.");
        } else if (action === "decrease" && media.volume > 0) {
            media.volume = Math.max(0, media.volume - 0.1);
            speak("Decreasing volume.");
        } else if (action === "mute") {
            media.muted = true;
            speak("Muting system.");
        } else if (action === "unmute") {
            media.muted = false;
            speak("Unmuting system.");
        }
    });
}
async function playSong(song) {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY; 
    let query = encodeURIComponent(song + " song");

    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}`;

    try {
        let response = await fetch(url);
        let data = await response.json();
        
        if (data.items.length > 0) {
            let videoId = data.items[0].id.videoId;
            window.open(`https://www.youtube.com/watch?v=${videoId}&autoplay=1`, "_blank");
        } else {
            speak("Sorry, I couldn't find that song.");
        }
    } catch (error) {
        speak("Error fetching the song. Please try again.");
    }
}










function takeCommand(message) {
    
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    }
    else if (message.includes('love me') || message.includes('respect me')) {
        speak("Yes Sir,I love You and will always respect you. Kalki is always at your service");
    }
    else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('tell me about weather today')) {
        getWeather();
        return;
    } else if (message.includes('tell me a joke')) {
        getJoke();
        return;
    } else if (message.includes('tell me about news')) {
        getNews();
        return;
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak("Today's date is " + date);
    } else if (message.includes('open calculator')) {
        window.open('Calculator:///');
        speak("Opening Calculator");
    } 
    else if (message.includes("motivate me") || message.includes("quote")) {
        fetch("https://api.quotable.io/random")
            .then(response => response.json())
            .then(data => {
                speak(data.content + " by " + data.author);
            })
            .catch(() => speak("I couldn't find a quote for you."));
            return;
    }
    else if (message.includes("my name is")) {
        let name = message.replace("my name is", "").trim();
        localStorage.setItem("username", name);
        speak(`Nice to meet you, ${name}`);
    } else if (message.includes("what's my name")) {
        let name = localStorage.getItem("username") || "Sir";
        speak(`Your name is ${name}`);
    }
    
    else if (message.includes("translate")) {
        let words = message.replace("translate", "").trim();
        fetch(`https://api.mymemory.translated.net/get?q=${words}&langpair=en|hi`)
            .then(response => response.json())
            .then(data => {
                speak(`Translation: ${data.responseData.translatedText}`);
            })
            .catch(() => speak("I couldn't translate that."));
            return;
    }
    if (message.includes("calculate")) {
        let expression = message.replace("calculate", "").trim();
        solveMath(expression);
    }
    else if (message.includes("increase volume")) {
        adjustVolume("increase");
    } else if (message.includes("decrease volume")) {
        adjustVolume("decrease");
    } else if (message.includes("mute")) {
        adjustVolume("mute");
    } else if (message.includes("unmute")) {
        adjustVolume("unmute");
    }
    else if (message.includes("play") && message.includes("on youtube")) {
        let songName = message.replace("play", "").trim();
        playSong(songName);
    }
    else if (message.includes("find")) {
        let place = message.replace("find", "").trim();
        window.open(`https://www.google.com/maps/search/${place}/`);
        speak(`Finding ${place} nearby.`);
    }
    else if (message.includes("open chatgpt")) {
        speak("Redirecting to ChatGPT. Let me know how else I can help.");
        window.open("https://chat.openai.com/", "_blank");
    }

    else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        speak("I found some information for " + message);
    }
}
