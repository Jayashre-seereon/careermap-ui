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

export function isValidDateInput(value = '') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}
