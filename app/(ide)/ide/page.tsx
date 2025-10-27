'use client'
import React, { useState } from 'react'
import Workspace from '@/components/workspace/Workspace'
import { Problem } from '@/lib/types/ide'

export const richDemoProblems: Problem[] = [
    {
        _id: "1",
        id: "two-sum",
        order: 1,
        title: "Two Sum",
        category: "Array & Hash Table",
        difficulty: "Easy",

        problemStatement: `
      <p class="mb-2">
        Given an array of integers <code>nums</code> and an integer <code>target</code>, 
        return indices of the two numbers such that they add up to target.
      </p>
      <p class="mb-2">
        You may assume that each input would have <strong>exactly one solution</strong>, 
        and you may not use the same element twice.
      </p>
      <p>
        You can return the answer in any order.
      </p>
    `,

        detailedDescription: `
      <p class="mb-2">
        The Two Sum problem is a classic array problem that tests your understanding of 
        hash tables and time-space tradeoffs. The brute force approach would be O(n²), 
        but we can optimize it to O(n) using a hash table.
      </p>
      <p>
        <strong>Key Insight:</strong> For each element x, we need to find if (target - x) 
        exists in the array. A hash table allows us to check this in O(1) time.
      </p>
    `,

        intuition: `
      <p class="mb-2">
        Instead of checking every possible pair, we can use a hash map to store numbers 
        we've seen so far. For each number, we check if its complement (target - current number) 
        exists in our hash map.
      </p>
      <p>
        This way, we only need to traverse the array once!
      </p>
    `,

        approach: `
      <ol class="list-decimal list-inside space-y-2">
        <li>Create an empty hash map to store values and their indices</li>
        <li>Iterate through the array</li>
        <li>For each element, calculate its complement (target - current element)</li>
        <li>Check if the complement exists in the hash map</li>
        <li>If yes, return the indices</li>
        <li>If no, add the current element and its index to the hash map</li>
      </ol>
    `,

        starterCodes: {
            python: `def twoSum(nums, target):
    """
    Find two numbers that add up to target
    
    Args:
        nums: List[int] - Array of integers
        target: int - Target sum
    
    Returns:
        List[int] - Indices of the two numbers
    """
    # Write your code here
    pass`,

            cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,

            java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,

            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
}`,

            c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your code here
    
}`
        },

        solutionCodes: {
            python: `def twoSum(nums, target):
    # Hash map to store value -> index
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        # Check if complement exists
        if complement in seen:
            return [seen[complement], i]
        
        # Store current number and index
        seen[num] = i
    
    return []  # No solution found`,

            cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        
        seen[nums[i]] = i;
    }
    
    return {};
}`,

            java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        
        if (seen.containsKey(complement)) {
            return new int[] { seen.get(complement), i };
        }
        
        seen.put(nums[i], i);
    }
    
    return new int[] {};
}`,

            javascript: `function twoSum(nums, target) {
    const seen = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        
        seen.set(nums[i], i);
    }
    
    return [];
}`,
            c: ''
        },

        examples: [
            {
                id: 0,
                inputText: "nums = [2, 7, 11, 15], target = 9",
                outputText: "[0, 1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                id: 1,
                inputText: "nums = [3, 2, 4], target = 6",
                outputText: "[1, 2]",
                explanation: "nums[1] + nums[2] = 2 + 4 = 6, so we return [1, 2]."
            },
            {
                id: 2,
                inputText: "nums = [3, 3], target = 6",
                outputText: "[0, 1]",
                explanation: "The two 3s at indices 0 and 1 add up to 6."
            }
        ],

        testCase: {
            Input: ["[2,7,11,15], 9", "[3,2,4], 6", "[3,3], 6"],
            Output: ["[0,1]", "[1,2]", "[0,1]"]
        },

        constraints: `
      <ul class="list-disc list-inside space-y-1">
        <li><code>2 <= nums.length <= 10<sup>4</sup></code></li>
        <li><code>-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup></code></li>
        <li><code>-10<sup>9</sup> <= target <= 10<sup>9</sup></code></li>
        <li>Only one valid answer exists</li>
      </ul>
    `,

        hints: [
            {
                id: 1,
                text: "Think about using a hash table to store numbers you've already seen.",
                penaltyPoints: 5
            },
            {
                id: 2,
                text: "For each number x, check if (target - x) exists in your hash table.",
                penaltyPoints: 10
            },
            {
                id: 3,
                text: "You only need one pass through the array if you use a hash table correctly.",
                penaltyPoints: 15
            }
        ],

        complexity: {
            time: "O(n)",
            space: "O(n)",
            explanation: "We traverse the list containing n elements only once. Each lookup in the hash table costs O(1) time. Space complexity is O(n) for the hash table."
        },

        tags: ["Array", "Hash Table", "Two Pointers"],
        companies: ["Google", "Amazon", "Facebook", "Microsoft", "Apple"],
        relatedProblems: ["three-sum", "two-sum-ii", "subarray-sum-equals-k"],

        points: 100,
        baseTime: 900, // 15 minutes
        bonusMultiplier: 1.5,

        solveRate: 47.3,
        averageTime: 720,
        totalAttempts: 1250000,
        totalSolved: 591250,

        version: 1,
        author: "LeetCode"
    },

    {
        _id: "2",
        id: "reverse-string",
        order: 2,
        title: "Reverse String",
        category: "String & Two Pointers",
        difficulty: "Easy",

        problemStatement: `
      <p class="mb-2">
        Write a function that reverses a string. The input string is given as an array 
        of characters <code>s</code>.
      </p>
      <p>
        You must do this by modifying the input array <strong>in-place</strong> with 
        O(1) extra memory.
      </p>
    `,

        detailedDescription: `
      <p class="mb-2">
        This problem tests your understanding of the two-pointer technique and in-place 
        array manipulation. The key constraint is that we must reverse the string without 
        using additional data structures.
      </p>
      <p>
        <strong>In-place</strong> means we can only use a constant amount of extra space, 
        regardless of the input size.
      </p>
    `,

        intuition: `
      <p class="mb-2">
        Imagine you have two pointers, one at the beginning and one at the end of the array. 
        You can swap the characters at these positions, then move both pointers toward the 
        center.
      </p>
      <p>
        Continue this process until the pointers meet in the middle. The string will be reversed!
      </p>
    `,

        approach: `
      <ol class="list-decimal list-inside space-y-2">
        <li>Initialize two pointers: left at index 0, right at index n-1</li>
        <li>While left < right:</li>
        <li>&nbsp;&nbsp;- Swap characters at left and right positions</li>
        <li>&nbsp;&nbsp;- Move left pointer forward (left++)</li>
        <li>&nbsp;&nbsp;- Move right pointer backward (right--)</li>
        <li>The array is now reversed in-place</li>
      </ol>
    `,

        starterCodes: {
            python: `def reverseString(s):
    """
    Reverse string in-place
    
    Args:
        s: List[str] - Array of characters
    
    Returns:
        None - Modify s in-place
    """
    # Write your code here
    pass`,

            cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your code here
        
    }
};`,

            java: `class Solution {
    public void reverseString(char[] s) {
        // Write your code here
        
    }
}`,

            javascript: `/**
 * @param {character[]} s
 * @return {void} Modify s in-place
 */
