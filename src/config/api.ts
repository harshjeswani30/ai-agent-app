// API Configuration
// This file centralizes all API endpoint URLs

// Base API URL - uses environment variable in production, localhost in development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Endpoints
export const apiEndpoints = {
  // Chat with AI tutor
  chat: `${API_URL}/api/chat`,

  // Quiz generation
  quiz: `${API_URL}/api/quiz/generate`,

  // Study plan generation
  studyPlan: `${API_URL}/api/study-plan`,

  // Get available subjects
  subjects: `${API_URL}/api/subjects`,
};

// Helper function to check if backend is available
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
