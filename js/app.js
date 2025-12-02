// ==========================================
// PROJECT 3: PERSONAL DATA DASHBOARD
// LAB16: fetch() and JSON Basics
// ==========================================

console.log('Dashboard app loaded!');
console.log('LAB16: Learning fetch() API');

// Theme Management
function initializeTheme() {
  // Check for saved theme preference
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

  // Save preference
  localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');

  // Update icon
  updateThemeIcon(isDark ? 'dark' : 'light');

  console.log('Theme switched to:', isDark ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');

  if (theme === 'dark') {
    themeIcon.textContent = '☀️'; // Sun for dark mode (to switch to light)
  } else {
    themeIcon.textContent = '🌙'; // Moon for light mode (to switch to dark)
  }
}

function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}

// Call these when page loads
initializeTheme();
setupThemeToggle();

// -----------------------------
// WELCOME MESSAGE FEATURE
// -----------------------------

function loadUserName() {
  let name = localStorage.getItem("userName");

  // If no name stored, ask the user
  if (!name) {
    name = prompt("Welcome! What is your name?");
    if (name && name.trim() !== "") {
      localStorage.setItem("userName", name.trim());
    } else {
      name = "Guest"; // fallback
    }
  }

  updateWelcomeMessage(name);
}

function updateWelcomeMessage(name) {
  const welcomeEl = document.getElementById("welcome-message");
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome back, ${name}!`;
  }
}

const changeNameBtn = document.getElementById("change-name-btn");
if (changeNameBtn) {
  changeNameBtn.addEventListener("click", () => {
    const newName = prompt("Enter your name:");

    if (newName && newName.trim() !== "") {
      localStorage.setItem("userName", newName.trim());
      updateWelcomeMessage(newName.trim());
    }
  });
}

// Run on page load
loadUserName();

// ========================================
// WEATHER WIDGET (with 3-day forecast)
// ========================================

// Function to load weather data
function loadWeather() {
  console.log('🌤️ Loading weather data...');

  fetch('./data/weather.json')
    .then(response => {
      console.log('✅ Got response:', response);
      return response.json();
    })
    .then(data => {
      console.log('✅ Weather data loaded:', data);
      displayWeather(data);  // receives full object with current + forecast
    })
    .catch(error => {
      console.error('❌ Error loading weather:', error);
      displayWeatherError();
    });
}

// Function to display weather data in the DOM
function displayWeather(weatherData) {
  console.log('📊 Displaying weather data...');

  const weatherDisplay = document.getElementById('weather-display');
  if (!weatherDisplay) return;

  // Clear container and rebuild structure
  weatherDisplay.innerHTML = `
    <div id="weather-current"></div>
    <div id="weather-forecast"></div>
  `;

  // Render current + 3-day forecast
  renderCurrentWeather(weatherData.current);
  renderForecast(weatherData.forecast);

  console.log('✅ Weather displayed successfully!');
}

// Render current weather
function renderCurrentWeather(current) {
  const currentEl = document.getElementById('weather-current');
  if (!currentEl) return;

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

// Render 3-Day Forecast
function renderForecast(forecastArray) {
  const forecastEl = document.getElementById('weather-forecast');
  if (!forecastEl) return;

  if (!forecastArray || forecastArray.length === 0) {
    forecastEl.innerHTML = "<p>No forecast data available.</p>";
    return;
  }

  const forecastHTML = forecastArray
    .map(day => {
      return `
        <div class="forecast-day">
          <div class="forecast-icon">${day.icon}</div>
          <div class="forecast-day-name">${day.day}</div>
          <div class="forecast-condition">${day.condition}</div>
          <div class="forecast-temps">
            High: ${day.high}° · Low: ${day.low}°
          </div>
        </div>
      `;
    })
    .join("");

  forecastEl.innerHTML = `
    <div class="weather-forecast">
      ${forecastHTML}
    </div>
  `;
}

// Function to show error message if weather data fails to load
function displayWeatherError() {
  const weatherDisplay = document.getElementById('weather-display');
  if (!weatherDisplay) return;

  weatherDisplay.innerHTML = `
    <div class="error-message">
      <div class="error-icon">⚠️</div>
      <p>Could not load weather data</p>
      <p class="error-hint">Check console for details</p>
    </div>
  `;
}

// Load weather data when page loads
loadWeather();

// ========================================
// QUOTES WIDGET
// ========================================

// Global variable to store all quotes
let allQuotes = [];
let currentQuoteIndex = -1; // Track current quote to avoid repeats

// Function to load quotes from JSON
function loadQuotes() {
  console.log('Loading quotes...');

  fetch('data/quotes.json')
    .then(response => {
      console.log('Got quotes response:', response);
      return response.json();
    })
    .then(data => {
      console.log('Quotes data:', data);
      allQuotes = data; // Store quotes in global variable
      displayRandomQuote(); // Show first quote
    })
    .catch(error => {
      console.error('Error loading quotes:', error);
      displayQuotesError();
    });
}

// Function to display a random quote
function displayRandomQuote() {
  // Make sure we have quotes loaded
  if (allQuotes.length === 0) {
    console.error('No quotes available');
    return;
  }

  // Get random index (different from current)
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allQuotes.length);
  } while (randomIndex === currentQuoteIndex && allQuotes.length > 1);

  currentQuoteIndex = randomIndex;
  const quote = allQuotes[randomIndex];

  // Display the quote
  const quotesDisplay = document.getElementById('quotes-display');
  if (!quotesDisplay) return;

  quotesDisplay.innerHTML = `
    <div class="quote-card">
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>
  `;

  console.log('Displayed quote:', quote);
}

// Function to show error message
function displayQuotesError() {
  const quotesDisplay = document.getElementById('quotes-display');
  if (!quotesDisplay) return;

  quotesDisplay.innerHTML = `
    <div class="error-message">
      ⚠️ Could not load quotes
    </div>
  `;
}

// Call loadQuotes when page loads
loadQuotes();

// Set up "New Quote" button
function setupQuotesButton() {
  const newQuoteBtn = document.getElementById('new-quote-btn');
  if (!newQuoteBtn) return;

  newQuoteBtn.addEventListener('click', () => {
    console.log('New quote button clicked!');
    displayRandomQuote();
  });
}

// Call setupQuotesButton after DOM is loaded
setupQuotesButton();

// ========================================
// TASKS WIDGET (with categories + due dates + filters)
// ========================================

// Global filter state
let currentCategoryFilter = 'all';

// Function to load tasks from localStorage
function loadTasks() {
  const tasksJSON = localStorage.getItem('dashboardTasks');

  if (tasksJSON) {
    return JSON.parse(tasksJSON);
  } else {
    return []; // Return empty array if no tasks yet
  }
}

// Function to save tasks to localStorage
function saveTasks(tasks) {
  localStorage.setItem('dashboardTasks', JSON.stringify(tasks));
  console.log('Tasks saved:', tasks);
}

// Function to display all tasks (respects currentCategoryFilter)
function displayTasks() {
  const allTasks = loadTasks();
  const tasksList = document.getElementById('tasks-list');
  if (!tasksList) return;

  // If no tasks at all
  if (allTasks.length === 0) {
    tasksList.innerHTML = `
      <div class="no-tasks">
        No tasks yet. Add one above! ✨
      </div>
    `;
    updateTaskStats(allTasks);
    return;
  }

  // Filter by category if needed
  let tasksToRender = allTasks;
  if (currentCategoryFilter !== 'all') {
    tasksToRender = allTasks.filter(task => task.category === currentCategoryFilter);
    console.log("Category filter:", currentCategoryFilter, "Tasks count:", tasksToRender.length);
  }

  // Clear existing tasks
  tasksList.innerHTML = '';

  const today = new Date();

  // If filter applied and no matches
  if (tasksToRender.length === 0) {
    tasksList.innerHTML = `
      <div class="no-tasks">
        No tasks in this category yet.
      </div>
    `;
    updateTaskStats(allTasks); // stats still based on all tasks
    return;
  }

  // Display each task in tasksToRender
  tasksToRender.forEach((task) => {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Overdue highlighting
    if (task.dueDate && new Date(task.dueDate) < today && !task.completed) {
      taskItem.classList.add('overdue');
      console.log("Overdue task:", task.text);
    }

    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;

    // Use ID to find correct index on toggle/delete
    checkbox.addEventListener('change', () => toggleTaskById(task.id));

    // Create task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Category badge
    const categoryBadge = document.createElement('span');
    categoryBadge.className = `task-category ${task.category}`;
    categoryBadge.textContent = task.category || 'uncategorized';
    console.log("Category:", task.category);

    // Due date display
    const dueDate = document.createElement('span');
    dueDate.className = 'task-date';
    dueDate.textContent = task.dueDate ? `Due: ${task.dueDate}` : 'No due date';
    console.log("Due date:", task.dueDate);

    // Meta container (NEW) for category + date
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.appendChild(categoryBadge);
    meta.appendChild(dueDate);

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTaskById(task.id));

    // Append all elements to task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(meta);
    taskItem.appendChild(deleteBtn);

    tasksList.appendChild(taskItem);
  });

  // Stats are based on ALL tasks, not just filtered
  updateTaskStats(allTasks);
}

// Function to add a new task
function addTask(taskText) {
  const tasks = loadTasks();

  const categorySelect = document.getElementById('task-category');
  const dateInput = document.getElementById('task-date');

  const newTask = {
    text: taskText,
    completed: false,
    id: Date.now(), // Unique ID using timestamp
    category: categorySelect ? categorySelect.value : 'other',
    dueDate: dateInput ? dateInput.value : ''
  };

  console.log("Category:", newTask.category);
  console.log("Due date:", newTask.dueDate);

  tasks.push(newTask);
  saveTasks(tasks);
  displayTasks();

  console.log('Task added:', newTask);
}

// Set up form submission
function setupTaskForm() {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');

  if (!taskForm || !taskInput) return;

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload

    const taskText = taskInput.value.trim();

    if (taskText) {
      addTask(taskText);
      taskInput.value = ''; // Clear input
      taskInput.focus(); // Focus back on input
    }
  });
}

// Toggle task by ID (works with filtered view)
function toggleTaskById(taskId) {
  const tasks = loadTasks();
  const index = tasks.findIndex(task => task.id === taskId);
  if (index === -1) return;

  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  displayTasks();

  console.log('Task toggled:', tasks[index]);
}

// Delete task by ID (works with filtered view)
function deleteTaskById(taskId) {
  const tasks = loadTasks();
  const index = tasks.findIndex(task => task.id === taskId);
  if (index === -1) return;

  const taskToDelete = tasks[index];

  if (confirm(`Delete task: "${taskToDelete.text}"?`)) {
    tasks.splice(index, 1);
    saveTasks(tasks);
    displayTasks();

    console.log('Task deleted');
  }
}

// Function to update task statistics
function updateTaskStats(tasks) {
  const statsDiv = document.getElementById('task-stats');
  if (!statsDiv) return;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (totalTasks === 0) {
    statsDiv.innerHTML = '';
    return;
  }

  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  statsDiv.innerHTML = `
    <div class="stat">Total: <strong>${totalTasks}</strong></div>
    <div class="stat">Completed: <strong>${completedTasks}</strong></div>
    <div class="stat">Pending: <strong>${pendingTasks}</strong></div>
    <div class="stat">Progress: <strong>${completionPercentage}%</strong></div>
  `;
}

// Set up category filter buttons
function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll('.category-filters button');
  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.dataset.filter || 'all';
      currentCategoryFilter = filterValue;

      console.log("Category filter set to:", currentCategoryFilter);

      // Update active class
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Re-render tasks with new filter
      displayTasks();
    });
  });
}

// Initialize tasks and filters when page loads
displayTasks();
setupTaskForm();
setupCategoryFilters();
