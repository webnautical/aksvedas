export const validate = (values) => {
  let errors = {};

  const isEmpty = (value) => value.trim() === '';

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (isEmpty(values.username)) {
    errors.username = 'Username is required';
  }

  if (isEmpty(values.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
};


export const validateRequired = (fields) => {
  let errors = {};
  const isEmpty = (value) => {
    if (typeof value === 'undefined' || value === null) {
      return true;
    }
    if (typeof value === 'string' || value instanceof String) {
      return value.trim() === '';
    }
    if (value instanceof File) {
      return !value.name;
    }
    return false;
  };

  Object.entries(fields).forEach(([fieldName, value]) => {
    if (isEmpty(value)) {
      errors[fieldName] = `Required *`;
    }
  });
  return errors;
};