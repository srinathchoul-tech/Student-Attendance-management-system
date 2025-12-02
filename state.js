export const appState = {
  userId: null,
  role: 'unauthenticated',
  view: 'home',
  user: {},
  loading: false,
  dashboard: {
    riskAlerts: [],
    attendanceStats: {},
    students: [],
    parentStudent: null,
  }
};

export function setView(v) {
  appState.view = v;
  requestRender();
}

let renderFn;
export function registerRenderer(fn) { renderFn = fn; }
export function requestRender() { if (typeof renderFn === 'function') renderFn(); }

export function toast(msg, type = 'info') {
  const el = document.getElementById('toast-root');
  if (!el) return;
  const color = type === 'error' ? 'bg-red-600' : type === 'warn' ? 'bg-yellow-500' : 'bg-gray-800';
  el.className = `fixed bottom-6 right-6 ${color} text-white px-3 py-2 rounded-lg shadow-lg`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => (el.style.display = 'none'), 3000);
}