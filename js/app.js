// ==========================================
// PROJECT 3: PERSONAL DATA DASHBOARD
// LAB16: fetch() and JSON Basics
// ==========================================

console.log('Dashboard app loaded!');
console.log('LAB16: Learning fetch() API');

// Theme Management
function initializeTheme() {
  const savedTheme = localStorage.getItem('dashboardTheme');

  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
    updateThemeIcon('dark');
  } else {
    updateThemeIcon('light');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('theme-dark');
  localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

initializeTheme();
setupThemeToggle();

// -----------------------------
// WELCOME MESSAGE FEATURE
// -----------------------------

function loadUserName() {
  let name = localStorage.getItem("userName");

  if (!name) {
    name = prompt("Welcome! What is your name?");
    if (name && name.trim() !== "") {
      localStorage.setItem("userName", name.trim());
    } else {
      name = "Guest";
    }
  }

  updateWelcomeMessage(name);
}

function updateWelcomeMessage(name) {
  document.getElementById("welcome-message").textContent =
    `Welcome back, ${name}!`;
}

document.getElementById("change-name-btn").addEventListener("click", () => {
  const newName = prompt("Enter your name:");
  if (newName && newName.trim() !== "") {
    localStorage.setItem("userName", newName.trim());
    updateWelcomeMessage(newName.trim());
  }
});

loadUserName();

// ========================================
// WEATHER WIDGET
// ========================================

function loadWeather() {
  fetch('./data/weather.json')
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => {
      console.error('Error loading weather:', error);
      displayWeatherError();
    });
}

function displayWeather(weatherData) {
  const weatherDisplay = document.getElementById('weather-display');

  weatherDisplay.innerHTML = `
    <div id="weather-current"></div>
    <div id="weather-forecast"></div>
  `;

  renderCurrentWeather(weatherData.current);
  renderForecast(weatherData.forecast);
}

function renderCurrentWeather(current) {
  const currentEl = document.getElementById('weather-current');

  currentEl.innerHTML = `
    <div class="weather-current">
        <div class="weather-icon">${current.icon}</div>
        <div class="weather-temp">${current.temperature}°F</div>
        <div class="weather-location">${current.location}</div>
        <div class="weather-condition">${current.condition}</div>
    </div>

    <div class="weather-details">
        <div class="weather-detail">
            <span>💧 Humidity</span>
            <strong>${current.humidity}%</strong>
        </div>
        <div class="weather-detail">
            <span>💨 Wind Speed</span>
            <strong>${current.wind} mph</strong>
        </div>
        <div class="weather-detail">
            <span>🌡️ Feels Like</span>
            <strong>${current.feelsLike}°F</strong>
        </div>
    </div>
  `;
}

function renderForecast(forecastArray) {
  const forecastEl = document.getElementById('weather-forecast');

  if (!forecastArray || forecastArray.length === 0) {
    forecastEl.innerHTML = "<p>No forecast available.</p>";
    return;
  }

  const forecastHTML = forecastArray.map(day => `
      <div class="forecast-day">
          <div class="forecast-icon">${day.icon}</div>
          <div class="forecast-day-name">${day.day}</div>
          <div class="forecast-condition">${day.condition}</div>
          <div class="forecast-temps">High: ${day.high}° · Low: ${day.low}°</div>
      </div>
  `).join("");

  forecastEl.innerHTML = `<div class="weather-forecast">${forecastHTML}</div>`;
}

function displayWeatherError() {
  document.getElementById('weather-display').innerHTML = `
    <div class="error-message">
        <div class="error-icon">⚠️</div>
        <p>Could not load weather data</p>
        <p class="error-hint">Check console for details</p>
    </div>
  `;
}

loadWeather();

// ========================================
// QUOTES WIDGET
// ========================================

let allQuotes = [];
let currentQuoteIndex = -1;

function loadQuotes() {
  fetch('data/quotes.json')
    .then(r => r.json())
    .then(data => {
      allQuotes = data;
      displayRandomQuote();
    })
    .catch(error => {
      console.error('Quotes error:', error);
      displayQuotesError();
    });
}

function displayRandomQuote() {
  if (allQuotes.length === 0) return;

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allQuotes.length);
  } while (randomIndex === currentQuoteIndex && allQuotes.length > 1);

  currentQuoteIndex = randomIndex;
  const quote = allQuotes[randomIndex];

  document.getElementById('quotes-display').innerHTML = `
    <div class="quote-card">
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>
  `;
}

function displayQuotesError() {
  document.getElementById('quotes-display').innerHTML =
    `<div class="error-message">⚠️ Could not load quotes</div>`;
}

loadQuotes();

function setupQuotesButton() {
  document.getElementById('new-quote-btn')
    .addEventListener('click', displayRandomQuote);
}

setupQuotesButton();

// ========================================
// TASKS WIDGET (NOW WITH CATEGORY + DUE DATE)
// ========================================

function loadTasks() {
  const tasksJSON = localStorage.getItem('dashboardTasks');
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}

function saveTasks(tasks) {
  localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
}

function displayTasks() {
  const tasks = loadTasks();
  const tasksList = document.getElementById('tasks-list');

  if (tasks.length === 0) {
    tasksList.innerHTML = `<div class="no-tasks">No tasks yet. Add one above! ✨</div>`;
    updateTaskStats(tasks);
    return;
  }

  tasksList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Overdue highlighting
    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      taskItem.classList.add('overdue');
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index));

    // Task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Category badge
    const categoryBadge = document.createElement('span');
    categoryBadge.className = `task-category ${task.category}`;
    categoryBadge.textContent = task.category;

    // Due date
    const dueDate = document.createElement('span');
    dueDate.className = 'task-date';
    dueDate.textContent = task.dueDate ? `Due: ${task.dueDate}` : 'No due date';

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    // Append children
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(categoryBadge);
    taskItem.appendChild(dueDate);
    taskItem.appendChild(deleteBtn);

    tasksList.appendChild(taskItem);
  });

  updateTaskStats(tasks);
}

function addTask(taskText) {
  const tasks = loadTasks();

  const newTask = {
    text: taskText,
    completed: false,
    id: Date.now(),
    category: document.getElementById('task-category').value,
    dueDate: document.getElementById('task-date').value
  };

  tasks.push(newTask);
  saveTasks(tasks);
  displayTasks();
}

function setupTaskForm() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
      addTask(taskText);
      taskInput.value = '';
      taskInput.focus();
    }
  });
}

function toggleTask(index) {
  const tasks = loadTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  displayTasks();
}

function deleteTask(index) {
  const tasks = loadTasks();
  if (confirm(`Delete task: "${tasks[index].text}"?`)) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();
  }
}

function updateTaskStats(tasks) {
  const statsDiv = document.getElementById('task-stats');

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  if (total === 0) {
    statsDiv.innerHTML = '';
    return;
  }

  const percentage = Math.round((completed / total) * 100);

  statsDiv.innerHTML = `
    <div class="stat">Total: <strong>${total}</strong></div>
    <div class="stat">Completed: <strong>${completed}</strong></div>
    <div class="stat">Pending: <strong>${pending}</strong></div>
    <div class="stat">Progress: <strong>${percentage}%</strong></div>
  `;
}

displayTasks();
setupTaskForm();
