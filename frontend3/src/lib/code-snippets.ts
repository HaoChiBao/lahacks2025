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

export // Extended Code Snippets Collection
// 15 questions per difficulty level (5 each for JavaScript, Python, and Java)

const extendedCodeSnippets = {
  beginner: [
    // JavaScript Beginner Examples
    {
      language: "javascript",
      incorrectCode: `function sayHello(name) {
  console.log("Hello" + name);
}
sayHello("John");`,
      correctCode: `function sayHello(name) {
  console.log("Hello " + name);
}
sayHello("John");`,
      differences: [2],
      explanation: "The greeting lacks a space between 'Hello' and the name, making the output look incorrect ('HelloJohn' vs 'Hello John')."
    },
    {
      language: "javascript",
      incorrectCode: `let total = 0;
for (let i = 0; i <= 5; i++) {
  total += i;
}
console.log("Sum from 1 to 5: " + total);`,
      correctCode: `let total = 0;
for (let i = 1; i <= 5; i++) {
  total += i;
}
console.log("Sum from 1 to 5: " + total);`,
      differences: [2],
      explanation: "The loop starts at 0 instead of 1, so it calculates the sum of 0+1+2+3+4+5 instead of 1+2+3+4+5 as requested."
    },
    {
      language: "javascript",
      incorrectCode: `const person = {
  firstName: "Alice",
  lastName: "Smith",
  fullName: function() {
    return firstName + " " + lastName;
  }
};
console.log(person.fullName());`,
      correctCode: `const person = {
  firstName: "Alice",
  lastName: "Smith",
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
};
console.log(person.fullName());`,
      differences: [4],
      explanation: "When accessing object properties within a method, you need to use 'this' keyword to reference the object's own properties."
    },
    {
      language: "javascript",
      incorrectCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => {
  num * 2;
});
console.log(doubled);`,
      correctCode: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => {
  return num * 2;
});
console.log(doubled);`,
      differences: [3],
      explanation: "The arrow function with curly braces needs an explicit 'return' statement, otherwise it returns undefined for each element."
    },
    {
      language: "javascript",
      incorrectCode: `const price = "19.99";
const quantity = "2";
const total = price * quantity;
console.log("Total: $" + total);`,
      correctCode: `const price = "19.99";
const quantity = "2";
const total = parseFloat(price) * parseInt(quantity);
console.log("Total: $" + total);`,
      differences: [3],
      explanation: "When performing mathematical operations on strings that represent numbers, you need to convert them to numbers first using functions like parseFloat() or parseInt()."
    },
    
    // Python Beginner Examples
    {
      language: "python",
      incorrectCode: `def greet(name):
    return "Hello" + name

print(greet("Alice"))`,
      correctCode: `def greet(name):
    return "Hello " + name

print(greet("Alice"))`,
      differences: [2],
      explanation: "The greeting string lacks a space between 'Hello' and the name, resulting in 'HelloAlice' instead of 'Hello Alice'."
    },
    {
      language: "python",
      incorrectCode: `numbers = [1, 2, 3, 4, 5]
total = 0
for i in range(0, 5):
    total += numbers[i]
print(total)`,
      correctCode: `numbers = [1, 2, 3, 4, 5]
total = 0
for i in range(0, len(numbers)):
    total += numbers[i]
print(total)`,
      differences: [3],
      explanation: "The range should use len(numbers) instead of a hardcoded value to accommodate arrays of different lengths."
    },
    {
      language: "python",
      incorrectCode: `user_input = input("Enter a number: ")
result = user_input * 2
print("Doubled:", result)`,
      correctCode: `user_input = input("Enter a number: ")
result = int(user_input) * 2
print("Doubled:", result)`,
      differences: [2],
      explanation: "The input() function returns a string, so it needs to be converted to an integer with int() before performing multiplication."
    },
    {
      language: "python",
      incorrectCode: `fruits = ["apple", "banana", "cherry"]
for i in range(0, 3):
    print("I like " + fruits[i])`,
      correctCode: `fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print("I like " + fruit)`,
      differences: [2, 3],
      explanation: "When iterating through a list in Python, it's cleaner and more Pythonic to use a for-each loop rather than indexing."
    },
    {
      language: "python",
      incorrectCode: `def is_even(num):
    if num / 2 == 0:
        return True
    else:
        return False

print(is_even(4))`,
      correctCode: `def is_even(num):
    if num % 2 == 0:
        return True
    else:
        return False

print(is_even(4))`,
      differences: [2],
      explanation: "To check if a number is even, use the modulo operator (%) rather than division (/) to check for a remainder of 0."
    },
    
    // Java Beginner Examples
    {
      language: "java",
      incorrectCode: `public class Greeting {
    public static void main(String[] args) {
        System.out.println("Hello" + "World");
    }
}`,
      correctCode: `public class Greeting {
    public static void main(String[] args) {
        System.out.println("Hello " + "World");
    }
}`,
      differences: [3],
      explanation: "The greeting lacks a space between 'Hello' and 'World', resulting in 'HelloWorld' instead of 'Hello World'."
    },
    {
      language: "java",
      incorrectCode: `public class ArraySum {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int i = 0; i <= numbers.length; i++) {
            sum += numbers[i];
        }
        System.out.println("Sum: " + sum);
    }
}`,
      correctCode: `public class ArraySum {
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        System.out.println("Sum: " + sum);
    }
}`,
      differences: [5],
      explanation: "The loop condition should be i < numbers.length, not i <= numbers.length. Arrays in Java are zero-indexed, so the valid indices are 0 to length-1."
    },
    {
      language: "java",
      incorrectCode: `public class Calculator {
    public static void main(String[] args) {
        double result = divide(10, 0);
        System.out.println("Result: " + result);
    }
    
    public static double divide(int a, int b) {
        return a / b;
    }
}`,
      correctCode: `public class Calculator {
    public static void main(String[] args) {
        if (args.length > 0 && Integer.parseInt(args[1]) != 0) {
            double result = divide(10, Integer.parseInt(args[1]));
            System.out.println("Result: " + result);
        } else {
            System.out.println("Cannot divide by zero");
        }
    }
    
    public static double divide(int a, int b) {
        return a / (double)b;
    }
}`,
      differences: [3, 4, 5, 6, 11],
      explanation: "The original code doesn't check for division by zero and doesn't cast to double for accurate division results."
    },
    {
      language: "java",
      incorrectCode: `public class StringComparison {
    public static void main(String[] args) {
        String a = new String("hello");
        String b = new String("hello");
        if (a == b) {
            System.out.println("Strings are equal");
        } else {
            System.out.println("Strings are different");
        }
    }
}`,
      correctCode: `public class StringComparison {
    public static void main(String[] args) {
        String a = new String("hello");
        String b = new String("hello");
        if (a.equals(b)) {
            System.out.println("Strings are equal");
        } else {
            System.out.println("Strings are different");
        }
    }
}`,
      differences: [5],
      explanation: "When comparing String objects in Java, use the equals() method rather than == operator. The == operator compares object references, not the content."
    },
    {
      language: "java",
      incorrectCode: `public class NamePrinter {
    public static void main(String[] args) {
        String name = "John";
        printName(name);
    }
    
    public static void printname(String name) {
        System.out.println("Name: " + name);
    }
}`,
      correctCode: `public class NamePrinter {
    public static void main(String[] args) {
        String name = "John";
        printName(name);
    }
    
    public static void printName(String name) {
        System.out.println("Name: " + name);
    }
}`,
      differences: [7],
      explanation: "The method name is 'printname' (lowercase 'n') in the declaration, but called as 'printName' (capital 'N'). Java is case-sensitive for method names."
    }
  ],
  
  intermediate: [
    // JavaScript Intermediate Examples
    {
      language: "javascript",
      incorrectCode: `function fetchUserData() {
  return fetch('/api/user')
    .then(response => response.json())
    .then(data => {
      renderUserProfile(data);
    });
}`,
      correctCode: `function fetchUserData() {
  return fetch('/api/user')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      renderUserProfile(data);
    });
}`,
      differences: [3, 4, 5, 6, 7],
      explanation: "The improved version checks if the response is successful with response.ok before trying to parse it as JSON. This prevents errors when the API call fails."
    },
    {
      language: "javascript",
      incorrectCode: `const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(num => {
  if (num % 2 == 0) {
    return num;
  }
});
console.log(evenNumbers);`,
      correctCode: `const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.filter(num => {
  if (num % 2 == 0) {
    return true;
  }
  return false;
});
console.log(evenNumbers);`,
      differences: [4, 5, 6],
      explanation: "The filter method expects a boolean return value, not the element itself. The function should return true to keep the element or false to filter it out."
    },
    {
      language: "javascript",
      incorrectCode: `const userRoles = {
  admin: true,
  editor: false,
  viewer: true
};

for (let role in userRoles) {
  if (userRoles[role]) {
    console.log(role);
  }
}

userRoles.hasOwnProperty('moderator');`,
      correctCode: `const userRoles = {
  admin: true,
  editor: false,
  viewer: true
};

for (let role in userRoles) {
  if (userRoles.hasOwnProperty(role) && userRoles[role]) {
    console.log(role);
  }
}

Object.prototype.hasOwnProperty.call(userRoles, 'moderator');`,
      differences: [6, 11],
      explanation: "When iterating object properties, it's safer to check hasOwnProperty to avoid properties from the prototype chain. Also, using Object.prototype.hasOwnProperty.call is safer than direct method access."
    },
    {
      language: "javascript",
      incorrectCode: `function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

const handleSearch = debounce(function() {
  console.log("Searching...", this.value);
}, 300);

document.querySelector('input').addEventListener('input', handleSearch);`,
      correctCode: `function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

const handleSearch = debounce(function() {
  console.log("Searching...", this.value);
}, 300);

document.querySelector('input').addEventListener('input', handleSearch);`,
      differences: [4, 5, 6, 7, 8],
      explanation: "The original debounce function loses 'this' context and arguments. The fixed version preserves them by capturing the context and arguments before the setTimeout."
    },
    {
      language: "javascript",
      incorrectCode: `class Counter {
  constructor() {
    this.count = 0;
    document.getElementById('button').addEventListener('click', this.increment);
  }
  
  increment() {
    this.count += 1;
    console.log(this.count);
  }
}

const counter = new Counter();`,
      correctCode: `class Counter {
  constructor() {
    this.count = 0;
    document.getElementById('button').addEventListener('click', this.increment.bind(this));
  }
  
  increment() {
    this.count += 1;
    console.log(this.count);
  }
}

const counter = new Counter();`,
      differences: [4],
      explanation: "When using a class method as an event handler, 'this' will refer to the element that triggered the event, not the class instance. Using bind(this) preserves the correct context."
    },
    
    // Python Intermediate Examples
    {
      language: "python",
      incorrectCode: `def get_users_by_role(users, role):
    result = []
    for user in users:
        if user['role'] == role:
            result.append(user)
    return result

users = [
    {'name': 'Alice', 'role': 'admin'},
    {'name': 'Bob', 'role': 'user'},
    {'name': 'Charlie', 'role': 'admin'}
]

admins = get_users_by_role(users, 'admin')
print(admins)`,
      correctCode: `def get_users_by_role(users, role):
    return [user for user in users if user.get('role') == role]

users = [
    {'name': 'Alice', 'role': 'admin'},
    {'name': 'Bob', 'role': 'user'},
    {'name': 'Charlie', 'role': 'admin'}
]

admins = get_users_by_role(users, 'admin')
print(admins)`,
      differences: [2, 3, 4, 5],
      explanation: "The improved version uses a list comprehension for better readability and uses the safer .get() method to access dictionary keys, which will return None instead of raising a KeyError if the key doesn't exist."
    },
    {
      language: "python",
      incorrectCode: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance
        
    def deposit(self, amount):
        self.balance += amount
        return self.balance
        
    def withdraw(self, amount):
        self.balance -= amount
        return self.balance

account = BankAccount(1000)
print(account.withdraw(1500))`,
      correctCode: `class BankAccount:
    def __init__(self, balance):
        self.balance = balance
        
    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount
        return self.balance
        
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance

account = BankAccount(1000)
try:
    print(account.withdraw(1500))
except ValueError as e:
    print(f"Error: {e}")`,
      differences: [5, 6, 7, 11, 12, 13, 14, 18, 19, 20, 21],
      explanation: "The improved version adds validation to prevent negative amounts and withdrawals exceeding the balance, and includes error handling when using the class."
    },
    {
      language: "python",
      incorrectCode: `def read_data(filename):
    file = open(filename, 'r')
    data = file.read()
    file.close()
    return data

content = read_data('config.txt')
print(content)`,
      correctCode: `def read_data(filename):
    try:
        with open(filename, 'r') as file:
            data = file.read()
            return data
    except FileNotFoundError:
        print(f"Error: File {filename} not found")
        return None

content = read_data('config.txt')
if content:
    print(content)`,
      differences: [2, 3, 4, 5, 6, 7, 8, 11, 12],
      explanation: "The improved version uses a context manager (with statement) to ensure the file is properly closed even if an exception occurs, and includes error handling for missing files."
    },
    {
      language: "python",
      incorrectCode: `def cache_decorator(func):
    cache = {}
    
    def wrapper(n):
        if n in cache:
            return cache[n]
        result = func(n)
        cache[n] = result
        return result
    
    return wrapper

@cache_decorator
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(30))`,
      correctCode: `import functools

def cache_decorator(func):
    cache = {}
    
    @functools.wraps(func)
    def wrapper(n):
        if n in cache:
            return cache[n]
        result = func(n)
        cache[n] = result
        return result
    
    return wrapper

@cache_decorator
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(30))`,
      differences: [1, 5],
      explanation: "The improved decorator uses @functools.wraps to preserve the original function's metadata (like __name__, __doc__). It also imports the functools module which is a best practice for decorator writing."
    },
    {
      language: "python",
      incorrectCode: `class CircularBuffer:
    def __init__(self, size):
        self.size = size
        self.buffer = [None] * size
        self.head = 0
        self.tail = 0
        
    def add(self, item):
        self.buffer[self.tail] = item
        self.tail = (self.tail + 1) % self.size
        
    def get(self):
        item = self.buffer[self.head]
        self.head = (self.head + 1) % self.size
        return item

