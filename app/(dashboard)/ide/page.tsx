'use client'
import React, { useState } from 'react'

import Workspace from '@/components/workspace/Workspace'

import { Problem } from '@/lib/types/ide'


// demoProblems.js
const demoProblems = [
    {
        _id: "1",
        id: "sum-two-numbers",
        order: 1,
        title: "Sum Two Numbers",
        category: "Basic Arithmetic",
        difficulty: "Easy",
        problemStatement: `
      <p>Write a function to add two numbers.</p>
      <p>Given two integers <code>a</code> and <code>b</code>, return their sum.</p>
    `,
        starterCodes: {
            python: "def sum(a, b):\n    return a + b",
            cpp: "#include <iostream>\nusing namespace std;\n\nint sum(int a, int b) {\n    return a + b;\n}",
            java: "public class Solution {\n    public static int sum(int a, int b) {\n        return a + b;\n    }\n}",
            javascript: "function sum(a, b) {\n    return a + b;\n}",
            c: "#include <stdio.h>\n\nint sum(int a, int b) {\n    return a + b;\n}"
        },
        examples: [
            {
                id: 0,
                inputText: "2, 3",
                outputText: "5",
                explanation: "2 + 3 = 5"
            },
            {
                id: 1,
                inputText: "-1, 1",
                outputText: "0",
                explanation: "-1 + 1 = 0"
            }
        ],
        constraints: `
      <ul>
        <li><code>-1000 <= a, b <= 1000</code></li>
      </ul>
    `,
        testCase: {
            Input: ["2, 3", "-1, 1", "5, 7"],
            Output: ["5", "0", "12"]
        }
    },
    // Add more problems with starter codes for all languages
];


const Page = () => {
    const [problems] = useState<Problem[]>(demoProblems)
    return (
        <div className="p-2 text-[var(--foreground)] font-[var(--font-mono)]">
            <Workspace problems={problems} />
        </div>
    )
}
export default Page
