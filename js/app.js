// Theme
export function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// Language
const translations = {
  en: {
    dashboard: 'Dashboard', farms: 'Farms', farmers: 'Farmers',
    expenses: 'Expenses', reports: 'Reports', inventory: 'Inventory',
    bookkeeping: 'Bookkeeping', logout: 'Logout', settings: 'Settings',
    totalFarms: 'Total Farms', totalFarmers: 'Total Farmers',
    seasonProfit: 'Season Profit', inventoryValue: 'Inventory Value',
    addFarm: 'Add Farm', addFarmer: 'Add Farmer', addExpense: 'Add Expense',
    save: 'Save', cancel: 'Cancel', edit: 'Edit', delete: 'Delete',
    search: 'Search', loading: 'Loading...', name: 'Name', phone: 'Phone',
    location: 'Location', area: 'Area (Acres)', season: 'Season',
    crop: 'Current Crop', manager: 'Manager', landlord: 'Landlord',
    date: 'Date', description: 'Description', category: 'Category',
    quantity: 'Quantity', price: 'Price per Unit', total: 'Total Amount',
    farm: 'Farm', users: 'Users', suspend: 'Suspend', activate: 'Activate',
    role: 'Role', status: 'Status', actions: 'Actions', email: 'Email',
    password: 'Password', login: 'Login', welcome: 'Welcome Back'
  },
  ur: {
    dashboard: 'ڈیش بورڈ', farms: 'فارم', farmers: 'کسان',
    expenses: 'اخراجات', reports: 'رپورٹس', inventory: 'انوینٹری',
    bookkeeping: 'بک کیپنگ', logout: 'لاگ آؤٹ', settings: 'ترتیبات',
    totalFarms: 'کل فارم', totalFarmers: 'کل کسان',
    seasonProfit: 'سیزن منافع', inventoryValue: 'انوینٹری قیمت',
    addFarm: 'فارم شامل کریں', addFarmer: 'کسان شامل کریں',
    addExpense: 'خرچ شامل کریں', save: 'محفوظ کریں',
    cancel: 'منسوخ', edit: 'ترمیم', delete: 'حذف کریں',
    search: 'تلاش', loading: 'لوڈ ہو رہا ہے...', name: 'نام',
    phone: 'فون', location: 'مقام', area: 'رقبہ (ایکڑ)',
    season: 'سیزن', crop: 'موجودہ فصل', manager: 'مینیجر',
    landlord: 'زمیندار', date: 'تاریخ', description: 'تفصیل',
    category: 'زمرہ', quantity: 'مقدار', price: 'فی یونٹ قیمت',
    total: 'کل رقم', farm: 'فارم', users: 'صارفین',
    suspend: 'معطل', activate: 'فعال کریں', role: 'کردار',
    status: 'حیثیت', actions: 'اقدامات', email: 'ای میل',
    password: 'پاس ورڈ', login: 'لاگ ان', welcome: 'خوش آمدید'
  }
};

export function initLang() {
  const saved = localStorage.getItem('lang') || 'en';
  applyLang(saved);
}

export function toggleLang() {
  const current = localStorage.getItem('lang') || 'en';
  const next = current === 'en' ? 'ur' : 'en';
  localStorage.setItem('lang', next);
  applyLang(next);
}

export function applyLang(lang) {
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) el.textContent = translations[lang][key];
  });
}

export function t(key) {
  const lang = localStorage.getItem('lang') || 'en';
  return translations[lang][key] || key;
}

// Toast notifications
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function createToastContainer() {
  const div = document.createElement('div');
  div.id = 'toast-container';
  document.body.appendChild(div);
  return div;
}

// Modal helpers
export function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}
export function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

// Format currency
export function formatCurrency(amount) {
  return '₨ ' + Number(amount || 0).toLocaleString('en-PK');
}

// Format date
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then(() => console.log('SW registered'))
      .catch(console.error);
  });
}