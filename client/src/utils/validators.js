export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase()) ? "" : "Invalid email address";
};

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20 
    ? "" 
    : "Username must be 3-20 characters";
};


export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) return "Password must be at least 8 characters";
  if (!hasUpperCase) return "Password must contain uppercase letters";
  if (!hasLowerCase) return "Password must contain lowercase letters";
  if (!hasNumber) return "Password must contain numbers";
  if (!hasSpecialChar) return "Password must contain special characters";
  return "";
};


export const validateConfirmPassword = (value, values) => {
  return value === values.password ? "" : "Passwords do not match";
};



export const validateLoginInput = (input) => {
  if (!input || !input.trim()) {
    return "Email or Username is required";
  }
  return "";
};


export const validateLoginPassword = (password) => {
  if (!password || !password.trim()) {
    return "Password is required";
  }
  return "";
};


export const validateVerificationCode = (value) => {
    if (!value) return "Verification code is required";
    if (!/^\d{4}$/.test(value)) return "Code must be 4 digits";
    return "";
  };
