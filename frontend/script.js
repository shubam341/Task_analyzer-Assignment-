let tasks = [];
let analyzedTasks = [];
let currentSortStrategy = 'smart';

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCount = document.getElementById('task-count');
const analyzeBtn = document.getElementById('analyze-btn');
const resultsSection = document.getElementById('results-section');
const resultsGrid = document.getElementById('results-grid');
const loadingState = document.getElementById('loading-state');
const sortStrategySelect = document.getElementById('sort-strategy');
const bulkInputToggle = document.getElementById('bulk-input-toggle');
const bulkInputSection = document.getElementById('bulk-input-section');
const loadBulkBtn = document.getElementById('load-bulk-btn');
const themeToggle = document.getElementById('theme-toggle');
const importanceSlider = document.getElementById('task-importance');
const importanceValue = document.getElementById('importance-value');

function initTheme() {
  const isDark = localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}



themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

importanceSlider.addEventListener('input', (e) => {
  importanceValue.textContent = e.target.value;
  const percentage = ((e.target.value - 1) / 9) * 100;
  e.target.style.background = `linear-gradient(to right, rgb(37, 99, 235) ${percentage}%, rgb(229, 231, 235) ${percentage}%)`;
});

bulkInputToggle.addEventListener('click', () => {
  bulkInputSection.classList.toggle('hidden');
});

loadBulkBtn.addEventListener('click', () => {
  const jsonInput = document.getElementById('bulk-json-input').value;
  try {
    const bulkTasks = JSON.parse(jsonInput);
    if (!Array.isArray(bulkTasks)) {
      throw new Error('Input must be an array');
    }

    bulkTasks.forEach(task => {
      if (task.title && task.due_date && task.estimated_hours && task.importance) {
        tasks.push({
          id: Date.now() + Math.random(),
          title: task.title,
          dueDate: task.due_date,
          estimatedHours: task.estimated_hours,
          importance: task.importance,
          dependencies: task.dependencies || []
        });
      }
    });

    updateTaskList();
    document.getElementById('bulk-json-input').value = '';
    bulkInputSection.classList.add('hidden');

    showNotification('Tasks loaded successfully!', 'success');
  } catch (error) {
    showNotification('Invalid JSON format. Please check your input.', 'error');
  }
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('task-title').value;
  const dueDate = document.getElementById('task-due-date').value;
  const estimatedHours = parseFloat(document.getElementById('task-hours').value);
  const importance = parseInt(document.getElementById('task-importance').value);
  const dependenciesInput = document.getElementById('task-dependencies').value;
  const dependencies = dependenciesInput ? dependenciesInput.split(',').map(d => d.trim()).filter(d => d) : [];

  const task = {
    id: Date.now(),
    title,
    dueDate,
    estimatedHours,
    importance,
    dependencies
  };

  tasks.push(task);
  updateTaskList();
  taskForm.reset();
  importanceValue.textContent = '5';

  showNotification('Task added successfully!', 'success');
});

function updateTaskList() {
  taskCount.textContent = tasks.length;
  analyzeBtn.disabled = tasks.length === 0;

  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    taskList.innerHTML = '';
    taskList.appendChild(emptyState);
    return;
  }

  emptyState.classList.add('hidden');
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.className = 'bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-all animate-slide-up border-l-4 border-blue-500';
    taskElement.innerHTML = `
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900 dark:text-white">${task.title}</h4>
        <div class="flex flex-wrap gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            ${formatDate(task.dueDate)}
          </span>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${task.estimatedHours}h
          </span>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            ${task.importance}/10
          </span>
        </div>
        ${task.dependencies.length > 0 ? `
          <div class="mt-2 flex flex-wrap gap-1">
            ${task.dependencies.map(dep => `<span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">${dep}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      <button onclick="removeTask(${index})" class="ml-4 text-red-500 hover:text-red-700 transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `;
    taskList.appendChild(taskElement);
  });
}

window.removeTask = function(index) {
  tasks.splice(index, 1);
  updateTaskList();
  showNotification('Task removed', 'info');
};

