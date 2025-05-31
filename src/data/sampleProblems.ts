
import { Problem } from "@/types/learning";

export const sampleProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: `
      <div class="space-y-4">
        <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>
        <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
        <p>You can return the answer in any order.</p>
        
        <div class="mt-4">
          <h4 class="font-semibold">Example 1:</h4>
          <pre class="bg-gray-100 p-3 rounded text-sm mt-2">
<strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].
          </pre>
        </div>
        
        <div class="mt-4">
          <h4 class="font-semibold">Example 2:</h4>
          <pre class="bg-gray-100 p-3 rounded text-sm mt-2">
<strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]
          </pre>
        </div>
        
        <div class="mt-4">
          <h4 class="font-semibold">Constraints:</h4>
          <ul class="list-disc list-inside text-sm space-y-1">
            <li>2 ≤ nums.length ≤ 10⁴</li>
            <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
            <li>-10⁹ ≤ target ≤ 10⁹</li>
            <li>Only one valid answer exists.</li>
          </ul>
        </div>
      </div>
    `,
    difficulty: "easy",
    track: "arrays-strings",
    hints: [
      "Think about what information you need to store as you iterate through the array.",
      "A hash map can help you find complements efficiently in O(1) time.",
      "For each number, check if its complement (target - current number) exists in your hash map.",
      "Don't forget to store the index of each number you've seen so far."
    ],
    starterCode: {
      python: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`
    },
    solution: {
      python: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
    const numMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        numMap.set(nums[i], i);
    }
    return [];
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[]{numMap.get(complement), i};
            }
            numMap.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`
    },
    testCases: [
      { id: "1", input: "[2,7,11,15], 9", expectedOutput: "[0,1]", isHidden: false },
      { id: "2", input: "[3,2,4], 6", expectedOutput: "[1,2]", isHidden: false },
      { id: "3", input: "[3,3], 6", expectedOutput: "[0,1]", isHidden: false },
      { id: "4", input: "[2,5,5,11], 10", expectedOutput: "[1,2]", isHidden: true }
    ],
    timeEstimate: 15,
    conceptsUsed: ["Hash Map", "Array Traversal", "Two Pointers"]
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    description: `
      <div class="space-y-4">
        <p>A phrase is a <strong>palindrome</strong> if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.</p>
        <p>Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.</p>
        
        <div class="mt-4">
          <h4 class="font-semibold">Example 1:</h4>
          <pre class="bg-gray-100 p-3 rounded text-sm mt-2">
<strong>Input:</strong> s = "A man, a plan, a canal: Panama"
<strong>Output:</strong> true
<strong>Explanation:</strong> "amanaplanacanalpanama" is a palindrome.
          </pre>
        </div>
        
        <div class="mt-4">
          <h4 class="font-semibold">Example 2:</h4>
          <pre class="bg-gray-100 p-3 rounded text-sm mt-2">
<strong>Input:</strong> s = "race a car"
<strong>Output:</strong> false
<strong>Explanation:</strong> "raceacar" is not a palindrome.
          </pre>
        </div>
      </div>
    `,
    difficulty: "easy",
    track: "arrays-strings",
    hints: [
      "First, clean the string by removing non-alphanumeric characters and converting to lowercase.",
      "Use two pointers: one at the beginning and one at the end of the cleaned string.",
      "Compare characters from both ends moving towards the center.",
      "If any pair doesn't match, it's not a palindrome."
    ],
    starterCode: {
      python: `def is_palindrome(s):
    """
    :type s: str
    :rtype: bool
    """
    # Your code here
    pass`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
    // Your code here
}`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Your code here
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        // Your code here
        return false;
    }
};`
    },
    solution: {
      python: `def is_palindrome(s):
    cleaned = ''.join(char.lower() for char in s if char.isalnum())
    left, right = 0, len(cleaned) - 1
    
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    
    return True`,
      javascript: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0;
    let right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        String cleaned = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        int left = 0;
        int right = cleaned.length() - 1;
        
        while (left < right) {
            if (cleaned.charAt(left) != cleaned.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        string cleaned = "";
        for (char c : s) {
            if (isalnum(c)) {
                cleaned += tolower(c);
            }
        }
        
        int left = 0;
        int right = cleaned.length() - 1;
        
        while (left < right) {
            if (cleaned[left] != cleaned[right]) {
                return false;
            }
            left++;
            right--;
        }
        
        return true;
    }
};`
    },
    testCases: [
      { id: "1", input: '"A man, a plan, a canal: Panama"', expectedOutput: "true", isHidden: false },
      { id: "2", input: '"race a car"', expectedOutput: "false", isHidden: false },
      { id: "3", input: '" "', expectedOutput: "true", isHidden: false }
    ],
    timeEstimate: 20,
    conceptsUsed: ["String Processing", "Two Pointers", "Character Manipulation"]
  }
];
