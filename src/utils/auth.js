export function normalizeMobile(value = '') {
  const digits = value.replace(/\D/g, '');

  if (digits.startsWith('91') && digits.length > 10) {
    return digits.slice(-10);
  }

  return digits.slice(0, 10);
}

export function formatOtpMobile(value = '') {
  const mobile = normalizeMobile(value);
  return mobile ? `+91${mobile}` : '';
}

export function splitFullName(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

export function buildUsername(name = '', email = '') {
  const emailPrefix = email.split('@')[0]?.trim();

  if (emailPrefix) {
    return emailPrefix.toLowerCase();
  }

  return name.trim().toLowerCase().replace(/\s+/g, '') || 'careermapuser';
}

export function buildLandingData(onboarding) {
  return {
    class: onboarding.selectedClass || '',
    stream: onboarding.selectedStream || '',
    interest: onboarding.selectedInterests || [],
    clarity: onboarding.selectedClarity || '',
    strength: onboarding.selectedStrengths || [],
    priority: onboarding.selectedPriorities || [],
  };
}

export function isValidEmail(value = '') {
  const email = value.trim();
  if (!email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getEmailError(value = '') {
  const email = value.trim();
  if (!email) {
    return 'Email address is required.';
  }

  if (!isValidEmail(email)) {
    return 'Enter a valid email address.';
  }

  return '';
}

export function isValidPassword(value = '') {
  return value.length >= 6;
}

export function getPasswordError(value = '') {
  if (!value) {
    return 'Password is required.';
  }

  if (!isValidPassword(value)) {
    return 'Password must be at least 6 characters.';
  }

  return '';
}

export function isValidDateInput(value = '') {
  const dateValue = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return false;
  }

  const [year, month, day] = dateValue.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day;
}

export function getDateError(value = '') {
  const dateValue = value.trim();
  if (!dateValue) {
    return 'Date of birth is required.';
  }

  if (!isValidDateInput(dateValue)) {
    return 'Use YYYY-MM-DD format with a real date.';
  }

  return '';
}

export function mapApiUserToProfile(user) {
  if (!user) {
    return null;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

  return {
    name: fullName,
    email: user.email || '',
    mobile: user.mobile || '',
    password: '',
    address: user.address || '',
    city: user.city || '',
    stateName: user.state || '',
    district: user.district || '',
    country: user.country || 'India',
    gender: user.gender || '',
    dob: user.dataOfBirth ? String(user.dataOfBirth).slice(0, 10) : '',
    childName: '',
  };
}