cb = CircularBuffer(3)
cb.add("A")
cb.add("B")
cb.add("C")
cb.add("D")
print(cb.get())
print(cb.get())`,
      correctCode: `class CircularBuffer:
    def __init__(self, size):
        self.size = size
        self.buffer = [None] * size
        self.head = 0
        self.tail = 0
        self.count = 0
        
    def add(self, item):
        if self.count == self.size:
            # Buffer is full, overwrite oldest item
            self.head = (self.head + 1) % self.size
        else:
            self.count += 1
            
        self.buffer[self.tail] = item
        self.tail = (self.tail + 1) % self.size
        
    def get(self):
        if self.count == 0:
            return None
            
        item = self.buffer[self.head]
        self.head = (self.head + 1) % self.size
        self.count -= 1
        return item

cb = CircularBuffer(3)
cb.add("A")
cb.add("B")
cb.add("C")
cb.add("D")
print(cb.get())  # Should print "B", not "A"
print(cb.get())  # Should print "C"`,
      differences: [5, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 31, 32],
      explanation: "The improved version adds a count to track the number of items in the buffer, handles the case when the buffer is full by advancing the head, and checks if the buffer is empty before getting an item."
    },
    
    // Java Intermediate Examples
    {
      language: "java",
      incorrectCode: `import java.util.ArrayList;

public class UserDatabase {
    private ArrayList<String> users = new ArrayList<>();
    
    public void addUser(String user) {
        users.add(user);
    }
    
    public boolean containsUser(String user) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i) == user) {
                return true;
            }
        }
        return false;
    }
}`,
      correctCode: `import java.util.ArrayList;
import java.util.List;

public class UserDatabase {
    private final List<String> users = new ArrayList<>();
    
    public void addUser(String user) {
        if (user != null && !containsUser(user)) {
            users.add(user);
        }
    }
    
    public boolean containsUser(String user) {
        if (user == null) {
            return false;
        }
        
        for (String existingUser : users) {
            if (existingUser.equals(user)) {
                return true;
            }
        }
        return false;
    }
}`,
      differences: [2, 4, 7, 8, 12, 13, 14, 15, 16, 17, 18],
      explanation: "The improved version uses the List interface instead of the ArrayList implementation, adds null checks, prevents duplicate users, uses the equals method instead of == for string comparison, and uses a for-each loop for cleaner iteration."
    },
    {
      language: "java",
      incorrectCode: `import java.util.HashMap;

public class CacheManager {
    private HashMap<String, Object> cache = new HashMap<>();
    
    public void put(String key, Object value) {
        cache.put(key, value);
    }
    
    public Object get(String key) {
        return cache.get(key);
    }
}`,
      correctCode: `import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class CacheManager {
    private final Map<String, Object> cache = new ConcurrentHashMap<>();
    
    public void put(String key, Object value) {
        if (key != null && value != null) {
            cache.put(key, value);
        }
    }
    
    public Object get(String key) {
        if (key == null) {
            return null;
        }
        return cache.get(key);
    }
    
    public boolean contains(String key) {
        return key != null && cache.containsKey(key);
    }
}`,
      differences: [2, 3, 5, 8, 9, 13, 14, 15, 16, 18, 19, 20, 21],
      explanation: "The improved version uses ConcurrentHashMap for thread safety, adds null checks, uses the Map interface instead of the HashMap implementation, and adds a contains method for checking key existence."
    },
    {
      language: "java",
      incorrectCode: `import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class FileProcessor {
    public static String readFile(String path) throws IOException {
        File file = new File(path);
        FileReader reader = new FileReader(file);
        
        StringBuilder content = new StringBuilder();
        int character;
        while ((character = reader.read()) != -1) {
            content.append((char) character);
        }
        
        reader.close();
        return content.toString();
    }
}`,
      correctCode: `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class FileProcessor {
    public static String readFile(String path) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append(System.lineSeparator());
            }
            return content.toString();
        }
        
        // Alternative modern approach
        // return new String(Files.readAllBytes(Paths.get(path)));
    }
}`,
      differences: [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      explanation: "The improved version uses BufferedReader for more efficient reading, uses try-with-resources to ensure resources are closed properly, reads line by line instead of character by character, and includes a commented alternative using the newer Files API."
    },
    {
      language: "java",
      incorrectCode: `public class UserValidator {
    public boolean validateUsername(String username) {
        if (username.length() < 3) {
            return false;
        }
        if (username.length() > 20) {
            return false;
        }
        return true;
    }
    
    public boolean validateEmail(String email) {
        if (!email.contains("@")) {
            return false;
        }
        return true;
    }
}`,
      correctCode: `import java.util.regex.Pattern;

public class UserValidator {
    private static final int MIN_USERNAME_LENGTH = 3;
    private static final int MAX_USERNAME_LENGTH = 20;
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
        
    public boolean validateUsername(String username) {
        if (username == null) {
            return false;
        }
        
        int length = username.length();
        return length >= MIN_USERNAME_LENGTH && length <= MAX_USERNAME_LENGTH;
    }
    
    public boolean validateEmail(String email) {
        if (email == null) {
            return false;
        }
        
        return EMAIL_PATTERN.matcher(email).matches();
    }
}`,
      differences: [1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      explanation: "The improved version uses regex for email validation, constants for readability and maintainability, null checks to prevent NullPointerExceptions, and simplifies the logic with boolean expressions."
    },
    {
      language: "java",
      incorrectCode: `public class Counter {
    private int count;
    
    public Counter() {
        count = 0;
    }
    
    public void increment() {
        count++;
    }
    
    public void decrement() {
        count--;
    }
    
    public int getCount() {
        return count;
    }
}`,
      correctCode: `public class Counter {
    private volatile int count;
    private final Object lock = new Object();
    
    public Counter() {
        count = 0;
    }
    
    public void increment() {
        synchronized(lock) {
            count++;
        }
    }
    
    public void decrement() {
        synchronized(lock) {
            if (count > 0) {
                count--;
            }
        }
    }
    
    public int getCount() {
        synchronized(lock) {
            return count;
        }
    }
    
    public void reset() {
        synchronized(lock) {
            count = 0;
        }
    }
}`,
      differences: [2, 3, 8, 9, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28],
      explanation: "The improved version makes the counter thread-safe by adding synchronization and a lock object, prevents negative values in the decrement method, uses the volatile keyword for visibility across threads, and adds a reset method for additional functionality."
    }
  ],
  
  advanced: [
    // JavaScript Advanced Examples
    {
      language: "javascript",
      incorrectCode: `class EventEmitter {
      constructor() {
        this.events = {};
      }
    
      on(event, listener) {
        if (!this.events[event]) {
          this.events[event] = [];
        }
        this.events[event].push(listener);
      }
    
      emit(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
      }
    
      off(event, listener) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
      }
    }`,
      correctCode: `class EventEmitter {
      constructor() {
        this.events = new Map();
      }
    
      on(event, listener) {
        if (typeof listener !== 'function') {
          throw new TypeError('Listener must be a function');
        }
        
        if (!this.events.has(event)) {
          this.events.set(event, new Set());
        }
        this.events.get(event).add(listener);
        
        return this; // For method chaining
      }
    
      emit(event, ...args) {
        const listeners = this.events.get(event);
        if (!listeners) return false;
        
        listeners.forEach(listener => {
          try {
            listener.apply(this, args);
          } catch (error) {
            console.error('Error in event listener:', error);
          }
        });
        
        return true;
      }
    
      off(event, listener) {
        if (!this.events.has(event)) return this;
        
        if (listener) {
          this.events.get(event).delete(listener);
          // Clean up empty event collections
          if (this.events.get(event).size === 0) {
            this.events.delete(event);
          }
        } else {
          this.events.delete(event);
        }
        
        return this;
      }
    
      once(event, listener) {
        const onceWrapper = (...args) => {
          this.off(event, onceWrapper);
          listener.apply(this, args);
        };
        
        return this.on(event, onceWrapper);
      }
    }`,
    differences: [3,6,7,8,11,12,15,16],
    explanation: "The incorrect EventEmitter uses plain objects and arrays instead of Map and Set structures, lacks error handling in emit, and cannot properly clean up empty listeners."
  },
    
    // Question 2: Memoization Function
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
      correctCode: `function memoize(fn, hashFunction) {
      // Use Map instead of plain object for better key handling
      const cache = new Map();
      
      // Default hash function stringifies arguments
      const hash = hashFunction || ((...args) => {
        try {
          return JSON.stringify(args);
        } catch (error) {
          // Handle circular references or non-serializable values
          return args.map(arg => String(arg)).join('|');
        }
      });
      
      function memoized(...args) {
        const key = hash(...args);
        
        if (cache.has(key)) {
          return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        
        // Handle promise results
        if (result instanceof Promise) {
          return result.then(value => {
            cache.set(key, value);
            return value;
          }).catch(error => {
            // Don't cache errors
            throw error;
          });
        }
        
        cache.set(key, result);
        return result;
      }
      
      // Add ability to clear cache
      memoized.clearCache = () => cache.clear();
      memoized.getCacheSize = () => cache.size;
      
      return memoized;
    }`,
    differences: [2,6,7,10],
    explanation: "The incorrect memoize function uses a plain object instead of a Map for caching and improperly accesses keys with direct object access, leading to possible collision issues."
  },
  ],
}