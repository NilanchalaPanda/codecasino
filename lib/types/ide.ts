export type Language = keyof StarterCodes;

// types/ide.ts
export type Example = {
  id: number;
  inputText: string;
  outputText: string;
  explanation?: string;
};

export type TestCase = {
  Input: string[];
  Output: string[];
};

export type StarterCodes = {
  python: string;
  cpp: string;
  java: string;
  javascript: string;
  c: string;
};

export type Problem = {
  _id: string;
  id: string;
  title: string;
  problemStatement: string;
  starterCodes: StarterCodes;
  examples: Example[];
  constraints: string;
  order: number;
  category: string;
  difficulty: string;
  testCase: TestCase;
};

export type ProblemList = {
  _id: string;
  like: boolean;
  dislike: boolean;
  favorite: boolean;
  solved: boolean;
  solvedAnswer?: string;
};

export type Users = {
  _id: any;
  username: string;
  email: string;
  totalLikes: number;
  totalDisLikes: number;
  totalSolved: number;
  problemList: ProblemList[];
};
