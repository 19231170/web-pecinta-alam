// Utility functions untuk aplikasi MAPALA

export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const formatDateTime = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^(\+62|62|0)[0-9]{9,13}$/;
  return re.test(phone);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Disetujui':
      return 'bg-green-100 text-green-800';
    case 'Ditolak':
      return 'bg-red-100 text-red-800';
    case 'Menunggu Verifikasi':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Local Storage helpers
export const storage = {
  get: (key) => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error getting from localStorage:', error);
        return null;
      }
    }
    return null;
  },
  
  set: (key, value) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error('Error setting to localStorage:', error);
        return false;
      }
    }
    return false;
  },
  
  remove: (key) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    }
    return false;
  }
};

// Form validation schemas
export const validationSchemas = {
  pendaftaran: {
    nama: { required: true, minLength: 2, maxLength: 100 },
    nim: { required: true, pattern: /^[0-9]{6,15}$/ },
    email: { required: true, type: 'email' },
    telefon: { required: true, pattern: /^(\+62|62|0)[0-9]{9,13}$/ },
    fakultas: { required: false, minLength: 2, maxLength: 50 },
    jurusan: { required: false, minLength: 2, maxLength: 50 },
  }
};

export const validateForm = (data, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    const value = data[field];
    
    if (rules.required && (!value || value.trim() === '')) {
      errors[field] = `${field} wajib diisi`;
      return;
    }
    
    if (value) {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} minimal ${rules.minLength} karakter`;
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `${field} maksimal ${rules.maxLength} karakter`;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = `Format ${field} tidak valid`;
      }
      
      if (rules.type === 'email' && !validateEmail(value)) {
        errors[field] = 'Format email tidak valid';
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
