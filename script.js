const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
const currentMoodDisplay = document.getElementById('current-mood');
const adviceText = document.getElementById('advice');
const activitiesList = document.getElementById('activities');
const loader = document.getElementById('loader');
const moodHistoryList = document.getElementById('mood-history');
const disclaimerModal = document.getElementById('disclaimerModal');
const closeBtn = document.getElementsByClassName('close')[0];
const scriptureElement = document.getElementById('scripture');

const advices = [
  "Feeling sad: Remember, it's okay to feel this way. Consider talking to someone you trust or engaging in a comforting activity.",
  "Feeling confused: Take a moment to breathe deeply and reflect. Writing down your thoughts might help bring clarity.",
  "Feeling neutral: This is a good time for self-care. Maybe try a new hobby or revisit an old one you enjoyed.",
  "Feeling Content: Wonderful, You're in a good place! Why not share your positive energy with someone or plan something fun?",
  "Feeling very happy: Fantastic! Embrace this feeling and consider setting a new goal or helping others."
];

const activities = [
  ["Practice mindful meditation for 10 minutes", "Write a gratitude journal listing 3 things you're thankful for"],
  ["Go for a 15-minute walk in nature", "Try a simple breathing exercise: inhale for 4 counts, hold for 4, exhale for 4"],
  ["Listen to your favorite uplifting music", "Do a quick 5-minute stretching routine"],
  ["Call a friend or family member to share your good mood", "Start planning a fun activity or trip"],
  ["Volunteer or help someone in need", "Learn something new - watch an educational video or start an online course"]
];

const scriptures = [
  "Psalm 34:18 - 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.'",
  "Proverbs 3:5 - 'Trust in the Lord with all your heart and lean not on your own understanding.'",
  "Philippians 4:13 - 'I can do all this through him who gives me strength. Psalm 46:10 - Be still, and know that I am God.'",
  "Nehemiah 8:10 - 'The joy of the Lord is your strength.'",
  "Psalm 118:24 - 'This is the day that the Lord has made; let us rejoice and be glad in it.'",
];

const activityImages = {
  "Practice mindful meditation for 10 minutes": "meditation.jpg",
  "Write a gratitude journal listing 3 things you're thankful for": "writing.jpg",
  "Go for a 15-minute walk in nature": "walking.jpg",
  "Try a simple breathing exercise: inhale for 4 counts, hold for 4, exhale for 4": "breathing.jpg",
  "Listen to your favorite uplifting music": "music.jpg",
  "Do a quick 5-minute stretching routine": "stretching.jpg",
  "Call a friend or family member to share your good mood": "phonecall.jpg",
  "Start planning a fun activity or trip": "planactivity.jpg",
  "Volunteer or help someone in need": "helpingothers.jpg",
  "Learn something new - watch an educational video or start an online course": "learning.jpg"
};

function logMood(moodValue, moodName) {
  const moodIndex = moodValue - 1;
  currentMoodDisplay.textContent = `Current Mood: ${moodName}`;
  adviceText.textContent = advices[moodIndex];

  activitiesList.innerHTML = '';
  activities[moodIndex].forEach(activity => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = activity;
    button.className = 'activity-button';
    button.onclick = () => showActivityPopup(activity);
    li.appendChild(button);
    activitiesList.appendChild(li);
  });

  scriptureElement.textContent = scriptures[moodIndex];

  const timestamp = new Date().toISOString();
  const moodData = { timestamp, mood: moodValue, moodName: moodName };
  saveMoodData(moodData);
  updateMoodHistory();

  const selectedButton = document.querySelector(`[data-mood="${moodValue}"]`);
  selectedButton.style.transform = 'scale(1.1)';
  setTimeout(() => {
    selectedButton.style.transform = 'scale(1)';
  }, 200);
}

function showActivityPopup(activity) {
  const popup = document.getElementById('activity-popup');
  popup.style.display = 'block';

  // Hide all popups
  document.querySelectorAll('.popup-content').forEach(p => p.style.display = 'none'); 

  if (activity === "Practice mindful meditation for 10 minutes") {
    document.getElementById('meditation-popup').style.display = 'block';
    // Set the click handler for the "Start Activity" button in the meditation popup
    document.getElementById('start-meditation').onclick = function() {
        startActivity(activity);
        // Disable the button
        this.disabled = true;
      this.classList.add('disabled-button');
    };
  } else if (activity === "Write a gratitude journal listing 3 things you're thankful for") {
    document.getElementById('gratitude-popup').style.display = 'block';
    // Set the click handler for the "Start Activity" button in the gratitude popup
    document.getElementById('start-gratitude').onclick = () => startActivity(activity);
    
  } else if (activity === "Go for a 15-minute walk in nature") {
    document.getElementById('walk-popup').style.display = 'block';
    // Set the click handler for the "Start Activity" button in the walk popup
    document.getElementById('start-walk').onclick = () => startActivity(activity);
    
    } else if (activity === "Try a simple breathing exercise: inhale for 4 counts, hold for 4, exhale for 4") {
      document.getElementById('breathe-popup').style.display = 'block';
      // Set the click handler for the "Start Activity" button in the breathe popup
      document.getElementById('start-breathe').onclick = () => startActivity(activity);
    
    } else if (activity === "Listen to your favorite uplifting music") {
      document.getElementById('music-popup').style.display = 'block';
      // Set the click handler for the "Start Activity" button in the music popup
    
    } else if (activity === "Do a quick 5-minute stretching routine") {
      document.getElementById('stretch-popup').style.display = 'block';
      // Set the click handler for the "Start Activity" button in the stretch popup
    
    } else if (activity === "Call a friend or family member to share your good mood") {
      document.getElementById('call-popup').style.display = 'block';
      // Set the click handler for the "Start Activity" button in the stretch popup

    } else if (activity === "Start planning a fun activity or trip") {
      document.getElementById('plan-popup').style.display = 'block';
      // Set the click handler for the "Start Activity" button in the stretch popup

    } else if (activity === "Volunteer or help someone in need") {
      document.getElementById('volunteer-popup').style.display = 'block';
      // Set the click handler for the "Start Activity" button in the stretch popup

    } else if (activity === "Learn something new - watch an educational video or start an online course") {
      document.getElementById('learn-popup').style.display = 'block';
      // Set the click handler for the "Start Activity" button in the stretch popup
  }
  // ... Add more conditions for other activities ...
}

