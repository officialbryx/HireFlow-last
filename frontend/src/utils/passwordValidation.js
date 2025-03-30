const commonPasswords = [
  "password123",
  "qwerty",
  "12345678",
  "admin123",
  "welcome",
  "letmein",
  "password",
  // Add more common passwords as needed
];

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[@#$%&*!]/.test(password);

  const requirements = [
    {
      id: "length",
      message: "At least 8 characters long",
      isMet: password.length >= minLength,
    },
    {
      id: "uppercase",
      message: "Contains uppercase letter",
      isMet: hasUpperCase,
    },
    {
      id: "lowercase",
      message: "Contains lowercase letter",
      isMet: hasLowerCase,
    },
    {
      id: "number",
      message: "Contains number",
      isMet: hasNumbers,
    },
    {
      id: "special",
      message: "Contains special character (@#$%&*!)",
      isMet: hasSpecialChar,
    },
  ];

  const meetsComplexityRequirement =
    [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean)
      .length >= 3;

  const isCommonPassword = commonPasswords.includes(password.toLowerCase());

  return {
    isValid:
      password.length >= minLength &&
      meetsComplexityRequirement &&
      !isCommonPassword,
    requirements,
    meetsComplexityRequirement,
    isCommonPassword,
  };
};
