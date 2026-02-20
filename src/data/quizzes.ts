export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export const quizzesData: Record<string, QuizQuestion[]> = {
  program1: [
    {
      id: "q1_1",
      question: "What does the 'malloc' function do in C?",
      options: [
        "Frees memory that was previously allocated",
        "Dynamically allocates a single block of memory",
        "Allocates memory for an array and initializes to zero",
        "Resizes an existing memory block",
      ],
      correctAnswerIndex: 1,
      explanation:
        "malloc (memory allocation) dynamically allocates a single large block of memory with the specified size and returns a pointer of type void.",
    },
    {
      id: "q1_2",
      question:
        "In the calendar program, what does the arrow operator '->' access?",
      options: [
        "A pointer's memory address",
        "A global variable",
        "A member of a structure through a pointer",
        "The size of a structure",
      ],
      correctAnswerIndex: 2,
      explanation:
        "The arrow operator '->' allows you to access members of a structure or union using a pointer variable.",
    },
  ],
  program2: [
    {
      id: "q2_1",
      question: "What is the primary purpose of the stringmatch function?",
      options: [
        "To reverse a string",
        "To find a pattern and replace it within a main string",
        "To count the number of characters in a string",
        "To concatenate two strings",
      ],
      correctAnswerIndex: 1,
      explanation:
        "The algorithm searches for a pattern (pat) inside the main string (str) and replaces it with the replacement string (rep).",
    },
  ],
  program3: [
    {
      id: "q3_1",
      question:
        "Which data structure follows the LIFO (Last In First Out) principle?",
      options: ["Queue", "Linked List", "Stack", "Array"],
      correctAnswerIndex: 2,
      explanation:
        "A Stack follows LIFO, meaning the last element added is the first one to be removed.",
    },
    {
      id: "q3_2",
      question: "What happens when 'pop()' is called on an empty stack?",
      options: [
        "Stack Overflow",
        "Stack Underflow",
        "The top element is removed",
        "An element is added to the top",
      ],
      correctAnswerIndex: 1,
      explanation:
        "Stack Underflow occurs when trying to remove an element from an empty stack.",
    },
  ],
  program4: [
    {
      id: "q4_1",
      question:
        "In converting an infix expression to a postfix expression, which operator usually has the highest precedence?",
      options: [
        "Addition (+)",
        "Multiplication (*)",
        "Exponentiation (^)",
        "Division (/)",
      ],
      correctAnswerIndex: 2,
      explanation:
        "According to standard operator precedence rules in programming, exponentiation (^) has higher priority than multiplication, division, addition, or subtraction.",
    },
  ],
  program5a: [
    {
      id: "q5a_1",
      question: "How do you evaluate a postfix expression '5 2 3 * +'?",
      options: ["11", "15", "25", "10"],
      correctAnswerIndex: 0,
      explanation:
        "Push 5, push 2, push 3. Encounter '*': pop 3 and 2, multiply to get 6, push 6. Encounter '+': pop 6 and 5, add to get 11. Push 11.",
    },
  ],
  program5b: [
    {
      id: "q5b_1",
      question:
        "For the Tower of Hanoi problem with 'n' discs, what is the minimum number of moves required?",
      options: ["n^2", "2^n - 1", "n!", "2 * n + 1"],
      correctAnswerIndex: 1,
      explanation:
        "The minimum number of moves to solve the Tower of Hanoi puzzle with n discs is 2^n - 1.",
    },
  ],
  program6: [
    {
      id: "q6_1",
      question:
        "What is a main advantage of a Circular Queue over a simple linear Queue?",
      options: [
        "Faster insertion time",
        "It can hold unlimited elements",
        "Memory utilization is better by reusing freed spaces",
        "It requires fewer pointers",
      ],
      correctAnswerIndex: 2,
      explanation:
        "In a simple queue, once the rear pointer reaches the end, elements cannot be inserted even if the front spaces are vacant. A circular queue loops back to the start, effectively utilizing empty spaces.",
    },
    {
      id: "q6_2",
      question: "What is the condition for a Circular Queue full state?",
      options: [
        "front == -1",
        "rear == MAX - 1",
        "(rear + 1) % MAX == front",
        "front == rear",
      ],
      correctAnswerIndex: 2,
      explanation:
        "If the next position of the rear pointer circularly points to the front pointer, the queue is considered full.",
    },
  ],
  program7: [
    {
      id: "q7_1",
      question: "What does each node in a Singly Linked List contain?",
      options: [
        "Data and a pointer to the previous node",
        "Data and a pointer to the next node",
        "Only data",
        "Pointers to both next and previous nodes",
      ],
      correctAnswerIndex: 1,
      explanation:
        "A node in a Singly Linked List holds the node's data and a reference (pointer) to the next node in the sequence.",
    },
  ],
  program8: [
    {
      id: "q8_1",
      question:
        "Which of the following operations is generally more efficient in a Doubly Linked List compared to a Singly Linked List?",
      options: [
        "Accessing an element by index",
        "Traversing the list backward",
        "Inserting an element at the front",
        "Deleting the head node",
      ],
      correctAnswerIndex: 1,
      explanation:
        "A doubly linked list has generic 'prev' pointers, making backward traversal straightforward, unlike a singly linked list which only moves forward.",
    },
  ],
  program9: [
    {
      id: "q9_1",
      question:
        "How are polynomials typically represented using Singly Circular Linked Lists?",
      options: [
        "Each node stores one coefficient and specific powers for variables",
        "A single node stores all coefficients of the polynomial",
        "Polynomials cannot be represented using circular linked lists",
        "Each node stores the entire equation string",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Common practice represents each term of a polynomial as a node storing the coefficient and the variable exponents (e.g., x_exp, y_exp, z_exp).",
    },
  ],
  program10: [
    {
      id: "q10_1",
      question: "What is a key property of a Binary Search Tree (BST)?",
      options: [
        "All leaf nodes must be at the same level",
        "The left child is smaller than the parent node, and the right child is greater",
        "Each node can have up to 3 children",
        "In-order traversal visits nodes in descending order",
      ],
      correctAnswerIndex: 1,
      explanation:
        "In a BST, for any given node, all elements in its left subtree are smaller, and all elements in its right subtree are larger.",
    },
  ],
  program11: [
    {
      id: "q11_1",
      question:
        "Which graph traversal algorithm explores vertex neighbors before their deeper descendants?",
      options: [
        "Depth First Search (DFS)",
        "Breadth First Search (BFS)",
        "Kruskal's Algorithm",
        "Dijkstra's Algorithm",
      ],
      correctAnswerIndex: 1,
      explanation:
        "BFS explores the graph layer by layer, visiting all neighbors of a node before moving to the next level.",
    },
  ],
  program12: [
    {
      id: "q12_1",
      question: "What is Double Hashing used for?",
      options: [
        "Encoding passwords twice for security",
        "Searching an array linearly",
        "Resolving hash collisions",
        "Sorting an array",
      ],
      correctAnswerIndex: 2,
      explanation:
        "Double hashing is a collision resolution technique where a second hash function is used to compute an offset if the initial bucket is occupied.",
    },
  ],
};
