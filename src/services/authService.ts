/**
 * Authentication Service
 * 
 * This service contains placeholder functions for authentication API calls.
 * Replace with real backend implementation when ready.
 * 
 * Security notes:
 * - Use JWT tokens for session management
 * - Use bcrypt for password hashing on the backend
 * - Never store plain text passwords
 * - Implement rate limiting on auth endpoints
 */

export interface SignupPayload {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

// API Base URL - replace with actual backend URL
const API_BASE_URL = '/api';

/**
 * POST /auth/signup
 * 
 * Creates a new user account
 * Backend should:
 * - Validate email format and uniqueness
 * - Hash password with bcrypt (cost factor 12+)
 * - Generate JWT token
 * - Send verification email (optional)
 */
export const signupUser = async (payload: SignupPayload): Promise<AuthResponse> => {
  // TODO: Replace with actual API call
  // Example implementation:
  // const response = await fetch(`${API_BASE_URL}/auth/signup`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // return response.json();

  // Simulated response for frontend development
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate validation
  if (!payload.email.includes('@')) {
    return { success: false, message: 'Invalid email format' };
  }
  
  if (payload.password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }
  
  // Simulate successful signup
  return {
    success: true,
    message: 'Account created successfully',
    user: {
      id: crypto.randomUUID(),
      email: payload.email,
      name: payload.fullName || payload.email.split('@')[0],
    },
    token: 'mock_jwt_token_' + Date.now(),
  };
};

/**
 * POST /auth/login
 * 
 * Authenticates user and returns JWT token
 * Backend should:
 * - Validate credentials against database
 * - Compare password hash with bcrypt.compare()
 * - Generate new JWT token
 * - Log login attempt for security
 */
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // return response.json();

  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (payload.password.length < 6) {
    return { success: false, message: 'Invalid credentials' };
  }
  
  return {
    success: true,
    message: 'Login successful',
    user: {
      id: crypto.randomUUID(),
      email: payload.email,
      name: payload.email.split('@')[0],
    },
    token: 'mock_jwt_token_' + Date.now(),
  };
};

/**
 * POST /auth/forgot-password
 * 
 * Initiates password reset flow
 * Backend should:
 * - Check if email exists in database
 * - Generate secure reset token (use crypto.randomBytes)
 * - Store token with expiration (15-30 minutes)
 * - Send email with reset link
 * - Always return success to prevent email enumeration
 */
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<AuthResponse> => {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // return response.json();

  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Always return success to prevent email enumeration attacks
  return {
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link.',
  };
};

/**
 * POST /auth/reset-password
 * 
 * Resets password with token
 * Backend should:
 * - Validate reset token and expiration
 * - Hash new password with bcrypt
 * - Update user password in database
 * - Invalidate reset token
 * - Optionally invalidate all existing sessions
 */
export const resetPassword = async (token: string, newPassword: string): Promise<AuthResponse> => {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (newPassword.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }
  
  return {
    success: true,
    message: 'Password reset successfully',
  };
};

/**
 * POST /auth/logout
 * 
 * Logs out user
 * Backend should:
 * - Invalidate JWT token (add to blacklist or use short-lived tokens)
 * - Clear refresh token from database
 */
export const logoutUser = async (): Promise<AuthResponse> => {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    success: true,
    message: 'Logged out successfully',
  };
};

/**
 * Utility: Store JWT token securely
 * Note: For production, consider using httpOnly cookies instead
 */
export const storeToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Utility: Get stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Utility: Remove stored token
 */
export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};
