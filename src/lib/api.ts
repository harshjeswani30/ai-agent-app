/**
 * API client for Python backend
 */

const API_BASE_URL = import.meta.env.VITE_PYTHON_API_URL || "http://localhost:8000";

export interface ExplanationRequest {
  topic: string;
  depth: "basic" | "intermediate" | "advanced";
}

export interface ExplanationResponse {
  topic: string;
  explanation: string;
  key_points: string[];
  examples: string[];
  timestamp: string;
}

export interface FlashcardRequest {
  topic: string;
  count: number;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardResponse {
  topic: string;
  flashcards: Flashcard[];
  timestamp: string;
}

export interface QuizRequest {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  count: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizResponse {
  topic: string;
  questions: QuizQuestion[];
  timestamp: string;
}

export interface ScheduleRequest {
  topics: string[];
  hours_per_day: number;
  days: number;
}

export interface StudyBlock {
  day: number;
  topic: string;
  duration: number;
  focus_area: string;
}

export interface ScheduleResponse {
  schedule: StudyBlock[];
  total_hours: number;
  tips: string[];
  timestamp: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async explainTopic(request: ExplanationRequest): Promise<ExplanationResponse> {
    const response = await fetch(`${this.baseURL}/api/explain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to explain topic: ${response.statusText}`);
    }

    return response.json();
  }

  async generateFlashcards(request: FlashcardRequest): Promise<FlashcardResponse> {
    const response = await fetch(`${this.baseURL}/api/flashcards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate flashcards: ${response.statusText}`);
    }

    return response.json();
  }

  async generateQuiz(request: QuizRequest): Promise<QuizResponse> {
    const response = await fetch(`${this.baseURL}/api/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate quiz: ${response.statusText}`);
    }

    return response.json();
  }

  async createSchedule(request: ScheduleRequest): Promise<ScheduleResponse> {
    const response = await fetch(`${this.baseURL}/api/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to create schedule: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new APIClient(API_BASE_URL);