function reverseString(s) {
    // Write your code here
    
}`,

            c: `void reverseString(char* s, int sSize) {
    // Write your code here
    
}`
        },

        solutionCodes: {
            python: `def reverseString(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        # Swap characters
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,

            cpp: `void reverseString(vector<char>& s) {
    int left = 0, right = s.size() - 1;
    
    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}`,

            java: `public void reverseString(char[] s) {
    int left = 0, right = s.length - 1;
    
    while (left < right) {
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
        left++;
        right--;
    }
}`,

            javascript: `function reverseString(s) {
    let left = 0, right = s.length - 1;
    
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
}`,
            c: ''
        },

        examples: [
            {
                id: 0,
                inputText: 's = ["h","e","l","l","o"]',
                outputText: '["o","l","l","e","h"]',
                explanation: "The string is reversed in-place."
            },
            {
                id: 1,
                inputText: 's = ["H","a","n","n","a","h"]',
                outputText: '["h","a","n","n","a","H"]',
                explanation: "Palindromes reverse to themselves with case sensitivity."
            }
        ],

        testCase: {
            Input: ['["h","e","l","l","o"]', '["H","a","n","n","a","h"]'],
            Output: ['["o","l","l","e","h"]', '["h","a","n","n","a","H"]']
        },

        constraints: `
      <ul class="list-disc list-inside space-y-1">
        <li><code>1 <= s.length <= 10<sup>5</sup></code></li>
        <li><code>s[i]</code> is a printable ASCII character</li>
      </ul>
    `,

        hints: [
            {
                id: 1,
                text: "Try using two pointers approach - one at the start and one at the end.",
                penaltyPoints: 5
            },
            {
                id: 2,
                text: "Swap characters and move pointers toward the center.",
                penaltyPoints: 10
            }
        ],

        complexity: {
            time: "O(n)",
            space: "O(1)",
            explanation: "We traverse half the array (n/2 swaps), which is O(n). We only use two pointer variables, so space is O(1)."
        },

        tags: ["String", "Two Pointers", "In-Place"],
        companies: ["Amazon", "Microsoft", "Bloomberg"],
        relatedProblems: ["reverse-words", "reverse-string-ii"],

        points: 80,
        baseTime: 600,
        bonusMultiplier: 1.3,

        solveRate: 72.1,
        averageTime: 420,
        totalAttempts: 890000,
        totalSolved: 641690,

        version: 1,
        author: "LeetCode"
    }
];


const Page = () => {
    const [problems] = useState<Problem[]>(richDemoProblems)
    return (
        <div className="p-2 text-[var(--foreground)] font-[var(--font-mono)]">
            <Workspace problems={problems} />
        </div>
    )
}
export default Page
