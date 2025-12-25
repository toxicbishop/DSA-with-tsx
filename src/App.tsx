import React, { useState, useEffect } from 'react';
import { Moon, Sun, ChevronDown, Linkedin, Instagram, Twitter, Facebook, Code2, Home, User, Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  
  // View State: 'home', 'about', 'program1', 'program2', etc.
  const [activeView, setActiveView] = useState('home'); 
  
  const [programOutput, setProgramOutput] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  // Program 1 State
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [numDays, setNumDays] = useState(0);

  // Program 2 State
  const [stringMatchData, setStringMatchData] = useState({
    mainString: '',
    patternString: '',
    replaceString: ''
  });

  // Program 3 State
  const [stack, setStack] = useState<string[]>(['#']);
  const [stackElements, setStackElements] = useState<number[]>([]);
  const [stackTop, setStackTop] = useState(-1);
  const [stackMenuChoice, setStackMenuChoice] = useState(0);
  const [stackInput, setStackInput] = useState('');

  // Program 4 State
  const [infix, setInfix] = useState('');
  const [postfix, setPostfix] = useState('');

  // --- Reset Helper ---
  const resetProgramState = () => {
    setProgramOutput([]);
    setUserInput('');
    setCurrentStep(0);
    setCalendarData([]);
    setNumDays(0);
    setStringMatchData({ mainString: '', patternString: '', replaceString: '' });
    setStackElements([]);
    setStackTop(-1);
    setStackMenuChoice(0);
    setStackInput('');
    setInfix('');
    setPostfix('');
    setIsProgramsOpen(false);
  };

  const handleHomeClick = () => {
    resetProgramState();
    setActiveView('home');
  };

  const handleAboutClick = () => {
    resetProgramState();
    setActiveView('about');
  };

  const handleProgramClick = (programId: string) => {
    resetProgramState();
    const viewId = programId.toLowerCase().replace(/\s/g, ''); 
    setActiveView(viewId);
  };

  // --- Theme & Scroll Effects ---
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setDarkMode(theme === 'dark');

    const handleScroll = () => {
      setIsNavbarScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  // --- Logic: Program 4 (Infix to Postfix) ---
  const prec = (symb: string): number => {
    switch (symb) {
      case '#': return -1;
      case '(':
      case ')': return 0;
      case '+':
      case '-': return 1;
      case '*':
      case '/':
      case '%': return 2;
      case '^':
      case '$': return 3;
      default: return -1;
    }
  };

  const evaluateInfixToPostfix = (infixExpr: string) => {
    let result = '';
    const newStack = ['#'];
    
    for (let i = 0; i < infixExpr.length; i++) {
      const symb = infixExpr[i];
      
      if (symb === '(') {
        newStack.push(symb);
      } else if (symb === ')') {
        while (newStack[newStack.length - 1] !== '(') {
          result += newStack.pop();
        }
        newStack.pop(); // Remove '('
      } else if (['+', '-', '*', '/', '%', '^', '$'].includes(symb)) {
        while (prec(newStack[newStack.length - 1]) >= prec(symb)) {
          result += newStack.pop();
        }
        newStack.push(symb);
      } else {
        result += symb;
      }
    }
    while (newStack.length > 1) {
      result += newStack.pop();
    }
    return result;
  };

  const handleProgram4Input = () => {
    const result = evaluateInfixToPostfix(userInput);
    setProgramOutput([
      `The entered infix expression is: ${userInput}`,
      `The corresponding postfix expression is: ${result}`
    ]);
    setInfix(userInput);
    setPostfix(result);
    setUserInput('');
    setCurrentStep(1);
  };

  // --- Logic: Program 3 (Stack) ---
  const pushToStack = (item: number) => {
    if (stackTop === 2) { // MAX - 1 = 3 - 1 = 2
      setProgramOutput(prev => [...prev, "-----------Stack overflow-----------"]);
      return;
    }
    const newTop = stackTop + 1;
    const newStack = [...stackElements];
    newStack[newTop] = item;
    setStackElements(newStack);
    setStackTop(newTop);
    setProgramOutput(prev => [...prev, `Element ${item} pushed to stack`]);
  };

  const popFromStack = () => {
    if (stackTop === -1) {
      setProgramOutput(prev => [...prev, "-----------Stack underflow-----------"]);
      return;
    }
    const item = stackElements[stackTop];
    setStackTop(stackTop - 1);
    setProgramOutput(prev => [...prev, `Element popped is: ${item}`]);
  };

  const displayStack = () => {
    if (stackTop === -1) {
      setProgramOutput(prev => [...prev, "-----------Stack is empty-----------"]);
      return;
    }
    let stackDisplay = "Stack elements are:\n";
    for (let i = stackTop; i >= 0; i--) {
      stackDisplay += `| ${stackElements[i]} |\n`;
    }
    setProgramOutput(prev => [...prev, stackDisplay]);
  };

  const checkPalindrome = () => {
    if (stackTop === -1) {
      setProgramOutput(prev => [...prev, "-----------Stack is empty-----------"]);
      return;
    }
    let stackContent = "Stack content are:\n";
    for (let i = stackTop; i >= 0; i--) {
      stackContent += `| ${stackElements[i]} |\n`;
    }
    let reverseContent = "Reverse of stack content are:\n";
    for (let i = 0; i <= stackTop; i++) {
      reverseContent += `| ${stackElements[i]} |\n`;
    }
    let flag = true;
    for (let i = 0; i <= Math.floor(stackTop / 2); i++) {
      if (stackElements[i] !== stackElements[stackTop - i]) {
        flag = false;
        break;
      }
    }
    const result = flag ? "It is palindrome number" : "It is not a palindrome number";
    setProgramOutput(prev => [...prev, stackContent, reverseContent, result]);
  };

  const handleStackOperation = () => {
    const choice = parseInt(stackInput);
    setStackMenuChoice(choice);
    
    switch (choice) {
      case 1:
        setProgramOutput(prev => [...prev, "Enter an element to be pushed:"]);
        setCurrentStep(1);
        break;
      case 2:
        popFromStack();
        break;
      case 3:
        checkPalindrome();
        break;
      case 4:
        displayStack();
        break;
      case 5:
        setProgramOutput(prev => [...prev, "Exiting program..."]);
        break;
      default:
        setProgramOutput(prev => [...prev, "Please enter valid choice"]);
        break;
    }
    setStackInput('');
  };

  const handleStackInput = () => {
    if (stackMenuChoice === 1 && currentStep === 1) {
      const item = parseInt(stackInput);
      if (!isNaN(item)) {
        pushToStack(item);
        setCurrentStep(0);
        setStackMenuChoice(0);
      }
    } else {
      handleStackOperation();
    }
    setStackInput('');
  };

  // --- Logic: Program 2 (String Match) ---
  const handleStringMatch = () => {
    const { mainString, patternString, replaceString } = stringMatchData;
    let result = '';
    let found = false;
    let i = 0;
    while (i < mainString.length) {
      if (mainString.slice(i, i + patternString.length) === patternString) {
        result += replaceString;
        i += patternString.length;
        found = true;
      } else {
        result += mainString[i];
        i++;
      }
    }
    setProgramOutput(prev => [
      ...prev,
      `The string before pattern match is: ${mainString}`,
      found 
        ? `The string after pattern match and replace is: ${result}`
        : "Pattern string is not found"
    ]);
  };

  const handleProgram2Input = () => {
    switch(currentStep) {
      case 0:
        setStringMatchData(prev => ({ ...prev, mainString: userInput }));
        setProgramOutput([...programOutput, `Enter the main string: ${userInput}`]);
        break;
      case 1:
        setStringMatchData(prev => ({ ...prev, patternString: userInput }));
        setProgramOutput([...programOutput, `Enter the pat string: ${userInput}`]);
        break;
      case 2:
        setStringMatchData(prev => ({ ...prev, replaceString: userInput }));
        setProgramOutput([...programOutput, `Enter the replace string: ${userInput}`]);
        handleStringMatch();
        break;
    }
    setUserInput('');
    setCurrentStep(currentStep + 1);
  };

  // --- Logic: Program 1 (Calendar) ---
  const handleProgram1Input = () => {
    if (currentStep === 0) {
      const days = parseInt(userInput);
      if (isNaN(days) || days <= 0) {
        setProgramOutput([...programOutput, 'Please enter a valid number of days.']);
        return;
      }
      setNumDays(days);
      setProgramOutput([...programOutput, `Enter the number of days in the week: ${days}`]);
      setCurrentStep(1);
      setCalendarData([]);
    } else {
      const dayIndex = Math.floor((currentStep - 1) / 3);
      const inputType = (currentStep - 1) % 3;
      
      const newCalendarData = [...calendarData];
      if (!newCalendarData[dayIndex]) {
        newCalendarData[dayIndex] = {};
      }

      switch (inputType) {
        case 0:
          newCalendarData[dayIndex].dayName = userInput;
          setProgramOutput([...programOutput, `Enter the day name: ${userInput}`]);
          break;
        case 1:
          const date = parseInt(userInput);
          if (isNaN(date)) {
            setProgramOutput([...programOutput, 'Please enter a valid date.']);
            return;
          }
          newCalendarData[dayIndex].date = date;
          setProgramOutput([...programOutput, `Enter the date: ${date}`]);
          break;
        case 2:
          newCalendarData[dayIndex].activity = userInput;
          setProgramOutput([...programOutput, `Enter the activity for the day: ${userInput}`]);
          if (dayIndex === numDays - 1) {
            setProgramOutput(prev => [
              ...prev,
              '\nWeek\'s Activity Details:',
              ...newCalendarData.map((day, i) => (
                `Day ${i + 1}:\nDay Name: ${day.dayName}\nDate: ${day.date}\nActivity: ${day.activity}\n`
              ))
            ]);
            setCurrentStep(-1);
            return;
          }
          break;
      }
      setCalendarData(newCalendarData);
      setCurrentStep(currentStep + 1);
    }
    setUserInput('');
  };

  // --- Master Submit Handler ---
  const handleInputSubmit = () => {
    switch(activeView) {
      case 'program1':
        handleProgram1Input();
        break;
      case 'program2':
        handleProgram2Input();
        break;
      case 'program3':
        handleStackInput();
        break;
      case 'program4':
        handleProgram4Input();
        break;
      default:
        console.log("No handler for this program yet");
        break;
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isNavbarScrolled ? 'bg-white/10 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-orange-500">DSA Study Hub</h1>
            
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={handleHomeClick}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors"
              >
                <Home size={18} />
                <span>Home</span>
              </button>
              
              <div className="relative programs-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProgramsOpen(!isProgramsOpen);
                  }}
                  className="flex items-center space-x-1 hover:text-orange-500 transition-colors"
                >
                  <Code2 size={18} />
                  <span>Programs</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProgramsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 border border-white/20">
                    {programs.map((program) => (
                      <a
                        key={program.href}
                        href={program.href}
                        className="block px-4 py-2 hover:bg-orange-500/10 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          handleProgramClick(program.name);
                        }}
                      >
                        {program.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleAboutClick}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors"
              >
                <User size={18} />
                <span>About Me</span>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-orange-500/10 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      {activeView === 'home' && (
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
              Master Data Structures & Algorithms
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Explore comprehensive study materials and coding programs to ace DSA.
            </p>
          </div>
        </section>
      )}

      {/* --- ABOUT SECTION --- */}
      {activeView === 'about' && (
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`p-8 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white shadow-xl'}`}>
              <div className="text-center mb-8">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-3xl font-bold mb-2">Pranav Arun</h2>
                <p className="text-lg opacity-80">Data Structures & Algorithms Instructor</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="text-orange-500" size={20} />
                    <span>Student at KSSEM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="text-orange-500" size={20} />
                    <span>B.E in CS&BS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-orange-500" size={20} />
                    <span>KSSEM Bengaluru</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-orange-500" size={20} />
                    <span>pranavarun19@gmail.com</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-2">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Data Structures', 'Algorithms', 'Problem Solving', 'C++', 'Java', 'Python', 'System Design'].map((skill) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-full ${
                          darkMode
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200/20">
                <h3 className="text-xl font-semibold mb-4">Teaching Philosophy</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-orange-50'}`}>
                    <h4 className="font-semibold mb-2">Learn by Doing</h4>
                    <p>Hands-on practice with real coding challenges and interactive examples.</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-orange-50'}`}>
                    <h4 className="font-semibold mb-2">Visual Learning</h4>
                    <p>Complex concepts explained through intuitive visualizations and diagrams.</p>
                  </div>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-orange-50'}`}>
                    <h4 className="font-semibold mb-2">Progressive Learning</h4>
                    <p>Structured curriculum that builds from fundamentals to advanced topics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- PROGRAMS SECTION --- */}
      {activeView.startsWith('program') && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white shadow-xl'}`}>
              
              {/* Program 1 */}
              {activeView === 'program1' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Program 1: Weekly Calendar</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                        {`#include<stdio.h>
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
}`}
                      </pre>
                    </div>
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                          placeholder={
                            currentStep === 0
                              ? "Enter the number of days"
                              : currentStep > 0 && currentStep % 3 === 1
                              ? "Enter day name"
                              : currentStep > 0 && currentStep % 3 === 2
                              ? "Enter date"
                              : "Enter activity"
                          }
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button onClick={handleInputSubmit} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">Submit</button>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">{programOutput.join('\n')}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Program 2 */}
              {activeView === 'program2' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Program 2: String Pattern Matching</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                        {`#include<stdio.h>

char str[50], pat[20], rep[20], res[50];
int c = 0, m = 0, i = 0, j = 0, k, flag = 0;

void stringmatch() {
    while (str[c] != '\\0') {
        if (str[m] == pat[i]) {
            i++;
            m++;
            if (pat[i] == '\\0') {
                flag = 1;
                for (k = 0; rep[k] != '\\0'; k++, j++) {
                    res[j] = rep[k];
                }
                i = 0;
                c = m;
            }
        } else {
            res[j] = str[c];
            j++;
            c++;
            m = c;
            i = 0;
        }
    }
    res[j] = '\\0';
}

void main() {
    printf("Enter the main string:");
    gets(str);
    printf("\\nEnter the pat string:");
    gets(pat);
    printf("\\nEnter the replace string:");
    gets(rep);
    printf("\\nThe string before pattern match is:\\n %s", str);
    stringmatch();
    if (flag == 1)
        printf("\\nThe string after pattern match and replace is: \\n %s ", res);
    else
        printf("\\nPattern string is not found");
}`}
                      </pre>
                    </div>
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                          placeholder={
                            currentStep === 0 ? "Enter main string" : currentStep === 1 ? "Enter pattern string" : "Enter replace string"
                          }
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button onClick={handleInputSubmit} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">Submit</button>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">{programOutput.join('\n')}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Program 3 */}
              {activeView === 'program3' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Program 3: Stack Operations</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                        {`#include<stdio.h>
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
        printf("\\n\\n\\n\\n-----------Menu----------- : ");
        printf("\\n=>1.Push an Element to Stack and Overflow demo ");
        printf("\\n=>2.Pop an Element from Stack and Underflow demo");
        printf("\\n=>3.Palindrome demo ");
        printf("\\n=>4.Display ");
        printf("\\n=>5.Exit");
        printf("\\nEnter your choice: ");
        scanf("%d", &choice);
        switch (choice) {
        case 1:
            printf("\\nEnter an element to be pushed: ");
            scanf("%d", &item);
            push(item);
            break;
        case 2:
            item = pop();
            if (item != -1)
                printf("\\nElement popped is: %d", item);
            break;
        case 3:
            palindrome();
            break;
        case 4:
            display();
            break;
        case 5:
            exit(1);
        default:
            printf("\\nPlease enter valid choice ");
            break;
        }
    }
}`}
                      </pre>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h3 className="font-semibold mb-2">Menu Options:</h3>
                        <ul className="space-y-1 text-sm">
                          <li>1. Push Element</li>
                          <li>2. Pop Element</li>
                          <li>3. Palindrome Check</li>
                          <li>4. Display</li>
                          <li>5. Exit</li>
                        </ul>
                      </div>
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={stackInput}
                          onChange={(e) => setStackInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                          placeholder={stackMenuChoice === 1 && currentStep === 1 ? "Enter element to push" : "Enter choice (1-5)"}
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button onClick={handleInputSubmit} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">Submit</button>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                           {programOutput.length === 0 
                            ? "-----------Menu----------- :\n=>1.Push\n=>2.Pop\n=>3.Palindrome\n=>4.Display\n=>5.Exit\nEnter your choice:"
                            : programOutput.join('\n')
                          }
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Program 4 - FIXED & ADDED */}
              {activeView === 'program4' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Program 4: Infix to Postfix</h2>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                        {`#include<stdio.h>
#include<ctype.h>

char stack[100];
int top = -1;

void push(char x) {
    stack[++top] = x;
}

char pop() {
    if(top == -1) return -1;
    return stack[top--];
}

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
    printf("Postfix expression : ");
    e = exp;
    
    while(*e != '\\0') {
        if(isalnum(*e))
            printf("%c",*e);
        else if(*e == '(')
            push(*e);
        else if(*e == ')') {
            while((x = pop()) != '(')
                printf("%c", x);
        } else {
            while(priority(stack[top]) >= priority(*e))
                printf("%c",pop());
            push(*e);
        }
        e++;
    }
    while(top != -1) {
        printf("%c",pop());
    }
}`}
                      </pre>
                    </div>
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
                          placeholder="Enter infix expression (e.g. a+b)"
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button onClick={handleInputSubmit} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">Submit</button>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[100px]">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">{programOutput.join('\n')}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-white/5 backdrop-blur-sm py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-6">&copy; 2025 DSA Study Hub</p>
          <div className="flex justify-center space-x-6">
            {[{ Icon: Linkedin, href: '#' }, { Icon: Instagram, href: '#' }, { Icon: Twitter, href: '#' }, { Icon: Facebook, href: '#' }].map(({ Icon, href }) => (
              <a key={href} href={href} className="p-2 rounded-full hover:bg-orange-500/10 transition-all transform hover:scale-110">
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