analyzeBtn.addEventListener('click', async () => {
  loadingState.classList.remove('hidden');
  resultsSection.classList.add('hidden');

  const formattedTasks = tasks.map(t => ({
    title: t.title,
    due_date: t.dueDate,
    estimated_hours: t.estimatedHours,
    importance: t.importance,
    dependencies: t.dependencies || []
  }));

  try {
    const response = await fetch('http://127.0.0.1:8000/api/tasks/analyze/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedTasks)
    });

    const result = await response.json();
    console.log("BACKEND RESULT:", result);

//backend return array
    const list = Array.isArray(result) ? result : result.analyzed_tasks;

    analyzedTasks = list.map(t => ({
      title: t.title,
      dueDate: t.due_date,
      estimatedHours: t.estimated_hours,
      importance: t.importance,
      dependencies: t.dependencies || [],
      priorityScore: t.score || 0,
       daysUntilDue: t.days_until_due,
      reasoning: t.reasoning || "AI Calculated Priority"
    }));

    displayResults(analyzedTasks);
    loadingState.classList.add('hidden');
    resultsSection.classList.remove('hidden');

  } catch (error) {
    console.error(error);
    showNotification("Backend format incorrect — check console!", "error");
    loadingState.classList.add('hidden');
  }
});




async function getRecommendations() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/tasks/suggest/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tasks)
        });

        const data = await response.json();
        console.log("Top Suggested:", data.top_tasks);
        showNotification("⭐ Recommendation Ready in Console!", "info");
    } 
    catch (err) {
        showNotification("Suggestion Error", "error");
    }
}


async function getSuggestions(tasks) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/tasks/suggest/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks })
    });

    return await response.json();
  } catch (e) {
    showNotification("Suggestion API not reachable", "error");
  }
}


sortStrategySelect.addEventListener('change', (e) => {
  currentSortStrategy = e.target.value;
  displayResults(analyzedTasks);
});

function analyzeTasks(taskList) {
  const today = new Date();

  return taskList.map(task => {
    const dueDate = new Date(task.dueDate);
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    const urgencyScore = Math.max(0, 100 - (daysUntilDue * 2));
    const importanceScore = task.importance * 10;
    const efficiencyScore = 100 / task.estimatedHours;
    const dependencyPenalty = task.dependencies.length * 5;

    const priorityScore = (
      (urgencyScore * 0.35) +
      (importanceScore * 0.40) +
      (efficiencyScore * 0.25) -
      dependencyPenalty
    );

    let reasoning = [];
    if (daysUntilDue <= 3) reasoning.push('Extremely urgent deadline');
    else if (daysUntilDue <= 7) reasoning.push('Approaching deadline');

    if (task.importance >= 8) reasoning.push('High importance');
    if (task.estimatedHours <= 2) reasoning.push('Quick win');
    if (task.dependencies.length > 0) reasoning.push(`Depends on ${task.dependencies.length} task(s)`);

    const isWeekend = dueDate.getDay() === 0 || dueDate.getDay() === 6;
    if (isWeekend) reasoning.push('Due on weekend');

    const hasCycle = detectCircularDependency(task, taskList);
    if (hasCycle) reasoning.push('⚠️ Circular dependency detected');

    return {
      ...task,
      priorityScore: Math.min(100, Math.max(0, priorityScore)),
      reasoning: reasoning.length > 0 ? reasoning.join(' • ') : 'Standard priority task',
      daysUntilDue,
      hasCycle
    };
  });
}

function detectCircularDependency(task, allTasks) {
  const visited = new Set();
  const recursionStack = new Set();

  function hasCycle(currentTaskTitle) {
    if (recursionStack.has(currentTaskTitle)) return true;
    if (visited.has(currentTaskTitle)) return false;

    visited.add(currentTaskTitle);
    recursionStack.add(currentTaskTitle);

    const currentTask = allTasks.find(t => t.title === currentTaskTitle);
    if (currentTask && currentTask.dependencies) {
      for (const dep of currentTask.dependencies) {
        if (hasCycle(dep)) return true;
      }
    }

    recursionStack.delete(currentTaskTitle);
    return false;
  }

  return hasCycle(task.title);
}

