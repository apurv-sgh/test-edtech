// Utility to determine which API to use based on user role
export const getApiForRole = (role) => {
  switch (role) {
    case 'teacher':
      return 'teach_backend';
    case 'student':
    case 'counsellor':
    case 'industry_expert':
    case 'counsellor_expert':
      return 'main_backend';
    default:
      return 'main_backend';
  }
};

// Get the appropriate API instance based on role
export const getApiInstance = (role) => {
  const apiType = getApiForRole(role);
  
  if (apiType === 'teach_backend') {
    // Dynamically import to avoid circular dependencies
    return import('../api/apit').then(module => module.default);
  } else {
    // Dynamically import to avoid circular dependencies
    return import('../api/api').then(module => module.default);
  }
};

// Log API routing decisions for debugging
export const logApiRouting = (role, endpoint, apiType) => {
  console.log(`🔗 API Routing: Role "${role}" → ${apiType} → ${endpoint}`);
};
