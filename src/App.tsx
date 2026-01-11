import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Moon, Sun, ChevronDown, Code2, Home, User, Mail, MapPin, Briefcase, GraduationCap, Copy, Check, Menu, X, BookOpen, ArrowRight, Map, Eye,Bug, Server } from 'lucide-react';
import PathfindingVisualizer from './components/PathfindingVisualizer';
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
const CodeBlock = ({ code, darkMode }: { code: string, darkMode: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg group overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
      <div className="absolute top-2 right-2 z-10 transition-opacity opacity-0 group-hover:opacity-100">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-white/80 dark:bg-black/80 hover:bg-orange-500 hover:text-white transition-colors shadow-sm backdrop-blur-sm"
          title="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language="c"
        style={darkMode ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          backgroundColor: darkMode ? '#1f2937' : '#f9fafb', // gray-800 / gray-50
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
  const [activeView, setActiveView] = useState('home'); 




  // --- RESET ---
  const resetProgramState = () => {
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
    const s = () => setIsNavbarScrolled(window.scrollY > 20);
    window.addEventListener('scroll', s);
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      window.removeEventListener('scroll', s);
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);


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
    <div className={`min-h-screen relative z-0 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`absolute inset-0 -z-10 bg-[size:30px_30px] ${darkMode ? 'bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)]'}`}></div>
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
              
              <button onClick={() => {resetProgramState(); setActiveView('visualizer');}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Eye size={18} /><span>Visualizer</span></button>
              <button onClick={() => {resetProgramState(); setActiveView('system-design');}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><Server size={18} /><span>System Design</span></button>
              
              <button onClick={() => {resetProgramState(); setActiveView('about');}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors"><User size={18} /><span>About Me</span></button>
              <button onClick={() => {resetProgramState(); setActiveView('report');}} className="flex items-center space-x-1 hover:text-orange-500 transition-colors" title="Report Issue"><Bug size={18} /></button>

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

             <button onClick={() => {resetProgramState(); setActiveView('visualizer'); setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Eye size={20} /><span>Visualizer</span></button>
             <button onClick={() => {resetProgramState(); setActiveView('system-design'); setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Server size={20} /><span>System Design</span></button>
             <button onClick={() => {resetProgramState(); setActiveView('report'); setIsMobileMenuOpen(false);}} className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg"><Bug size={20} /><span>Report Issue</span></button>

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
                      <span>0/50 Solved</span>
                   </div>
                   <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 w-[2%] group-hover:w-[5%] transition-all duration-1000 ease-out"></div>
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
                      <span>0/75 Solved</span>
                   </div>
                   <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400 w-[1%] group-hover:w-[3%] transition-all duration-1000 ease-out"></div>
                   </div>
                </div>
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
                  className="p-4 rounded-xl bg-white dark:bg-grey-500/5 border border-gray-700 dark:border-gray-700 shadow-sm hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition-all transform hover:scale-105 text-left group"
                >
                  <span className="font-semibold text-black dark:text-gray-200 group-hover:text-orange-500 transition-colors">
                    {topic.title}
                  </span>
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
                onClick={() => {resetProgramState(); setActiveView('visualizer');}}
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
                 <h2 className="text-2xl font-bold text-orange-500">Program {activeView.replace('program','').toUpperCase()}</h2>
                 {/* Use the Dictionary to fetch C Code */}
                 <CodeBlock code={C_CODE[activeView as keyof typeof C_CODE] || "// Code not found"} darkMode={darkMode} />
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
              <li><button onClick={() => {resetProgramState(); setActiveView('about');}} className="hover:text-orange-400 transition-colors">About Me</button></li>
              <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=pranavarun19@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Contact</a></li>
              <li><button onClick={() => {resetProgramState(); setActiveView('report');}} className="hover:text-orange-400 transition-colors">Report Issue</button></li>
              <li><button onClick={() => {resetProgramState(); setActiveView('privacy');}} className="hover:text-orange-400 transition-colors">Privacy Policy</button></li>
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
              <a href="https://www.linkedin.com/in/pranav-arun/" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all group">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                   <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              {/* Instagram/Web Icon */}
              <a href="https://www.instagram.com/toxicbishop_/" className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all group">
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
          <p>© 2025 DSA Study Hub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => {resetProgramState(); setActiveView('terms');}} className="hover:text-gray-300">Terms</button>
            <button onClick={() => {resetProgramState(); setActiveView('privacy');}} className="hover:text-gray-300">Privacy</button>
            <button onClick={() => {resetProgramState(); setActiveView('cookies');}} className="hover:text-gray-300">Cookies</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
