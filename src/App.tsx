import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Moon, Sun, ChevronDown, Code2, Home, User, Mail, MapPin, Briefcase, GraduationCap, Copy, Check, Menu, X, BookOpen, ArrowRight, Map, Eye, Bug, Server, BarChart3, Network, Search, Trophy, Zap, Clock, Terminal, ChevronRight } from 'lucide-react';
import PathfindingVisualizer from './components/PathfindingVisualizer';
import SortingVisualizer from './components/SortingVisualizer';
import TreeGraphVisualizer from './components/TreeGraphVisualizer';
import ReportIssue from './components/ReportIssue';
import { SystemDesign } from './components/SystemDesign';

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
const CodeBlock = ({ code, darkMode, language = 'c' }: { code: string, darkMode: boolean, language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="absolute top-2 right-2 z-10 flex gap-2 transition-opacity opacity-0 group-hover:opacity-100">
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-gray-200 dark:bg-gray-800 rounded text-gray-500 dark:text-gray-400">
          {language}
        </div>
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-white/80 dark:bg-black/80 hover:bg-orange-500 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
          title="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={darkMode ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
        showLineNumbers={true}
        lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: darkMode ? '#6b7280' : '#9ca3af', textAlign: 'right' }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return hash || 'home';
  }); 

  const [selectedLanguage, setSelectedLanguage] = useState('c');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedPrograms, setCompletedPrograms] = useState<string[]>(() => {
    const saved = localStorage.getItem('completedPrograms');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleProgramComplete = (id: string) => {
    const newCompleted = completedPrograms.includes(id)
      ? completedPrograms.filter(p => p !== id)
      : [...completedPrograms, id];
    setCompletedPrograms(newCompleted);
    localStorage.setItem('completedPrograms', JSON.stringify(newCompleted));
  };




  // --- RESET ---
  const resetProgramState = () => {
    setIsProgramsOpen(false);
  };

  const handleProgramClick = (pid: string) => {
    const view = pid.toLowerCase().replace(/\s/g, '');
    window.location.hash = view;
    resetProgramState();
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const s = () => setIsNavbarScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleThemeChange);

    // --- Browser History (Back/Forward) Support ---
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActiveView(hash);
      window.scrollTo(0, 0); // Scroll to top on navigation
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('scroll', s);
      mediaQuery.removeEventListener('change', handleThemeChange);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);


  const programsData = [
    { id: 'program1', name: 'Program 1', category: 'Basic', difficulty: 'Easy', time: 'O(1)', space: 'O(1)' },
    { id: 'program2', name: 'Program 2', category: 'Strings', difficulty: 'Easy', time: 'O(N)', space: 'O(N)' },
    { id: 'program3', name: 'Program 3', category: 'Stack', difficulty: 'Easy', time: 'O(N)', space: 'O(N)' },
    { id: 'program4', name: 'Program 4', category: 'Queue', difficulty: 'Easy', time: 'O(N)', space: 'O(N)' },
    { id: 'program5a', name: 'Program 5A', category: 'Recursion', difficulty: 'Medium', time: 'O(N)', space: 'O(N)' },
    { id: 'program5b', name: 'Program 5B', category: 'Recursion', difficulty: 'Medium', time: 'O(2^N)', space: 'O(N)' },
    { id: 'program6', name: 'Program 6', category: 'Circular Queue', difficulty: 'Medium', time: 'O(1)', space: 'O(N)' },
    { id: 'program7', name: 'Program 7', category: 'Linked List', difficulty: 'Medium', time: 'O(N)', space: 'O(N)' },
    { id: 'program8', name: 'Program 8', category: 'Linked List', difficulty: 'Medium', time: 'O(N)', space: 'O(N)' },
    { id: 'program9', name: 'Program 9', category: 'Polynomial', difficulty: 'Hard', time: 'O(N*M)', space: 'O(N+M)' },
    { id: 'program10', name: 'Program 10', category: 'BST', difficulty: 'Hard', time: 'O(H)', space: 'O(H)' },
    { id: 'program11', name: 'Program 11', category: 'Graphs', difficulty: 'Hard', time: 'O(V+E)', space: 'O(V)' },
    { id: 'program12', name: 'Program 12', category: 'Hashing', difficulty: 'Medium', time: 'O(1) avg', space: 'O(M)' },
  ];

  const filteredPrograms = programsData.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notes = [
    { name: 'Module 1', href: '/notes/BCS304-module-1.pdf' },
    { name: 'Module 2', href: '/notes/BCS304-module-2.pdf' },
    { name: 'Module 3', href: '/notes/BCS304-module-3.pdf' },
    { name: 'Module 4', href: '/notes/BCS304-module-4.pdf' },
    { name: 'Module 5', href: '/notes/BCS304-module-5.pdf' },
  ];

  return (
    <div className={`min-h-screen relative z-0 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
       {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 backdrop-blur-sm bg-black/40" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <Search className="text-gray-400" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search programs, categories, or complexity..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-400"><X size={20} /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => { handleProgramClick(p.name); setIsSearchOpen(false); }}
                    className="w-full flex items-center justify-between p-3 hover:bg-orange-500/10 rounded-xl transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Code2 size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{p.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{p.category} • {p.difficulty}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {completedPrograms.includes(p.id) && <Check size={16} className="text-green-500" />}
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">No programs found matching "{searchQuery}"</div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className={`absolute inset-0 -z-10 bg-[size:30px_30px] ${darkMode ? 'bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)]'}`}></div>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isNavbarScrolled ? 'bg-white/10 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-orange-500">DSA Study Hub</h1>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => {resetProgramState(); window.location.hash = 'home';}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Home size={18} /><span>Home</span></button>
              <div className="relative programs-dropdown">
                <button onClick={(e) => { e.stopPropagation(); setIsProgramsOpen(!isProgramsOpen); }} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Code2 size={18} /><span>Programs</span><ChevronDown size={16} /></button>
                {isProgramsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 border border-white/20 h-64 overflow-y-auto z-50">
                    {programsData.map((program) => (
                      <a key={program.id} href={`#${program.id}`} className="flex items-center justify-between px-4 py-2 hover:bg-orange-500/10" onClick={(e) => { e.preventDefault(); handleProgramClick(program.name); }}>
                        <span>{program.name}</span>
                        {completedPrograms.includes(program.id) && <Check size={14} className="text-green-500" />}
                      </a>
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
              
              <button onClick={() => {resetProgramState(); window.location.hash = 'visualizer';}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Map size={18} /><span>Pathfinder</span></button>
              <button onClick={() => {resetProgramState(); window.location.hash = 'sorting';}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><BarChart3 size={18} /><span>Sorter</span></button>
              <button onClick={() => {resetProgramState(); window.location.hash = 'system-design';}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Server size={18} /><span>System Design</span></button>
              
              <button onClick={() => {resetProgramState(); window.location.hash = 'about';}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><User size={18} /><span>About Me</span></button>
              <button onClick={() => {resetProgramState(); window.location.hash = 'report';}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors" title="Report Issue"><Bug size={18} /></button>

              <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full hover:bg-orange-500/10 transition-colors" title="Search">
                <Search size={20} />
              </button>

              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-orange-500/10">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-700 dark:text-gray-200 hover:text-orange-500">
                <Search size={20} />
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-700 dark:text-gray-200 hover:text-orange-500">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl absolute top-16 left-0 w-full p-4 flex flex-col space-y-4 border-b border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
             <button onClick={() => {resetProgramState(); window.location.hash = 'home'; setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Home size={20} /><span>Home</span></button>
             
             <div className="flex flex-col space-y-2">
                <button onClick={() => setIsProgramsOpen(!isProgramsOpen)} className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded-lg w-full">
                  <div className="flex items-center space-x-2"><Code2 size={20} /><span>Programs</span></div>
                  <ChevronDown size={16} className={`transform transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProgramsOpen && (
                  <div className="pl-8 flex flex-col space-y-2">
                    {programsData.map((program) => (
                      <a key={program.id} href={`#${program.id}`} className="flex items-center justify-between py-1 text-sm opacity-80 hover:text-orange-500" onClick={(e) => { e.preventDefault(); handleProgramClick(program.name); setIsMobileMenuOpen(false); }}>
                        <span>{program.name}</span>
                        {completedPrograms.includes(program.id) && <Check size={14} className="text-green-500" />}
                      </a>
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
             <button onClick={() => {resetProgramState(); window.location.hash = 'visualizer'; setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Map size={20} /><span>Pathfinder</span></button>
             <button onClick={() => {resetProgramState(); window.location.hash = 'sorting'; setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><BarChart3 size={20} /><span>Sorter</span></button>
             <button onClick={() => {resetProgramState(); window.location.hash = 'tree-graph'; setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Network size={20} /><span>Trees & Graphs</span></button>
             <button onClick={() => {resetProgramState(); window.location.hash = 'system-design'; setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Server size={20} /><span>System Design</span></button>
             <button onClick={() => {resetProgramState(); window.location.hash = 'report'; setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Bug size={20} /><span>Report Issue</span></button>

             <button onClick={() => {resetProgramState(); window.location.hash = 'about'; setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><User size={20} /><span>About Me</span></button>
             
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
                onClick={() => { resetProgramState(); window.location.hash = 'program1'; }}
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

      {/* VIEW: HOME - CURATED LISTS */}
      {activeView === 'home' && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-bold mb-12 text-center text-gray-500 dark:text-blue">
              Don't know where to start? <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">Try these curated lists.</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card A: Beginner's 50 */}
              <div className="group relative p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                      <Code2 size={24} />
                   </div>
                   <span className="text-xs font-bold px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">BEGINNER</span>
                </div>

                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">The Beginner's 50</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">Core concepts to build your foundation. Perfect for your first month of preparation.</p>

                 <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                       <span>Your Progress</span>
                       <span>{completedPrograms.filter(id => programsData.find(p => p.id === id && p.id.startsWith('program') && !isNaN(parseInt(p.id.replace('program',''))))).length}/12 Solved</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                       <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000 ease-out"
                        style={{ width: `${(completedPrograms.filter(id => programsData.find(p => p.id === id && p.id.startsWith('program') && !isNaN(parseInt(p.id.replace('program',''))))).length / 12) * 100}%` }}
                       ></div>
                    </div>
                 </div>
              </div>

               {/* Card B: Interview 75 */}
              <div className="group relative p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                      <Briefcase size={24} />
                   </div>
                   <span className="text-xs font-bold px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full">INTERMEDIATE</span>
                </div>

                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">The Interview 75</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">The most frequently asked questions by FAANG. High-yield patterns only.</p>

                <div className="space-y-3">
                   <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                      <span>Your Progress</span>
                      <span>{completedPrograms.filter(id => programsData.find(p => p.id === id && p.category !== 'Basic')).length}/75 Solved</span>
                   </div>
                   <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max(2, (completedPrograms.filter(id => programsData.find(p => p.id === id && p.category !== 'Basic')).length / 75) * 100)}%` }}
                      ></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIEW: HOME - INTERACTIVE ROADMAP */}
      {activeView === 'home' && (
        <section className="py-16 px-4 bg-gray-50/50 dark:bg-gray-900/20 backdrop-blur-sm border-y border-gray-100 dark:border-white/5">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
               <Map className="text-orange-500" size={32} />
               <span>Your <span className="text-orange-500">Learning Path</span></span>
            </h3>
            
            <div className="relative">
               {/* Roadmap Path Line */}
               <div className="absolute left-[19px] top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-pink-500 to-orange-400 opacity-20 hidden sm:block"></div>
               
               <div className="space-y-12">
                  {[
                    { title: "The Basics", desc: "Arrays, Objects, and Basic Logic", icon: <Zap size={20}/>, programs: ['program1', 'program2'] },
                    { title: "Linear Structures", desc: "Stacks, Queues, and Circular variations", icon: <BarChart3 size={20}/>, programs: ['program3', 'program4', 'program6'] },
                    { title: "Dynamic Logic", desc: "Recursion and Mathematical mapping", icon: <Network size={20}/>, programs: ['program5a', 'program5b'] },
                    { title: "Linked Data", desc: "Singly, Doubly, and Circular Linked Lists", icon: <Eye size={20}/>, programs: ['program7', 'program8', 'program9'] },
                    { title: "Non-Linear Structures", desc: "Binary Trees and Graph Algorithms", icon: <Server size={20}/>, programs: ['program10', 'program11'] },
                    { title: "Advanced Mapping", desc: "Hashing and Hash Tables", icon: <Trophy size={20}/>, programs: ['program12'] },
                  ].map((step, idx) => {
                    const isStepComplete = step.programs.every(p => completedPrograms.includes(p));
                    const isStepPartial = step.programs.some(p => completedPrograms.includes(p));
                    
                    return (
                      <div key={idx} className="relative pl-0 sm:pl-12">
                         {/* Path Indicator */}
                         <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 hidden sm:flex ${
                           isStepComplete ? 'bg-green-500 border-green-200 dark:border-green-900 text-white' : 
                           isStepPartial ? 'bg-orange-500 border-orange-200 dark:border-orange-900 text-white animate-pulse' :
                           'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                         }`}>
                            {isStepComplete ? <Check size={20} /> : step.icon}
                         </div>

                         <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                           isStepComplete ? 'bg-green-500/5 border-green-500/20' : 
                           isStepPartial ? 'bg-orange-500/5 border-orange-500/20' : 
                           'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                         }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                               <div>
                                  <h4 className="text-xl font-bold mb-1">{step.title}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                               </div>
                               <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500">
                                  {step.programs.filter(p => completedPrograms.includes(p)).length} / {step.programs.length} Completed
                               </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                               {step.programs.map(pid => {
                                 const p = programsData.find(prog => prog.id === pid);
                                 return (
                                   <button 
                                     key={pid}
                                     onClick={() => handleProgramClick(p ? p.name : pid)}
                                     className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                       completedPrograms.includes(pid)
                                       ? 'bg-green-500 text-white shadow-sm'
                                       : 'bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 hover:border-orange-500'
                                     }`}
                                   >
                                     {p ? p.name : pid}
                                   </button>
                                 );
                               })}
                            </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
        </section>
      )}

      {/* VIEW: HOME - BROWSE BY TOPIC */}
      {activeView === 'home' && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500 w-fit">Browse by Topic</h3>
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
                  className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow hover:shadow-lg hover:border-orange-500 hover:shadow-orange-500/10 transition-all transform hover:scale-105 text-left font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {topic.title}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIEW: HOME - FEATURES SECTION */}
      {activeView === 'home' && (
        <section className="py-20 px-4 bg-gray-50/80 dark:bg-black/20 backdrop-blur-sm border-t border-gray-100 dark:border-white/5">
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
              <div
                onClick={() => {resetProgramState(); window.location.hash = 'visualizer';}}
                className="cursor-pointer p-8 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
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

      {/* VIEW: ABOUT */}
      {activeView === 'about' && (
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto p-8 rounded-lg bg-white shadow-xl dark:bg-white/5">
             <div className="flex flex-col items-center mb-8">
                 <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500 mb-6 shadow-lg bg-gray-200 dark:bg-gray-800">
                    <img
                      src="/screenshots/profile.jpg"
                      alt="Pranav Arun"
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                 </div>
                 <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">Pranav Arun</h2>
                 <p className="text-xl text-gray-600 dark:text-gray-300">Student at KSSEM</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
               <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                 <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                   <Briefcase size={24}/>
                 </div>
                 <span className="font-medium">Student at KSSEM</span>
               </div>

               <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                 <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400">
                   <GraduationCap size={24}/>
                 </div>
                 <span className="font-medium">B.E in CS&BS</span>
               </div>

               <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                 <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                   <MapPin size={24}/>
                 </div>
                 <span className="font-medium">Bengaluru</span>
               </div>

               <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                 <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                   <Mail size={24}/>
                 </div>
                 <span className="font-medium">pranavarun19@gmail.com</span>
               </div>
             </div>
          </div>
        </section>
      )}

      {/* VIEW: PRIVACY */}
      {activeView === 'privacy' && (
        <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
            <h2 className="text-4xl font-bold mb-8 text-orange-500">Privacy Policy</h2>
            <div className="space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Welcome to DSA Study Hub. This Privacy Policy explains how we handle your information.</p>
                <h3 className="text-2xl font-semibold">1. Information We Collect</h3>
                <p>We do not collect any personal information. Your progress and preferences (like theme settings) are stored locally on your device.</p>
                <h3 className="text-2xl font-semibold">2. Third-Party Links</h3>
                <p>Our site contains links to other websites (like GitHub, LinkedIn). We are not responsible for the privacy practices of these sites.</p>
            </div>
        </section>
      )}

      {/* VIEW: TERMS */}
      {activeView === 'terms' && (
        <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
            <h2 className="text-4xl font-bold mb-8 text-orange-500">Terms of Service</h2>
             <div className="space-y-6">
                <p>By using DSA Study Hub, you agree to these terms.</p>
                <h3 className="text-2xl font-semibold">Usage</h3>
                <p>This content is for educational purposes. Code examples are provided "as is" without warranty of any kind.</p>
            </div>
        </section>
      )}

       {/* VIEW: COOKIES */}
      {activeView === 'cookies' && (
        <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
            <h2 className="text-4xl font-bold mb-8 text-orange-500">Cookie Policy</h2>
             <div className="space-y-6">
                <p>We use local storage technology (not traditional cookies) to remember your theme preference (Dark/Light mode). No tracking or third-party cookies are used by us directly.</p>
            </div>
        </section>
      )}

      {/* VIEW: PROGRAMS */}
      {activeView.startsWith('program') && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto p-6 rounded-lg bg-white shadow-xl dark:bg-white/5">
             {/* General Render for ANY program including 1-12 */}
             <div className="space-y-6">
                 {(() => {
                   const program = programsData.find(p => p.id === activeView);
                   return (
                     <>
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div>
                            <div className="flex items-center gap-2 text-orange-500 font-bold mb-1">
                               <span className="px-2 py-0.5 bg-orange-500/10 rounded text-xs uppercase tracking-wider">{program?.category || 'General'}</span>
                               <span>•</span>
                               <span className={`text-xs uppercase tracking-wider ${
                                 program?.difficulty === 'Easy' ? 'text-green-500' :
                                 program?.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                               }`}>{program?.difficulty || 'Medium'}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Program {activeView.replace('program','').toUpperCase()}</h2>
                         </div>

                         <button
                           onClick={() => toggleProgramComplete(activeView)}
                           className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                             completedPrograms.includes(activeView)
                             ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                             : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-500/10 hover:text-green-500'
                           }`}
                         >
                           {completedPrograms.includes(activeView) ? <><Trophy size={18} /> Completed</> : <><Zap size={18} /> Mark Complete</>}
                         </button>
                       </div>

                       {/* Complexity Badges */}
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight"><Clock size={14}/> Time</div>
                             <div className="font-mono text-orange-500">{program?.time || 'O(N)'}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight"><Server size={14}/> Space</div>
                             <div className="font-mono text-pink-500">{program?.space || 'O(N)'}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight"><Zap size={14}/> Difficulty</div>
                             <div className="font-semibold text-gray-700 dark:text-gray-300">{program?.difficulty || 'Medium'}</div>
                          </div>
                          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight"><Terminal size={14}/> Lang</div>
                             <div className="font-semibold text-gray-700 dark:text-gray-300">C Language</div>
                          </div>
                       </div>

                       {/* Use the Dictionary to fetch C Code */}
                       <div className="flex items-center justify-between mb-2">
                          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                             {['c', 'cpp', 'python', 'java'].map(lang => (
                               <button 
                                 key={lang}
                                 onClick={() => setSelectedLanguage(lang)}
                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                   selectedLanguage === lang 
                                   ? 'bg-orange-500 text-white shadow-sm' 
                                   : 'text-gray-500 hover:text-orange-500'
                                 }`}
                               >
                                 {lang}
                               </button>
                             ))}
                          </div>
                          <a 
                            href={`https://www.programiz.com/${selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'python' : selectedLanguage === 'java' ? 'java' : 'c'}-programming/online-compiler/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg"
                          >
                            <Terminal size={14} /> Run Online
                          </a>
                       </div>
                       <CodeBlock 
                        code={
                          selectedLanguage === 'c' ? (C_CODE[activeView as keyof typeof C_CODE] || "// Code not found") :
                          `// ${selectedLanguage.toUpperCase()} implementation coming soon...\n// For now, enjoy the C version! \n\n` + (C_CODE[activeView as keyof typeof C_CODE] || "// Code not found")
                        } 
                        darkMode={darkMode} 
                        language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'python' ? 'python' : selectedLanguage === 'java' ? 'java' : 'c'} 
                       />

                       {/* Concept breakdown */}
                        <div className="mt-8">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen size={20} className="text-orange-500" /> Concept Breakdown</h3>
                          <div className="space-y-4">
                             <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                                <h4 className="font-bold text-orange-500 mb-2 underline decoration-orange-500/30 underline-offset-4">How it works?</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                   This program implements the core logic of {program?.category.toLowerCase() || 'this topic'}.
                                   It focuses on {program?.difficulty === 'Easy' ? 'fundamental operations' : 'optimized operations and handling edge cases'}.
                                   For a detailed step-by-step walkthrough, refer to the comments in the code above.
                                </p>
                             </div>
                          </div>
                        </div>
                     </>
                   );
                 })()}

                 {/* Navigation Buttons */}
                 <div className="mt-8 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl">
                    <button
                      onClick={() => { resetProgramState(); window.location.hash = 'home'; }}
                      className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-orange-500 font-semibold transition-colors"
                    >
                      <Home size={20} /> <span className="hidden sm:inline">Home</span>
                    </button>

                    {activeView === 'program12' ? (
                      <button
                        onClick={() => { resetProgramState(); window.location.hash = 'home'; }}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-orange-500 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md"
                      >
                         Perfect! Back Home
                      </button>
                    ) : (
                      (() => {
                        const nextMap: Record<string, string> = {
                          'program1': 'Program 2',
                          'program2': 'Program 3',
                          'program3': 'Program 4',
                          'program4': 'Program 5A',
                          'program5a': 'Program 5B',
                          'program5b': 'Program 6',
                          'program6': 'Program 7',
                          'program7': 'Program 8',
                          'program8': 'Program 9',
                          'program9': 'Program 10',
                          'program10': 'Program 11',
                          'program11': 'Program 12',
                        };
                        const nextName = nextMap[activeView];
                        return nextName ? (
                          <button
                            onClick={() => handleProgramClick(nextName)}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md shadow-orange-500/20"
                          >
                            Next <ArrowRight size={20} />
                          </button>
                        ) : null;
                      })()
                    )}
                 </div>
             </div>
          </div>
        </section>
      )}

      {/* VIEW: VISUALIZER */}
      {activeView === 'visualizer' && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
           <PathfindingVisualizer />
        </section>
      )}
      {/* VIEW: SORTING */}
      {activeView === 'sorting' && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
           <SortingVisualizer />
        </section>
      )}

      {/* VIEW: TREES & GRAPHS */}
      {activeView === 'tree-graph' && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
           <TreeGraphVisualizer />
        </section>
      )}

      {/* VIEW: SYSTEM DESIGN */}
      {activeView === 'system-design' && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
           <SystemDesign />
        </section>
      )}

      {/* VIEW: REPORT ISSUE */}
      {activeView === 'report' && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
           <ReportIssue />
        </section>
      )}


      {/* --- FOOTER with GitHub & Social Links --- */}
      <footer className="bg-slate-900 text-gray-300 py-16 mt-20 border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Brand & Vision */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              DSA Study <span className="text-orange-500">Hub</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              The complete platform to master Data Structures and Algorithms. 
              Built for developers, by developers.
            </p>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Topic-wise Roadmap</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Blind 75 Sheet</a></li>
              <li><button onClick={() => {resetProgramState(); setActiveView('system-design');}} className="hover:text-orange-400 transition-colors text-left">System Design Primer</button></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Mock Tests</a></li>
            </ul>
          </div>

          {/* Column 3: Company/Support */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => {resetProgramState(); window.location.hash = 'about';}} className="hover:text-orange-400 transition-colors">About Me</button></li>
              <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=pranavarun19@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Contact</a></li>
              <li><button onClick={() => {resetProgramState(); window.location.hash = 'report';}} className="hover:text-orange-400 transition-colors">Report Issue</button></li>
              <li><button onClick={() => {resetProgramState(); window.location.hash = 'privacy';}} className="hover:text-orange-400 transition-colors">Privacy Policy</button></li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Connect</h3>
            <div className="flex space-x-5">
              
              {/* GitHub Icon */}
              <a href="https://github.com/toxicbishop" className="p-2 bg-slate-800 rounded-full hover:bg-orange-600 hover:text-white transition-all group">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                   <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              {/* LinkedIn Icon */}
              <a href="https://www.linkedin.com/in/pranav-arun/" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all group" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                   <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* X / Twitter Icon */}
              <a href="https://x.com/Pranav63076884" className="p-2 bg-slate-800 rounded-full hover:bg-sky-500 hover:text-white transition-all group" target="_blank" rel="noopener noreferrer" aria-label="X.com - Pranav">
                <X size={18} />
              </a>

              {/* Instagram/Web Icon */}
              <a href="https://www.instagram.com/toxicbishop_/" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all group" target="_blank" rel="noopener noreferrer">
                 <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                   <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                   <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                 </svg>
              </a>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 DSA Study Hub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => {resetProgramState(); window.location.hash = 'terms';}} className="hover:text-gray-300">Terms</button>
            <button onClick={() => {resetProgramState(); window.location.hash = 'privacy';}} className="hover:text-gray-300">Privacy</button>
            <button onClick={() => {resetProgramState(); window.location.hash = 'cookies';}} className="hover:text-gray-300">Cookies</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
