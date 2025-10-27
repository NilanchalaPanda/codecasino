// lib/types/ide.ts

export type Language = 'python' | 'cpp' | 'java' | 'javascript' | 'c';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Example {
  id: number;
  inputText: string;
  outputText: string;
  explanation?: string;
  image?: string; // Optional visual explanation
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean; // Hidden test cases not visible to user
}

export interface Hint {
  id: number;
  text: string;
  penaltyPoints?: number; // Points deducted for viewing hint
}

export interface CodeTemplate {
  language: Language;
  starterCode: string;
  solutionCode?: string;
  testCode?: string; // Code to run tests
}

export interface Complexity {
  time: string; // e.g., "O(n log n)"
  space: string; // e.g., "O(n)"
  explanation?: string;
}

// Enhanced Problem interface with rich content
export interface Problem {
  _id: string;
  id: string; // URL-friendly ID
  order: number;
  title: string;
  category: string;
  difficulty: Difficulty;
  
  // Problem Content
  problemStatement: string; // HTML formatted
  detailedDescription?: string; // Extended explanation
  intuition?: string; // Initial approach guidance
  approach?: string; // Step-by-step solution approach
  
  // Visual Aids
  images?: string[];
  diagrams?: string[];
  videoUrl?: string; // Tutorial video link
  
  // Code Templates (multi-language support)
  starterCodes: Record<Language, string>;
  solutionCodes?: Record<Language, string>;
  
  // Test Cases
  examples: Example[];
  testCase: {
    Input: string[];
    Output: string[];
  };
  hiddenTestCases?: TestCase[]; // Additional test cases not shown
  
  // Constraints
  constraints: string; // HTML formatted
  inputFormat?: string;
  outputFormat?: string;
  
  // Hints System
  hints?: Hint[];
  
  // Complexity Analysis
  complexity?: Complexity;
  
  // Tags & Metadata
  tags: string[]; // e.g., ["Array", "Two Pointers", "Sorting"]
  companies?: string[]; // Companies that asked this question
  relatedProblems?: string[]; // IDs of similar problems
  
  // Gamification
  points: number; // Points awarded for solving
  baseTime: number; // Expected time in seconds
  bonusMultiplier?: number; // Bonus for fast solutions
  
  // Statistics
  solveRate?: number; // Percentage of users who solved it
  averageTime?: number; // Average time to solve (seconds)
  totalAttempts?: number;
  totalSolved?: number;
  
  // Version Control
  version?: number;
  lastUpdated?: Date;
  author?: string;
}

// User submission interface
export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: Language;
  code: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit' | 'memory_limit';
  testCasesPassed?: number;
  totalTestCases?: number;
  runtime?: number; // Milliseconds
  memory?: number; // MB
  timestamp: Date;
  violationCount?: number;
}

// Battle/Contest mode
export interface BattleSession {
  id: string;
  userId: string;
  problemIds: string[];
  startTime: Date;
  endTime?: Date;
  timeLimit: number; // Seconds
  currentProblemIndex: number;
  score: number;
  submissions: Submission[];
  violations: number;
  isActive: boolean;
}

// Code execution result
export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  testCaseResults?: {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
  }[];
  runtime?: number;
  memory?: number;
  stdout?: string;
  stderr?: string;
}

// Language configuration
export interface LanguageConfig {
  id: Language;
  name: string;
  displayName: string;
  fileExtension: string;
  commentSyntax: {
    single: string;
    multiStart?: string;
    multiEnd?: string;
  };
  boilerplate?: string;
  runCommand?: string;
}

// Editor settings
export interface EditorSettings {
  theme: 'light' | 'dark' | 'vscode-dark';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoComplete: boolean;
  lineNumbers: boolean;
  minimap: boolean;
}