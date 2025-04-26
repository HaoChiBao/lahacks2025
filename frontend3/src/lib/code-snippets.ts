interface CodeSnippet {
  language: string
  incorrectCode: string
  correctCode: string
  differences: number[]
  explanation: string
}

interface CodeSnippets {
  [level: string]: CodeSnippet[]
}

export const codeSnippets: CodeSnippets = {
  beginner: [
    {
      language: "javascript",
      incorrectCode: `function calculateSum(a, b) {
  return a - b;
}

const result = calculateSum(5, 3);
console.log("The sum is: " + result);`,
      correctCode: `function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(5, 3);
console.log("The sum is: " + result);`,
      differences: [2],
      explanation:
        "The incorrect code uses subtraction (a - b) instead of addition (a + b) in the calculateSum function, which contradicts the function's name and intended purpose.",
    },
    {
      language: "javascript",
      incorrectCode: `const user = {
  name: "John",
  age: 30,
  isActive: true,
};

if (user.isactive) {
  console.log("User is active");
} else {
  console.log("User is not active");
}`,
      correctCode: `const user = {
  name: "John",
  age: 30,
  isActive: true,
};

if (user.isActive) {
  console.log("User is active");
} else {
  console.log("User is not active");
}`,
      differences: [7],
      explanation:
        "JavaScript is case-sensitive. The incorrect code uses 'user.isactive' (lowercase 'a') while the property is defined as 'isActive' (capital 'A'). This would cause the condition to evaluate to undefined, which is falsy.",
    },
    {
      language: "python",
      incorrectCode: `def greet(alice):
    return "Hello, " + name + "!"

message = greet("Alice")
print(message)`,
      correctCode: `def greet(name):
    return "Hello, " + name + "!"

message = greet("Alice")
print(message)`,
      differences: [1],
      explanation:
        "This is a trick question! Both code snippets are actually identical and correct. Sometimes code might look correct at first glance, and it's important to verify before making changes.",
    },
  ],
  intermediate: [
    {
      language: "javascript",
      incorrectCode: `function fetchUserData() {
  const userData = fetch('https://api.example.com/users')
    .then(response => response.json());
  
  return userData;
}

async function displayUser() {
  const user = fetchUserData();
  console.log(user.name);
}`,
      correctCode: `async function fetchUserData() {
  const response = await fetch('https://api.example.com/users');
  const userData = await response.json();
  
  return userData;
}

async function displayUser() {
  const user = await fetchUserData();
  console.log(user.name);
}`,
      differences: [1, 2, 3, 8],
      explanation:
        "The incorrect code has several issues: 1) fetchUserData() returns a Promise but isn't marked as async, 2) it doesn't await the fetch result, 3) it returns the Promise chain directly, and 4) displayUser() doesn't await the Promise returned by fetchUserData(), which would cause user.name to be undefined.",
    },
    {
      language: "javascript",
      incorrectCode: `const numbers = [1, 2, 3, 4, 5];

for (var i = 0; i < numbers.length; i++) {
  setTimeout(function() {
    console.log("Index: " + i + ", Value: " + numbers[i]);
  }, 1000);
}`,
      correctCode: `const numbers = [1, 2, 3, 4, 5];

for (let i = 0; i < numbers.length; i++) {
  setTimeout(function() {
    console.log("Index: " + i + ", Value: " + numbers[i]);
  }, 1000);
}`,
      differences: [3],
      explanation:
        "The incorrect code uses 'var' which has function scope, so by the time the setTimeout callbacks execute, the loop has completed and 'i' is 5 (out of bounds). The correct code uses 'let' which has block scope, creating a new binding for each iteration of the loop.",
    },
    {
      language: "python",
      incorrectCode: `def process_items(items):
    processed = []
    for i in range(len(items)):
        processed.append(items[i] * 2)
    return processed

numbers = [1, 2, 3, 4, 5]
result = process_items(numbers)
print(result)`,
      correctCode: `def process_items(items):
    return [item * 2 for item in items]

numbers = [1, 2, 3, 4, 5]
result = process_items(numbers)
print(result)`,
      differences: [2, 3, 4],
      explanation:
        "The correct code uses a list comprehension which is more Pythonic and concise than the explicit for loop in the incorrect code. While both produce the same result, the list comprehension is considered better practice in Python for simple transformations.",
    },
  ],
  advanced: [
    {
      language: "javascript",
      incorrectCode: `function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache[key]) {
      return cache[key];
    }
    
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}`,
      correctCode: `function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      return cache[key];
    }
    
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}`,
      differences: [6],
      explanation:
        "The incorrect code checks 'if (cache[key])' which would fail for cached values that are falsy (like 0, false, empty string). The correct code uses 'if (key in cache)' which properly checks for the existence of the key regardless of the value.",
    },
    {
      language: "javascript",
      incorrectCode: `class UserService {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  findUserById(id) {
    return this.users.find(user => user.id === id);
  }
}

// Create singleton
const userService = new UserService();
export default userService;`,
      correctCode: `class UserService {
  constructor() {
    if (UserService.instance) {
      return UserService.instance;
    }
    UserService.instance = this;
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  findUserById(id) {
    return this.users.find(user => user.id === id);
  }
}

// Create singleton
export default new UserService();`,
      differences: [2, 3, 4, 5, 15, 16],
      explanation:
        "The incorrect code attempts to create a singleton by exporting an instance, but this doesn't prevent multiple instances from being created if the class is imported directly. The correct code implements the singleton pattern within the class constructor, ensuring only one instance exists regardless of how it's imported.",
    },
    {
      language: "python",
      incorrectCode: `def calculate_average(numbers):
    total = 0
    count = 0
    
    for num in numbers:
        total += num
        count += 1
    
    return total / count

# Calculate average of a list
values = [10, 15, 20, 25, 30]
avg = calculate_average(values)
print(f"Average: {avg}")

# Calculate average of an empty list
empty_list = []
avg_empty = calculate_average(empty_list)
print(f"Average of empty list: {avg_empty}")`,
      correctCode: `def calculate_average(numbers):
    if not numbers:
        return 0
    
    return sum(numbers) / len(numbers)

# Calculate average of a list
values = [10, 15, 20, 25, 30]
avg = calculate_average(values)
print(f"Average: {avg}")

# Calculate average of an empty list
empty_list = []
avg_empty = calculate_average(empty_list)
print(f"Average of empty list: {avg_empty}")`,
      differences: [2, 3, 4, 5, 6, 7, 8],
      explanation:
        "The incorrect code has two issues: 1) It doesn't handle empty lists, which would cause a division by zero error, and 2) It manually calculates the sum and count when Python has built-in functions (sum() and len()) that are more efficient. The correct code checks for empty lists and uses the built-in functions.",
    },
  ],
}
