import { appState, registerRenderer } from './state.js';
import { simulateRole } from './data.js';

export function mount() {
  registerRenderer(renderApp);
  renderApp();
}

function nav() {
  return `
  <header class="p-4 flex justify-between bg-gray-800 border-b border-gray-700">
    <h1 class="text-lg font-semibold text-primary-500">IPA System</h1>
    <nav class="flex gap-2">
      <a data-link="home" class="hover:text-primary-400">Home</a>
      <a data-link="login" class="hover:text-primary-400">Login</a>
    </nav>
  </header>`;
}

function home() {
  return `<section class="p-6 card gradient-card text-center">
    <h2 class="text-2xl font-bold">Integrated Predictive Attendance</h2>
    <p class="mt-2 text-gray-300">Biometric check-in, gamification, and predictive alerts to boost attendance.</p>
  </section>`;
}

function login() {
  return `<section class="card p-6 gradient-card max-w-md">
    <h2 class="text-xl font-semibold">Select Your Role</h2>
    <div class="mt-4 flex flex-wrap gap-2">
      <button class="btn-primary" data-role="admin">Admin</button>
      <button class="btn-primary" data-role="teacher">Teacher</button>
      <button class="btn-primary" data-role="student">Student</button>
      <button class="btn-primary" data-role="parent">Parent</button>
    </div>
  </section>`;
}

export function renderApp() {
  const root = document.getElementById('app-container');
  const view = appState.view;
  root.innerHTML = nav() + (view === 'home' ? home() : login());
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      appState.view = e.target.getAttribute('data-link');
      renderApp();
    });
  });

  document.querySelectorAll('[data-role]').forEach((btn) => {
    btn.addEventListener('click', () => simulateRole(btn.getAttribute('data-role')));
  });
}