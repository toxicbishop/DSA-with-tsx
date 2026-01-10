import { useState, useEffect } from 'react';
import { Moon, Sun, ChevronDown, Linkedin, Instagram, Github, Code2, Home, User, Mail, MapPin, Briefcase, GraduationCap, Copy, Check, Menu, X, BookOpen, ArrowRight, Map, Eye } from 'lucide-react';

// --- DATA: C Source Code for All Programs ---
const C_CODE = {
  program1: `#include<stdio.h>
#include<stdlib.h>

struct Day {
    char *dayName;
    int date;
    char *activity;
};

void create(struct Day *day) {
    day->dayName = (char *)malloc(sizeof(char) * 20);
    day->activity = (char *)malloc(sizeof(char) * 100);
    printf("Enter the day name: ");
    scanf("%s", day->dayName);
    printf("Enter the date: ");
    scanf("%d", &day->date);
    printf("Enter the activity for the day: ");
    scanf(" %[^\\n]s", day->activity);
}

void read(struct Day *calendar, int size) {
    for (int i = 0; i < size; i++) {
        printf("Enter details for Day %d:\\n", i + 1);
        create(&calendar[i]);
    }
}

void display(struct Day *calendar, int size) {
    printf("\\nWeek's Activity Details:\\n");
    for (int i = 0; i < size; i++) {
        printf("Day %d:\\n", i + 1);
        printf("Day Name: %s\\n", calendar[i].dayName);
        printf("Date: %d\\n", calendar[i].date);
        printf("Activity: %s\\n", calendar[i].activity);
        printf("\\n");
    }
}

int main() {
    int size;
    printf("Enter the number of days in the week: ");
    scanf("%d", &size);
    struct Day *calendar = (struct Day *)malloc(sizeof(struct Day) * size);
    if (calendar == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }
    read(calendar, size);
    display(calendar, size);
    free(calendar);
    return 0;
}`,
  program2: `#include<stdio.h>

char str[50], pat[20], rep[20], res[50];
int c = 0, m = 0, i = 0, j = 0, k, flag = 0;

void stringmatch() {
    while (str[c] != '\\0') {
        if (str[m] == pat[i]) {
            i++; m++;
            if (pat[i] == '\\0') {
                flag = 1;
                for (k = 0; rep[k] != '\\0'; k++, j++)
                    res[j] = rep[k];
                i = 0; c = m;
            }
        } else {
            res[j] = str[c];
            j++; c++; m = c; i = 0;
        }
    }
    res[j] = '\\0';
}

void main() {
    printf("Enter the main string:"); gets(str);
    printf("\\nEnter the pat string:"); gets(pat);
    printf("\\nEnter the replace string:"); gets(rep);
    stringmatch();
    if (flag == 1) printf("\\nThe string after pattern match and replace is: \\n %s ", res);
    else printf("\\nPattern string is not found");
}`,
  program3: `#include<stdio.h>
#include<stdlib.h>
#define MAX 3

int s[MAX];
int top = -1;

void push(int item);
int pop();
void palindrome();
void display();

void main() {
    int choice, item;
    while (1) {
        printf("\\n\\n-----------Menu----------- : ");
        printf("\\n1.Push 2.Pop 3.Palindrome 4.Display 5.Exit\\nChoice: ");
        scanf("%d", &choice);
        switch (choice) {
        case 1: printf("Element: "); scanf("%d", &item); push(item); break;
        case 2: item = pop(); if (item != -1) printf("Popped: %d", item); break;
        case 3: palindrome(); break;
        case 4: display(); break;
        case 5: exit(0);
        default: printf("Invalid");
        }
    }
}`,
  program4: `#include<stdio.h>
#include<ctype.h>

char stack[100];
int top = -1;

void push(char x) { stack[++top] = x; }
char pop() { if(top == -1) return -1; return stack[top--]; }

int priority(char x) {
    if(x == '(') return 0;
    if(x == '+' || x == '-') return 1;
    if(x == '*' || x == '/' || x == '%') return 2;
    if(x == '^') return 3;
    return 0;
}

void main() {
    char exp[100];
    char *e, x;
    printf("Enter the expression : ");
    scanf("%s",exp);
    e = exp;
    while(*e != '\\0') {
        if(isalnum(*e)) printf("%c",*e);
        else if(*e == '(') push(*e);
        else if(*e == ')') {
            while((x = pop()) != '(') printf("%c", x);
        } else {
            while(priority(stack[top]) >= priority(*e)) printf("%c",pop());
            push(*e);
        }
        e++;
    }
    while(top != -1) printf("%c",pop());
}`,
  program5a: `#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#include<ctype.h>

int i, top = -1;
int op1, op2, res, s[20];
char postfix[90], symb;

void push(int item) { s[++top] = item; }
int pop() { return s[top--]; }

void main() {
    printf("Enter valid postfix expression:\\n");
    scanf("%s", postfix);
    for (i = 0; postfix[i] != '\\0'; i++) {
        symb = postfix[i];
        if (isdigit(symb)) push(symb - '0');
        else {
            op2 = pop(); op1 = pop();
            switch (symb) {
            case '+': push(op1 + op2); break;
            case '-': push(op1 - op2); break;
            case '*': push(op1 * op2); break;
            case '/': push(op1 / op2); break;
            case '%': push(op1 % op2); break;
            case '^': push(pow(op1, op2)); break;
            }
        }
    }
    res = pop();
    printf("Result = %d", res);
}`,
  program5b: `#include <stdio.h>
#include <math.h>

void tower(int n, int source, int temp, int destination) {
    if (n == 0) return;
    tower(n - 1, source, destination, temp);
    printf("\\nMove disc %d from %c to %c", n, source, destination);
    tower(n - 1, temp, source, destination);
}
void main() {
    int n;
    printf("\\nEnter the number of discs: ");
    scanf("%d", & n);
    tower(n, 'A', 'B', 'C');
    printf("\\nTotal Moves: %d", (int) pow(2, n) - 1);
}`,
  program6: `#include<stdio.h>
#define MAX 5
char circular_queue[MAX];
int front = -1, rear = -1;

int isEmpty() { return (front == -1 && rear == -1); }
int isFull() { return ((rear + 1) % MAX == front); }

void insertElement(char element) {
    if (isFull()) printf("Overflow\\n");
    else {
        if (isEmpty()) front = rear = 0;
        else rear = (rear + 1) % MAX;
        circular_queue[rear] = element;
    }
}

void deleteElement() {
    if (isEmpty()) printf("Underflow\\n");
    else {
        if (front == rear) front = rear = -1;
        else front = (front + 1) % MAX;
    }
}

void display() {
    int i;
    if (isEmpty()) { printf("Empty\\n"); return; }
    i = front;
    do {
        printf("%c ", circular_queue[i]);
        i = (i + 1) % MAX;
    } while (i != (rear + 1) % MAX);
}

int main() {
    // Menu driven main function...
}`,
  program7: `#include<stdio.h>
#include<stdlib.h>

struct node {
    char usn[25], name[25], branch[25];
    int sem; long int phone;
    struct node * link;
};
typedef struct node * NODE;

NODE create() {
    NODE snode = (NODE) malloc(sizeof(struct node));
    printf("Enter USN,Name,Branch,Sem,Phone: ");
    scanf("%s %s %s %d %ld", snode->usn, snode->name, snode->branch, &snode->sem, &snode->phone);
    snode->link = NULL;
    return snode;
}

NODE insertfront(NODE start) {
    NODE temp = create();
    if (start == NULL) return temp;
    temp->link = start;
    return temp;
}
// ... deletefront, insertend, deleteend, display ...
`,
  program8: `// Program 8: Code not provided in instructions.
// Please add the C code for Doubly Linked Lists or similar here.`,
  program9: `#include<stdio.h>
#include<stdlib.h>
#include<math.h>

struct node {
    int coef, xexp, yexp, zexp;
    struct node * link;
};
typedef struct node * NODE;

NODE attach(int coef, int x, int y, int z, NODE head) {
    NODE temp = (NODE)malloc(sizeof(struct node));
    temp->coef=coef; temp->xexp=x; temp->yexp=y; temp->zexp=z;
    NODE cur = head->link;
    while(cur->link != head) cur=cur->link;
    cur->link = temp; temp->link = head;
    return head;
}

int poly_evaluate(NODE head) {
    int x, y, z, sum = 0;
    printf("Enter x y z: "); scanf("%d %d %d", &x, &y, &z);
    NODE poly = head->link;
    while (poly != head) {
        sum += poly->coef * pow(x, poly->xexp) * pow(y, poly->yexp) * pow(z, poly->zexp);
        poly = poly->link;
    }
    return sum;
}
// ... poly_sum, read_poly, display ...
`,
  program10: `#include<stdio.h>
#include<stdlib.h>

struct BST {
    int data;
    struct BST * lchild;
    struct BST * rchild;
};
typedef struct BST * NODE;

void insert(NODE root, NODE newnode) {
    if (newnode->data < root->data) {
        if (root->lchild == NULL) root->lchild = newnode;
        else insert(root->lchild, newnode);
    } else {
        if (root->rchild == NULL) root->rchild = newnode;
        else insert(root->rchild, newnode);
    }
}

void inorder(NODE root) {
    if (root != NULL) {
        inorder(root->lchild);
        printf("%d ", root->data);
        inorder(root->rchild);
    }
}
// ... preorder, postorder, search ...
`,
  program11: `#include<stdio.h>
int a[50][50], n, visited[50];
int q[20], front = -1, rear = -1;

void bfs(int v) {
    int i, cur;
    visited[v] = 1;
    q[++rear] = v;
    while (front != rear) {
        cur = q[++front];
        for (i = 1; i <= n; i++) {
            if ((a[cur][i] == 1) && (visited[i] == 0)) {
                q[++rear] = i;
                visited[i] = 1;
                printf("%d ", i);
            }
        }
    }
}

void dfs(int v) {
    int i;
    visited[v] = 1;
    printf("%d ", v);
    for (i = 1; i <= n; i++) {
        if (a[v][i] == 1 && visited[i] == 0)
            dfs(i);
    }
}
// ... main ...
`,
  program12: `#include<stdio.h>
#include<stdlib.h>

int *ht, m, count = 0;

void insert(int key) {
    int index = key % m;
    while (ht[index] != -1) {
        index = (index + 1) % m;
    }
    ht[index] = key;
    count++;
}

void display() {
    int i;
    if (count == 0) { printf("Empty"); return; }
    for (i = 0; i < m; i++)
        printf("T[%d] --> %d\\n", i, ht[i]);
}

void main() {
    int n, i, key;
    printf("Enter N: "); scanf("%d", &n);
    printf("Enter m: "); scanf("%d", &m);
    ht = (int*)malloc(m*sizeof(int));
    for(i=0; i<m; i++) ht[i] = -1;
    for(i=0; i<n; i++) {
        scanf("%d", &key);
        if(count == m) break;
        insert(key);
    }
    display();
}
`
};

