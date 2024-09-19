const TIME_KEY = 'tab_timer_data';

// Create a container for the timer (for testing/debugging purposes only)
const timerContainer = document.createElement('div');
timerContainer.id = 'tab-timer';
timerContainer.style.position = 'fixed';
timerContainer.style.bottom = '0';
timerContainer.style.right = '0';
timerContainer.style.backgroundColor = '#000';
timerContainer.style.color = '#fff';
timerContainer.style.padding = '10px';
timerContainer.style.border = '1px solid #333';
timerContainer.style.borderRadius = '5px';
timerContainer.style.zIndex = '999999';
timerContainer.style.fontSize = '16px';
timerContainer.style.fontFamily = 'Arial, sans-serif';
timerContainer.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
timerContainer.style.display = 'flex';
timerContainer.style.alignItems = 'center';
timerContainer.style.justifyContent = 'center';
timerContainer.style.width = 'auto';
timerContainer.style.height = 'auto';
document.body.appendChild(timerContainer);

let originalTitle = document.title;
let startTime = Date.now();
let elapsedTime = 0;
let timerInterval;

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(updateTabTitleAndContainer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  elapsedTime = Date.now() - startTime;
}

function updateTabTitleAndContainer() {
  const totalElapsedTime = Date.now() - startTime + elapsedTime;
  const formattedTime = formatTime(totalElapsedTime);
  
  // Update the tab title, combining original title and elapsed time
  document.title = `${originalTitle} - Time Spent: ${formattedTime}`;
  
  // Update the timerContainer for debugging (shows current time on page)
  timerContainer.textContent = `Current Time: ${formattedTime}`;
}

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const secondsDisplay = seconds % 60;
  const minutesDisplay = minutes % 60;

  // Build the formatted time string
  let formattedTime = '';
  if (hours > 0) {
    formattedTime += `${hours}h `;
  }
  if (minutes > 0 || hours > 0) {
    formattedTime += `${minutesDisplay}m `;
  }
  formattedTime += `${secondsDisplay}s`;

  return formattedTime.trim();
}

// Event listener for visibility change (pauses the timer when tab is inactive)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopTimer();
  } else {
    startTimer();
  }
});

// Start the timer initially
startTimer();