function showLoader() {
  loader.style.display = 'flex';

  setTimeout(() => {
    loader.style.display = 'none';
  }, 2000);
}

window.addEventListener('load', showLoader);

function startActivity(activity) {
  const popup = document.getElementById('activity-popup');
  popup.style.display = 'none';
  const meditationMusic = document.getElementById("meditationMusic");
  let timerInterval = null; // Store timer interval
  let isPlaying = false; // Track whether audio is playing

  if (activity === "Practice mindful meditation for 10 minutes") {
    // Start playing the meditation music
    meditationMusic.play(); 
    isPlaying = true;
    // Show the pause/play button
    document.getElementById("pause-music").style.display = "inline-block";
    document.getElementById("stop-music").style.display = "inline-block";

    // Handle pause/play button click
    const pausePlayButton = document.getElementById("pause-music");
    pausePlayButton.onclick = () => {
      if (isPlaying) {
        // Pause the audio and timer
        meditationMusic.pause();
        clearInterval(timerInterval); // Pause the timer
        pausePlayButton.textContent = "Play"; // Change button text
      } else {
        // Play the audio and timer
        meditationMusic.play();
        timerInterval = setInterval(updateTimer, 1000); // Restart the timer
        pausePlayButton.textContent = "Pause"; // Change button text
      }
      isPlaying = !isPlaying; // Toggle the isPlaying flag
    };

    // Handle stop button click
    const stopButton = document.getElementById("stop-music");
    stopButton.onclick = () => {
      meditationMusic.pause(); // Stop the music
      meditationMusic.currentTime = 0; // Reset to the beginning
      stopButton.style.display = "none";
      pausePlayButton.style.display = "none";
      clearInterval(timerInterval); // Stop the timer
      pausePlayButton.textContent = "Pause"; // Reset button text
      isPlaying = false; // Reset isPlaying flag
    };

    // Add your timer logic here (e.g., display a countdown timer)
    let timerSeconds = 600; // 10 minutes in seconds
    const timerDisplay = document.getElementById("timer"); 
    function updateTimer() {
      const minutes = Math.floor(timerSeconds / 60);
      const seconds = timerSeconds % 60;
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      timerSeconds--;
      if (timerSeconds < 0) {
        clearInterval(timerInterval); // Stop the timer when it reaches 0
        meditationMusic.pause(); // Stop the music
      }
    }
    timerInterval = setInterval(updateTimer, 1000); // Start the timer

    // Handle user exiting the activity
    popup.addEventListener('click', (event) => {
      if (event.target === popup) {
        meditationMusic.pause();
        clearInterval(timerInterval); // Pause the timer
      }
    });
  } else if (activity === "Write a gratitude journal listing 3 things you're thankful for") {
    const gratitudeJournal = document.getElementById('gratitude-journal').value = localStorage.getItem("gratitudeText") || "";

    // ... (any additional logic for gratitude activity)
  } else if (activity === "Go for a 15-minute walk in nature") {
    // ... (walk activity logic)
  }
  // ... add more activities
}

function saveGratitude() {
  const gratitudeJournal = document.getElementById("gratitude-journal");
  localStorage.setItem("gratitudeText", gratitudeJournal.value);
}

function saveMoodData(moodData) {
  moodHistory.push(moodData);
  localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
}

function updateMoodHistory() {
  moodHistoryList.innerHTML = '';
  moodHistory.slice().reverse().forEach(data => {
    const li = document.createElement('li');
    const date = new Date(data.timestamp);
    li.textContent = `${date.toLocaleString()}: ${data.moodName}`;
    moodHistoryList.appendChild(li);
  });
}

function resetMoodHistory() {
  localStorage.removeItem('moodHistory');
  moodHistory.length = 0;
  updateMoodHistory();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

function showDisclaimer() {
  disclaimerModal.style.display = "block";
}

closeBtn.onclick = function() {
  disclaimerModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == disclaimerModal) {
    disclaimerModal.style.display = "none";
  }
  const popup = document.getElementById('activity-popup');
  if (event.target == popup) {
    popup.style.display = 'none';
  }
}

updateMoodHistory();

document.getElementById('openContactsBtn').addEventListener('click', async () => {
    if ('contacts' in navigator && 'select' in navigator.contacts) {
        try {
            const props = ['name', 'email', 'tel'];
            const opts = {multiple: true}; // To allow multiple contacts selection
            const contacts = await navigator.contacts.select(props, opts);
            console.log(contacts); // Handle the selected contacts here
        } catch (err) {
            console.error('Error selecting contacts: ', err);
        }
    } else {
        alert('Contact Picker API is not supported on this browser.');
    }
});

const {
  bg_color,
  text_color,
  hint_color,
  button_color,
  button_text_color,
  secondary_bg_color,
} = Telegram.WebApp.themeParams;


const tg = window.Telegram.WebApp;
tg.isExpanded;
tg.expand();