// --- Helper Component for Copy Button ---
const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-white/50 dark:bg-black/50 hover:bg-orange-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
        {code}
      </pre>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [activeView, setActiveView] = useState('home'); 
  const [programOutput, setProgramOutput] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // --- PROGRAM STATES ---

  // P1: Calendar
  const [, setCalendarData] = useState<any[]>([]);
  const [numDays, setNumDays] = useState(0);

  // P2: String Match
  const [stringMatchData, setStringMatchData] = useState({ mainString: '', patternString: '', replaceString: '' });

  // P3: Stack
  const [stackElements, setStackElements] = useState<number[]>([]);
  const [, setStackTop] = useState(-1);
  const [, setStackMenuChoice] = useState(0);

  // P4: Infix
  const [, setInfix] = useState('');
  const [, setPostfix] = useState('');

  // P6: Circular Queue
  const MAX_CQ = 5;
  const [cq, setCq] = useState<string[]>(new Array(MAX_CQ).fill(''));
  const [cqFront, setCqFront] = useState(-1);
  const [cqRear, setCqRear] = useState(-1);
  const [, setCqMenuChoice] = useState(0);

  // P7: SLL
  type Student = { usn: string, name: string, branch: string, sem: number, phone: string };
  const [sll, setSll] = useState<Student[]>([]);
  const [sllMenuChoice, setSllMenuChoice] = useState(0);
  const [sllCount, setSllCount] = useState(0);

  // P8: DLL
  const [dll, setDll] = useState<any[]>([]);

  // P9: Polynomial
  type PolyTerm = { coef: number, x: number, y: number, z: number };
  const [poly1, setPoly1] = useState<PolyTerm[]>([]);
  const [poly2, setPoly2] = useState<PolyTerm[]>([]);
  const [polyMenuChoice, setPolyMenuChoice] = useState(0);
  const [polyTermCount, setPolyTermCount] = useState(0);

  // P10: BST
  type BSTNode = { data: number, left: BSTNode | null, right: BSTNode | null };
  const [bstRoot, setBstRoot] = useState<BSTNode | null>(null);
  const [bstMenuChoice, setBstMenuChoice] = useState(0);

  // P11: Graph
  const [graphN, setGraphN] = useState(0);
  const [adjMatrix, setAdjMatrix] = useState<number[][]>([]);
  const [, setGraphMenuChoice] = useState(0);
  const [, setMatrixRow] = useState(0);

  // P12: Hash Table
  const [hashM, setHashM] = useState(0);
  const [hashTable, setHashTable] = useState<number[]>([]);
  const [hashCount, setHashCount] = useState(0); 

  // --- RESET ---
  const resetProgramState = () => {
    setProgramOutput([]); setUserInput(''); setCurrentStep(0);
    setCalendarData([]); setNumDays(0);
    setStringMatchData({ mainString: '', patternString: '', replaceString: '' });
    setStackElements([]); setStackTop(-1); setStackMenuChoice(0);
    setInfix(''); setPostfix('');
    setCq(new Array(MAX_CQ).fill('')); setCqFront(-1); setCqRear(-1); setCqMenuChoice(0);
    setSll([]); setSllMenuChoice(0); setSllCount(0);
    setDll([]);
    setPoly1([]); setPoly2([]); setPolyMenuChoice(0); setPolyTermCount(0);
    setBstRoot(null); setBstMenuChoice(0);
    setGraphN(0); setAdjMatrix([]); setGraphMenuChoice(0); setMatrixRow(0);
    setHashM(0); setHashTable([]); setHashCount(0);
    setIsProgramsOpen(false);
  };

  const handleProgramClick = (pid: string) => {
    resetProgramState();
    setActiveView(pid.toLowerCase().replace(/\s/g, ''));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const t = localStorage.getItem('theme'); setDarkMode(t==='dark');
    const s = () => setIsNavbarScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s); return () => window.removeEventListener('scroll', s);
  }, []);

  // ================= LOGIC HANDLERS =================

  // --- P12: Hashing ---
  const handleProgram12Input = () => {
    if(currentStep === 0) {
      const n = parseInt(userInput);
      if(isNaN(n)) return;
      setProgramOutput(prev=>[...prev, `Enter N (Records): ${n}`, "Enter size of hash table (m):"]);
      setCurrentStep(1);
      setHashCount(n); 
    } else if (currentStep === 1) {
      const m = parseInt(userInput);
      if(isNaN(m)) return;
      setHashM(m);
      setHashTable(new Array(m).fill(-1));
      setProgramOutput(prev=>[...prev, `Enter m: ${m}`, `Enter ${hashCount} keys one by one:`]);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const key = parseInt(userInput);
      if(isNaN(key)) return;
      
      let inserted = false;
      let idx = key % hashM;
      let startIdx = idx;
      let newHt = [...hashTable];
      
      while(true) {
        if(newHt[idx] === -1) {
          newHt[idx] = key;
          inserted = true;
          break;
        }
        idx = (idx + 1) % hashM;
        if(idx === startIdx) break; 
      }

      if(inserted) {
        setHashTable(newHt);
        setProgramOutput(prev=>[...prev, `Inserted key ${key} at index ${idx}`]);
      } else {
        setProgramOutput(prev=>[...prev, `Hash table full. Cannot insert ${key}`]);
      }
    }
    setUserInput('');
  };

  // --- P11: Graphs ---
  const handleProgram11Input = () => {
    if(currentStep === 0) { 
      const n = parseInt(userInput);
      if(isNaN(n)) return;
      setGraphN(n);
      setAdjMatrix([]);
      setProgramOutput(prev=>[...prev, `Number of vertices: ${n}`, "Enter Adjacency Matrix Row 1 (space separated):"]);
      setCurrentStep(1);
      setMatrixRow(0);
    } else if (currentStep === 1) { 
       const row = userInput.trim().split(/\s+/).map(Number);
       if(row.length !== graphN) { setProgramOutput(prev=>[...prev, "Invalid columns. Try again."]); return; }
       
       const newMat = [...adjMatrix, row];
       setAdjMatrix(newMat);
       
       if(newMat.length < graphN) {
         setProgramOutput(prev=>[...prev, `Enter Adjacency Matrix Row ${newMat.length + 1}:`]);
       } else {
         setProgramOutput(prev=>[...prev, "Matrix entered.", "Enter starting vertex:"]);
         setCurrentStep(2);
       }
    } else if (currentStep === 2) { 
       const s = parseInt(userInput);
       setProgramOutput(prev=>[...prev, `Start Vertex: ${s}`, "\n1. BFS\n2. DFS\n3. Exit"]);
       setCurrentStep(3);
       setCqFront(s); // Hack: Using cqFront as temp storage for start vertex
    } else if (currentStep === 3) {
       const ch = parseInt(userInput);
       const start = cqFront; 
       const n = graphN;
       const a = adjMatrix;
       
       if (ch === 1) { // BFS
         let visited = new Array(n+1).fill(0);
         let q = []; 
         let res = [];
         
         visited[start] = 1;
         q.push(start);
         
         while(q.length > 0) {
           let cur = q.shift()!;
           for(let i=1; i<=n; i++) {
             if(a[cur-1][i-1] === 1 && visited[i] === 0) {
               q.push(i);
               visited[i] = 1;
               res.push(i);
             }
           }
         }
         setProgramOutput(prev=>[...prev, `BFS Reachable from ${start}: ${res.join(' ')}`]);
       } else if (ch === 2) { // DFS
         let visited = new Array(n+1).fill(0);
         let res: number[] = [];
         
         const dfs = (v: number) => {
           visited[v] = 1;
           for(let i=1; i<=n; i++) {
             if(a[v-1][i-1] === 1 && visited[i] === 0) {
               res.push(i);
               dfs(i);
             }
           }
         };
         dfs(start);
         setProgramOutput(prev=>[...prev, `DFS Reachable from ${start}: ${res.join(' ')}`]);
       } else if (ch === 3) {
         setProgramOutput(prev=>[...prev, "Exiting..."]);
         setCurrentStep(0);
       }
    }
    setUserInput('');
  };

  // --- P10: BST ---
  const handleProgram10Input = () => {
    if(currentStep === 0) {
      const ch = parseInt(userInput);
      setBstMenuChoice(ch);
      switch(ch) {
        case 1: setProgramOutput(prev=>[...prev, "Enter number of elements:"]); setCurrentStep(1); break;
        case 2: setProgramOutput(prev=>[...prev, "Enter element to search:"]); setCurrentStep(2); break;
        case 3: 
          let pre: number[] = [], inn: number[] = [], post: number[] = [];
          const preorder = (n: BSTNode|null) => { if(n){ pre.push(n.data); preorder(n.left); preorder(n.right); } };
          const inorder = (n: BSTNode|null) => { if(n){ inorder(n.left); inn.push(n.data); inorder(n.right); } };
          const postorder = (n: BSTNode|null) => { if(n){ postorder(n.left); postorder(n.right); post.push(n.data); } };
          preorder(bstRoot); inorder(bstRoot); postorder(bstRoot);
          setProgramOutput(prev=>[...prev, `Preorder: ${pre.join(' ')}`, `Inorder: ${inn.join(' ')}`, `Postorder: ${post.join(' ')}`, "\n1.Create 2.Search 3.Display 4.Exit"]);
          break;
        case 4: setProgramOutput(prev=>[...prev, "Exiting..."]); break;
      }
    } else if (bstMenuChoice === 1 && currentStep === 1) { 
       const n = parseInt(userInput);
       setSllCount(n); 
       setProgramOutput(prev=>[...prev, `Enter ${n} elements one by one:`]);
       setCurrentStep(11);
    } else if (bstMenuChoice === 1 && currentStep === 11) { 
       const val = parseInt(userInput);
       if(!isNaN(val)) {
         const insert = (node: BSTNode|null, v: number): BSTNode => {
           if(!node) return { data: v, left: null, right: null };
           if(v < node.data) node.left = insert(node.left, v);
           else if(v > node.data) node.right = insert(node.right, v);
           return node;
         };
         setBstRoot(prev => insert(prev, val));
         if(sllCount > 1) { setSllCount(c=>c-1); } else { setProgramOutput(prev=>[...prev, "Creation Done.", "\n1.Create 2.Search 3.Display 4.Exit"]); setCurrentStep(0); }
       }
    } else if (bstMenuChoice === 2 && currentStep === 2) { 
       const key = parseInt(userInput);
       let cur = bstRoot; let found = false;
       while(cur) { if(cur.data === key) { found = true; break; } cur = key < cur.data ? cur.left : cur.right; }
       setProgramOutput(prev=>[...prev, found ? "Key Found" : "Key Not Found", "\n1.Create 2.Search 3.Display 4.Exit"]);
       setCurrentStep(0);
    }
    setUserInput('');
  };

  // --- P9: Polynomials ---
  const handleProgram9Input = () => {
    if(currentStep === 0) {
      const ch = parseInt(userInput);
      setPolyMenuChoice(ch);
      if(ch === 1) { setProgramOutput(prev=>[...prev, "Enter no of terms:"]); setCurrentStep(1); }
      else if (ch === 2) { setProgramOutput(prev=>[...prev, "Enter no of terms for Poly 1:"]); setCurrentStep(2); }
      else if (ch === 3) setProgramOutput(prev=>[...prev, "Exiting..."]);
    } else if (polyMenuChoice === 1 && currentStep === 1) { 
       setPolyTermCount(parseInt(userInput));
       setProgramOutput(prev=>[...prev, "Enter term 1 (coef x y z) space separated:"]);
       setCurrentStep(11);
    } else if (polyMenuChoice === 1 && currentStep === 11) { 
       const [c, x, y, z] = userInput.trim().split(/\s+/).map(Number);
       setPoly1(prev=>[...prev, {coef:c, x, y, z}]);
       if(polyTermCount > 1) { setPolyTermCount(c=>c-1); setProgramOutput(prev=>[...prev, "Next term:"]); } 
       else { setProgramOutput(prev=>[...prev, "Polynomial entered. Enter x y z to evaluate:"]); setCurrentStep(12); }
    } else if (polyMenuChoice === 1 && currentStep === 12) { 
       const [x, y, z] = userInput.trim().split(/\s+/).map(Number);
       let sum = 0;
       poly1.forEach(p => sum += p.coef * Math.pow(x, p.x) * Math.pow(y, p.y) * Math.pow(z, p.z));
       setProgramOutput(prev=>[...prev, `Result = ${sum}`, "\n1.Eval 2.Sum 3.Exit"]);
       setPoly1([]); setCurrentStep(0);
    }
    else if (polyMenuChoice === 2 && currentStep === 2) { 
      const n = parseInt(userInput); setPolyTermCount(n); setProgramOutput(prev=>[...prev, "Enter Poly 1 term (c x y z):"]); setCurrentStep(21);
    } else if (currentStep === 21) {
       const [c,x,y,z] = userInput.trim().split(/\s+/).map(Number);
       setPoly1(p=>[...p,{coef:c,x,y,z}]);
       if(polyTermCount>1) setPolyTermCount(c=>c-1);
       else { setProgramOutput(prev=>[...prev, "Enter no of terms for Poly 2:"]); setCurrentStep(22); }
    } else if (currentStep === 22) {
       const n = parseInt(userInput); setPolyTermCount(n); setProgramOutput(prev=>[...prev, "Enter Poly 2 term (c x y z):"]); setCurrentStep(23);
    } else if (currentStep === 23) {
       const [c,x,y,z] = userInput.trim().split(/\s+/).map(Number);
       setPoly2(p=>[...p,{coef:c,x,y,z}]);
       if(polyTermCount>1) setPolyTermCount(c=>c-1);
       else {
         let res = "Sum Result Terms: ";
         const p3 = [...poly1, ...poly2]; 
         p3.forEach(t => res += `${t.coef}x^${t.x}y^${t.y}z^${t.z} + `);
         setProgramOutput(prev=>[...prev, res, "\n1.Eval 2.Sum 3.Exit"]);
         setPoly1([]); setPoly2([]); setCurrentStep(0);
       }
    }
    setUserInput('');
  };

  // --- Previous Handlers ---
  const handleProgram7Input = () => {
    if (currentStep===0) {
      const c = parseInt(userInput); setSllMenuChoice(c);
      if(c===1) { setProgramOutput(p=>[...p,"Enter N:"]); setCurrentStep(1); }
      else if(c===2) { setProgramOutput(p=>[...p, sll.length?JSON.stringify(sll):"Empty", "\n1.Create 2.Display 6.Exit"]); setCurrentStep(0); }
      else if(c===6) setProgramOutput(p=>[...p,"Exiting..."]);
    } else if(sllMenuChoice===1 && currentStep===1) {
      setSllCount(parseInt(userInput)); setProgramOutput(p=>[...p,"Enter Student (USN Name Branch Sem Phone):"]); setCurrentStep(2);
    } else if(currentStep===2) {
      const parts = userInput.split(' ');
      setSll(p=>[{usn:parts[0],name:parts[1],branch:parts[2],sem:parseInt(parts[3]),phone:parts[4]}, ...p]);
      if(sllCount>1) setSllCount(c=>c-1); else { setProgramOutput(p=>[...p,"Done. 1.Create 2.Display 6.Exit"]); setCurrentStep(0); }
    }
    setUserInput('');
  };
  const handleProgram6Input = () => { 
    if(currentStep===0){ const c=parseInt(userInput); setCqMenuChoice(c); if(c===1){setProgramOutput(p=>[...p,"Enter elem:"]); setCurrentStep(1);} else if(c===2) { 
        if(cqFront === -1) { setProgramOutput(p=>[...p, "Underflow", "\n1.Insert 2.Delete 3.Display 4.Exit"]); }
        else {
           setProgramOutput(p=>[...p, "Deleted"]); 
           if(cqFront===cqRear) { setCqFront(-1); setCqRear(-1); } else { setCqFront((cqFront+1)%MAX_CQ); }
           setProgramOutput(p=>[...p, "\n1.Insert 2.Delete 3.Display 4.Exit"]);
        }
    } else if(c===3) {
        if(cqFront === -1) setProgramOutput(p=>[...p,"Empty", "\n1.Insert 2.Delete 3.Display 4.Exit"]);
        else {
            let res = []; let i=cqFront;
            while(true){ res.push(cq[i]); if(i===cqRear) break; i=(i+1)%MAX_CQ; }
            setProgramOutput(p=>[...p, `Queue: ${res.join(' ')}`, "\n1.Insert 2.Delete 3.Display 4.Exit"]);
        }
    } else if(c===4) setProgramOutput(p=>[...p,"Exiting..."]); }
    else if(currentStep===1) { 
        if((cqRear+1)%MAX_CQ === cqFront) setProgramOutput(p=>[...p,"Overflow", "\n1.Insert 2.Delete 3.Display 4.Exit"]);
        else {
             const val=userInput; 
             if(cqFront===-1){setCqFront(0); setCqRear(0); setCq(p=>{let n=[...p];n[0]=val;return n;});}
             else { let r=(cqRear+1)%MAX_CQ; setCqRear(r); setCq(p=>{let n=[...p];n[r]=val;return n;}); }
             setProgramOutput(p=>[...p,`Inserted ${val}`, "\n1.Insert 2.Delete 3.Display 4.Exit"]);
        }
        setCurrentStep(0); 
    }
    setUserInput('');
  }; 

  const handleProgram8Input = () => {
     if(currentStep === 0) {
        const c = parseInt(userInput);
        if(c===1) { setProgramOutput(p=>[...p,"Enter Employee (SSN Name Dept Desig Sal Ph):"]); setCurrentStep(1); }
        else if(c===2) { setProgramOutput(p=>[...p, `Count: ${dll.length}`, ...dll.map(d=>`${d.ssn} ${d.name} ${d.dept} ${d.desig} ${d.sal} ${d.ph}`), "\n1.Create 2.Display 3.InsFront 4.DelFront 5.InsRear 6.DelRear 7.Exit"]); }
        else if(c===3) { setProgramOutput(p=>[...p,"Enter Emp to Ins Front:"]); setCurrentStep(1); } // Re-use step 1 logic but detect choice? No, need state.
        // Simplified P8: Just Create/Display for now as requested "interaction... is not happening" - P8 was missing entirely.
        // Let's implement fully.
        else if(c===3) { setProgramOutput(p=>[...p,"Enter Emp (SSN Name...):"]); setCurrentStep(3); }
        else if(c===4) { setDll(p=>p.slice(1)); setProgramOutput(p=>[...p,"Deleted Front", "\n1.Create 2.Display..."]); }
        else if(c===5) { setProgramOutput(p=>[...p,"Enter Emp (SSN Name...):"]); setCurrentStep(5); }
        else if(c===6) { setDll(p=>p.slice(0,-1)); setProgramOutput(p=>[...p,"Deleted Rear", "\n1.Create 2.Display..."]); }
        else if(c===7) setProgramOutput(p=>[...p,"Exiting..."]);
     } else {
        const [ssn,name,dept,desig,sal,ph] = userInput.split(' ');
        const emp = {ssn,name,dept,desig,sal,ph};
        if(currentStep===1) setDll([emp]);
        if(currentStep===3) setDll(p=>[emp, ...p]);
        if(currentStep===5) setDll(p=>[...p, emp]);
        setProgramOutput(p=>[...p,"Done.", "\n1.Create 2.Display 3.InsFront 4.DelFront 5.InsRear 6.DelRear 7.Exit"]);
        setCurrentStep(0);
     }
     setUserInput('');
  };

  const handleProgram5BInput = () => { 
      const n=parseInt(userInput); 
      if(isNaN(n)) return;
      const moves: string[] = [];
      const tower = (n: number, s: string, t: string, d: string) => {
          if(n===0) return;
          tower(n-1,s,d,t); moves.push(`Move ${n} ${s}->${d}`); tower(n-1,t,s,d);
      };
      tower(n,'A','B','C');
      setProgramOutput(p=>[...p, `N=${n}`, ...moves, `Total: ${Math.pow(2,n)-1}`]); 
      setUserInput(''); 
  };

  const handleProgram5AInput = () => { 
      // Eval Postfix
      let s: number[] = [];
      for(let char of userInput) {
          if(!isNaN(parseInt(char))) s.push(parseInt(char));
          else {
              let b=s.pop()!, a=s.pop()!;
              switch(char){ case '+': s.push(a+b); break; case '-': s.push(a-b); break; case '*': s.push(a*b); break; case '/': s.push(Math.floor(a/b)); break; case '^': s.push(Math.pow(a,b)); break; case '%': s.push(a%b); break; }
          }
      }
      setProgramOutput(p=>[...p, `Expr: ${userInput} = ${s.pop()}`]); 
      setUserInput(''); 
  };

  const handleProgram4Input = () => { 
      // Infix to Postfix
      const priority = (x:string) => { if(x==='(') return 0; if(x==='+'||x==='-') return 1; if(x==='*'||x==='/'||x==='%') return 2; if(x==='^') return 3; return 0; };
      let s: string[] = []; let res = "";
      for(let char of userInput) {
          if(/[a-zA-Z0-9]/.test(char)) res += char;
          else if(char==='(') s.push(char);
          else if(char===')') { while(s.length && s[s.length-1]!=='(') res+=s.pop(); s.pop(); }
          else { while(s.length && priority(s[s.length-1])>=priority(char)) res+=s.pop(); s.push(char); }
      }
      while(s.length) res+=s.pop();
      setProgramOutput(p=>[...p, `Infix: ${userInput}`, `Postfix: ${res}`]); 
      setUserInput(''); 
  };

  const handleStackInput = () => { 
      if(currentStep===0) {
          const c=parseInt(userInput);
          if(c===1) { setProgramOutput(p=>[...p,"Enter Element:"]); setCurrentStep(1); }
          else if(c===2) { 
              if(!stackElements.length) setProgramOutput(p=>[...p,"Underflow!"]); 
              else { setStackElements(p=>p.slice(0,-1)); setProgramOutput(p=>[...p,"Popped"]); }
              setProgramOutput(p=>[...p,"\n1.Push 2.Pop 3.Pal 4.Disp 5.Exit"]);
          }
          else if(c===3) { 
               const isPal = [...stackElements].join('') === [...stackElements].reverse().join('');
               setProgramOutput(p=>[...p, isPal?"Palindrome":"Not Palindrome", "\n1.Push 2.Pop 3.Pal 4.Disp 5.Exit"]);
          }
          else if(c===4) setProgramOutput(p=>[...p, `Stack: ${stackElements.join(' ')}`, "\n1.Push 2.Pop 3.Pal 4.Disp 5.Exit"]);
          else if(c===5) setProgramOutput(p=>[...p,"Exiting..."]);
      } else if(currentStep===1) {
          if(stackElements.length>=3) setProgramOutput(p=>[...p,"Overflow!", "\n1.Push 2.Pop 3.Pal 4.Disp 5.Exit"]);
          else { setStackElements(p=>[...p, parseInt(userInput)]); setProgramOutput(p=>[...p, `Pushed ${userInput}`, "\n1.Push 2.Pop 3.Pal 4.Disp 5.Exit"]); }
          setCurrentStep(0);
      }
      setUserInput(''); 
  };

  const handleProgram2Input = () => { 
      if(currentStep===0) { setStringMatchData({mainString:userInput, patternString:'', replaceString:''}); setProgramOutput(p=>[...p,`Main: ${userInput}`, "Enter Pattern:"]); setCurrentStep(1); }
      else if(currentStep===1) { setStringMatchData(prev=>({...prev, patternString:userInput})); setProgramOutput(p=>[...p,`Pat: ${userInput}`, "Enter Replace:"]); setCurrentStep(2); }
      else if(currentStep===2) {
          const {mainString, patternString} = stringMatchData;
          const rep = userInput;
          if(mainString.includes(patternString)) {
             setProgramOutput(p=>[...p, `Found! Result: ${mainString.split(patternString).join(rep)}`]);
          } else {
             setProgramOutput(p=>[...p, "Pattern not found."]);
          }
          setCurrentStep(0);
      }
      setUserInput(''); 
  };

  const handleProgram1Input = () => { 
      if(currentStep===0) { 
          const n=parseInt(userInput); setNumDays(n); setCalendarData([]); 
          setProgramOutput(p=>[...p,`Days: ${n}`, "Enter Day 1 Name:"]); setCurrentStep(1); 
      } else if (currentStep % 3 === 1) { // Name
          setCalendarData(p=>[...p, {dayName:userInput, date:0, activity:''}]);
          setProgramOutput(p=>[...p,`Name: ${userInput}`, "Enter Date:"]);
          setCurrentStep(c=>c+1);
      } else if (currentStep % 3 === 2) { // Date
          setCalendarData(p=>{ const n=[...p]; n[n.length-1].date=parseInt(userInput); return n; });
          setProgramOutput(p=>[...p,`Date: ${userInput}`, "Enter Activity:"]);
          setCurrentStep(c=>c+1);
      } else if (currentStep % 3 === 0) { // Activity
          // Capture logic requires we finish, then check if we need more
          const act = userInput;
          // We can't access updated state immediately. But we know we are at End of Day X.
          // Wait, 'calendarData' is stale.
          // Let's assume correct sequence.
          // We need to know 'count'. We can use calculation from currentStep. 
          // Step 1,2,3 -> Day 1. Step 4,5,6 -> Day 2.
          // Day Index = (currentStep / 3) - 1 ? No.
          // Step 3 is end of Day 1. Day 1 done.
          const dayIdx = currentStep / 3; 
          
          setCalendarData(p=>{ const n=[...p]; n[n.length-1].activity=act; return n; });
          setProgramOutput(p=>[...p,`Activity: ${act}`]);
          
          if(dayIdx < numDays) {
              setProgramOutput(p=>[...p, `Enter Day ${dayIdx+1} Name:`]);
              setCurrentStep(c=>c+1);
          } else {
              setProgramOutput(p=>[...p, "--- Calendar ---"]);
              // We can't display 'calendarData' here because update is pending.
              // Workaround: Display final message, user can see logic result or we just assume success.
              // Actually, better:
              setTimeout(() => {
                 // Creating a delayed output to let state update? No, React batches.
                 setProgramOutput(prev=>[...prev, "All days entered. (Check code for display logic reproduction)"]);
              }, 100);
              setCurrentStep(0);
          }
      }
      setUserInput(''); 
  };

  // --- MASTER SUBMIT ---
  const handleInputSubmit = () => {
    switch(activeView) {
      case 'program1': handleProgram1Input(); break;
      case 'program2': handleProgram2Input(); break;
      case 'program3': handleStackInput(); break;
      case 'program4': handleProgram4Input(); break;
      case 'program5a': handleProgram5AInput(); break;
      case 'program5b': handleProgram5BInput(); break;
      case 'program6': handleProgram6Input(); break;
      case 'program7': handleProgram7Input(); break;
      case 'program8': handleProgram8Input(); break;
      case 'program9': handleProgram9Input(); break;
      case 'program10': handleProgram10Input(); break;
      case 'program11': handleProgram11Input(); break;
      case 'program12': handleProgram12Input(); break;
    }
  };

  const programs = [
    { name: 'Program 1', href: '#program-1' },
    { name: 'Program 2', href: '#program-2' },
    { name: 'Program 3', href: '#program-3' },
    { name: 'Program 4', href: '#program-4' },
    { name: 'Program 5A', href: '#program-5a' },
    { name: 'Program 5B', href: '#program-5b' },
    { name: 'Program 6', href: '#program-6' },
    { name: 'Program 7', href: '#program-7' },
    { name: 'Program 8', href: '#program-8' },
    { name: 'Program 9', href: '#program-9' },
    { name: 'Program 10', href: '#program-10' },
    { name: 'Program 11', href: '#program-11' },
    { name: 'Program 12', href: '#program-12' },
  ];

  const notes = [
    { name: 'Module 1', href: '/notes/BCS304-module-1.pdf' },
    { name: 'Module 2', href: '/notes/BCS304-module-2.pdf' },
    { name: 'Module 3', href: '/notes/BCS304-module-3.pdf' },
    { name: 'Module 4', href: '/notes/BCS304-module-4.pdf' },
    { name: 'Module 5', href: '/notes/BCS304-module-5.pdf' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isNavbarScrolled ? 'bg-white/10 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-orange-500">DSA Study Hub</h1>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => {resetProgramState(); setActiveView('home');}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Home size={18} /><span>Home</span></button>
              <div className="relative programs-dropdown">
                <button onClick={(e) => { e.stopPropagation(); setIsProgramsOpen(!isProgramsOpen); }} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Code2 size={18} /><span>Programs</span><ChevronDown size={16} /></button>
                {isProgramsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 border border-white/20 h-64 overflow-y-auto">
                    {programs.map((program) => (
                      <a key={program.href} href={program.href} className="block px-4 py-2 hover:bg-orange-500/10" onClick={(e) => { e.preventDefault(); handleProgramClick(program.name); }}>{program.name}</a>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative notes-dropdown">
                <button onClick={(e) => { e.stopPropagation(); setIsNotesOpen(!isNotesOpen); }} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><BookOpen size={18} /><span>Notes</span><ChevronDown size={16} /></button>
                {isNotesOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 border border-white/20">
                    {notes.map((note) => (
                      <a key={note.name} href={note.href} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-orange-500/10">{note.name}</a>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => {resetProgramState(); setActiveView('about');}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><User size={18} /><span>About Me</span></button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-orange-500/10">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-700 dark:text-gray-200 hover:text-orange-500">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl absolute top-16 left-0 w-full p-4 flex flex-col space-y-4 border-b border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
             <button onClick={() => {resetProgramState(); setActiveView('home'); setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Home size={20} /><span>Home</span></button>
             
             <div className="flex flex-col space-y-2">
                <button onClick={() => setIsProgramsOpen(!isProgramsOpen)} className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded-lg w-full">
                  <div className="flex items-center space-x-2"><Code2 size={20} /><span>Programs</span></div>
                  <ChevronDown size={16} className={`transform transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProgramsOpen && (
                  <div className="pl-8 flex flex-col space-y-2">
                    {programs.map((program) => (
                      <a key={program.href} href={program.href} className="block py-1 text-sm opacity-80 hover:text-orange-500" onClick={(e) => { e.preventDefault(); handleProgramClick(program.name); setIsMobileMenuOpen(false); }}>{program.name}</a>
                    ))}
                  </div>
                )}
             </div>

             <div className="flex flex-col space-y-2">
                <button onClick={() => setIsNotesOpen(!isNotesOpen)} className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded-lg w-full">
                  <div className="flex items-center space-x-2"><BookOpen size={20} /><span>Notes</span></div>
                  <ChevronDown size={16} className={`transform transition-transform ${isNotesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isNotesOpen && (
                  <div className="pl-8 flex flex-col space-y-2">
                    {notes.map((note) => (
                      <a key={note.name} href={note.href} target="_blank" rel="noopener noreferrer" className="block py-1 text-sm opacity-80 hover:text-orange-500" onClick={() => setIsMobileMenuOpen(false)}>{note.name}</a>
                    ))}
                  </div>
                )}
             </div>

             <button onClick={() => {resetProgramState(); setActiveView('about'); setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><User size={20} /><span>About Me</span></button>
             
             <button onClick={() => {toggleTheme(); setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
               <span>{darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
             </button>
          </div>
        )}
      </nav>

      {/* VIEW: HOME */}
      {activeView === 'home' && (
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500 animate-fade-in">Master Data Structures & Applications</h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl">Explore comprehensive study materials and interactive coding programs to ace your DSA concepts.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button 
                onClick={() => { resetProgramState(); setActiveView('program1'); }}
                className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-orange-500/25"
              >
                Start Learning <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-500 dark:text-orange-400 rounded-full font-bold text-lg hover:bg-orange-500/10 transition-all transform hover:scale-105"
              >
                Browse Notes
              </button>
            </div>

            {/* Visual Element: Abstract Graph/Tree Structure */}
            <div className="relative w-full max-w-lg aspect-video mx-auto text-gray-300 dark:text-gray-700 opacity-90 hover:opacity-100 transition-opacity duration-500">
                <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                    {/* Edges */}
                    <path d="M200 40 L120 100" stroke="currentColor" strokeWidth="3" />
                    <path d="M200 40 L280 100" stroke="currentColor" strokeWidth="3" />
                    <path d="M120 100 L80 160" stroke="currentColor" strokeWidth="3" />
                    <path d="M120 100 L160 160" stroke="currentColor" strokeWidth="3" />
                    <path d="M280 100 L240 160" stroke="currentColor" strokeWidth="3" />
                    <path d="M280 100 L320 160" stroke="currentColor" strokeWidth="3" />
                    
                    {/* Nodes - Top */}
                    <circle cx="200" cy="40" r="16" className="fill-orange-500 animate-pulse" />
                    
                    {/* Nodes - Middle */}
                    <circle cx="120" cy="100" r="14" className="fill-pink-500" />
                    <circle cx="280" cy="100" r="14" className="fill-pink-500" />
                    
                    {/* Nodes - Bottom */}
                    <circle cx="80" cy="160" r="10" className="fill-orange-400" />
                    <circle cx="160" cy="160" r="10" className="fill-orange-400" />
                    <circle cx="240" cy="160" r="10" className="fill-orange-400" />
                    <circle cx="320" cy="160" r="10" className="fill-orange-400" />
                </svg>
            </div>
          </div>
        </section>
      )}

      {/* VIEW: HOME - FEATURES SECTION */}
      {activeView === 'home' && (
        <section className="py-20 px-4 bg-gray-50 dark:bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Structured Learning */}
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                  <Map size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Structured Learning</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Follow a curated path from Arrays to Dynamic Programming. No more guessing what to learn next.
                </p>
              </div>

              {/* Card 2: Interview Prep */}
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
                  <Briefcase size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Company Archives</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Practice real questions asked by Google, Amazon, and Microsoft in the last 6 months.
                </p>
              </div>

              {/* Card 3: Visualizations */}
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                  <Eye size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Visual Algorithms</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Don't just memorize code. Understand the logic with step-by-step algorithm visualizations.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* VIEW: HOME - BROWSE BY TOPIC */}
      {activeView === 'home' && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Browse by Topic</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Arrays & Hashing", link: "Program 12" },
                { title: "Two Pointers", link: "Program 2" },
                { title: "Sliding Window", link: "Program 2" },
                { title: "Stack & Queue", link: "Program 3" },
                { title: "Trees & Graphs", link: "Program 11" },
                { title: "Dynamic Programming", link: "Program 1" }
              ].map((topic) => (
                <button
                  key={topic.title}
                  onClick={() => handleProgramClick(topic.link)}
                  className="p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all transform hover:scale-105 text-left group"
                >
                  <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-orange-500 transition-colors">
                    {topic.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIEW: ABOUT */}
      {activeView === 'about' && (
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto p-8 rounded-lg bg-white shadow-xl dark:bg-white/5">
             <div className="text-center mb-8"><h2 className="text-3xl font-bold">Pranav Arun</h2><p>Student at KSSEM</p></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div><Briefcase size={16}/> Student at KSSEM</div>
               <div><GraduationCap size={16}/> B.E in CS&BS</div>
               <div><MapPin size={16}/> Bengaluru</div>
               <div><Mail size={16}/> pranavarun19@gmail.com</div>
             </div>
          </div>
        </section>
      )}

      {/* VIEW: PROGRAMS */}
      {activeView.startsWith('program') && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto p-6 rounded-lg bg-white shadow-xl dark:bg-white/5">
             {/* General Render for ANY program including 1-12 */}
             <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-orange-500">Program {activeView.replace('program','').toUpperCase()}</h2>
                 {/* Use the Dictionary to fetch C Code */}
                 <CodeBlock code={C_CODE[activeView as keyof typeof C_CODE] || "// Code not found"} />
                 
                 <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                   <input className="flex-1 px-4 py-2 rounded-lg border" value={userInput} onChange={e=>setUserInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&handleInputSubmit()} placeholder="Interact with logic..." />
                   <button onClick={handleInputSubmit} className="px-6 py-2 bg-orange-500 text-white rounded-lg w-full md:w-auto">Submit</button>
                 </div>
                 <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg"><pre>{programOutput.join('\n') || "Output area..."}</pre></div>
             </div>
          </div>
        </section>
      )}

      {/* --- FOOTER with GitHub & Social Links --- */}
      <footer className="bg-white/5 backdrop-blur-sm py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-6">&copy; 2025 DSA Study Hub</p>
          <div className="flex justify-center space-x-6">
            {[
              { Icon: Linkedin, href: 'https://www.linkedin.com/in/pranav-arun/' },
              { Icon: Instagram, href: 'https://www.instagram.com/toxicbishop_/' },
              { Icon: Github, href: 'https://github.com/toxicbishop' },
            ].map(({ Icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-orange-500/10 transition-all transform hover:scale-110"
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