function sortTasks(tasks, strategy) {
  const sorted = [...tasks];

  switch(strategy) {
    case 'fastest':
      return sorted.sort((a, b) => a.estimatedHours - b.estimatedHours);
    case 'impact':
      return sorted.sort((a, b) => b.importance - a.importance);
    case 'deadline':
      return sorted.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    case 'smart':
    default:
      return sorted.sort((a, b) => b.priorityScore - a.priorityScore);
  }
}

function displayResults(tasks) {
  const sortedTasks = sortTasks(tasks, currentSortStrategy);
  resultsGrid.innerHTML = '';


  
  sortedTasks.forEach((task, index) => {
    const priorityClass = getPriorityClass(task.priorityScore);
    const card = document.createElement('div');
    card.className = `bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 ${priorityClass.border} hover:scale-105 transition-all duration-300 animate-scale-in relative overflow-hidden`;
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div class="absolute top-0 right-0 w-20 h-20 ${priorityClass.bg} opacity-10 rounded-bl-full"></div>

      ${task.hasCycle ? `
        <div class="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          ⚠️ CYCLE
        </div>
      ` : ''}

      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center">
          <span class="text-3xl font-bold ${priorityClass.text} mr-3">#${index + 1}</span>
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${task.title}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">${task.reasoning}</p>
          </div>
        </div>
      </div>

      <div class="space-y-3 mb-4">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">Priority Score</span>
          <div class="flex items-center">
            <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-2">
              <div class="${priorityClass.bg} h-full rounded-full transition-all duration-1000" style="width: ${task.priorityScore}%"></div>
            </div>
            <span class="text-lg font-bold ${priorityClass.text}">${Math.round(task.priorityScore)}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex items-center text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            ${formatDate(task.dueDate)}
          </div>
          <div class="flex items-center text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${task.estimatedHours}h
          </div>
          <div class="flex items-center text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            ${task.importance}/10
          </div>
          <div class="flex items-center text-gray-600 dark:text-gray-400">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            ${task.daysUntilDue} days left
          </div>
        </div>
      </div>

      ${task.dependencies.length > 0 ? `
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Dependencies:</p>
          <div class="flex flex-wrap gap-1">
            ${task.dependencies.map(dep => `<span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">${dep}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
        <button onclick="provideFeedback('${task.id}', 'yes')" class="flex-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
          👍 Helpful
        </button>
        <button onclick="provideFeedback('${task.id}', 'no')" class="flex-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
          👎 Not Helpful
        </button>
      </div>
    `;

    resultsGrid.appendChild(card);
  });

   const recommendationBox = document.getElementById("recommendation-box");
  const bestTask = sortedTasks[0];

  if (!bestTask) {
      recommendationBox.innerHTML = `<p class="text-gray-400">No tasks analyzed</p>`;
  } else {
      recommendationBox.innerHTML = `
      <div class="p-4 bg-gray-800 border border-gray-600 rounded-xl">
          <p class="text-xl font-bold text-white">🔥 Next Best Task</p>
          <p class="text-gray-300 text-lg mt-1">${bestTask.title}</p>

          <div class="text-xs text-gray-400 mt-3 leading-5">
              ⭐ Score: <b>${Math.round(bestTask.priorityScore)}</b><br>
              ⏳ ${bestTask.daysUntilDue} days left<br>
              ⚡ Importance: ${bestTask.importance}/10
          </div>
      </div>`;
  }
}


window.provideFeedback = function(taskId, feedback) {
  console.log(`Feedback for task ${taskId}: ${feedback}`);
  showNotification(`Thank you for your feedback!`, 'success');
};

function getPriorityClass(score) {
  if (score >= 70) {
    return {
      bg: 'bg-red-500',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-500'
    };
  } else if (score >= 40) {
    return {
      bg: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500'
    };
  } else {
    return {
      bg: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
      border: 'border-green-500'
    };
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    notification.style.transition = 'all 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

initTheme();
