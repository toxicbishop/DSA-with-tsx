import { useState, useEffect } from "react";
import { PROGRAM_MENUS } from "../data/constants";

interface BSTNode {
  val: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

interface CalendarDay {
  dayName?: string;
  date?: number;
  activity?: string;
}

interface Student {
  [key: string]: string | number | undefined;
  usn: string;
  name: string;
  branch: string;
  sem: number;
  phone: string;
}

interface Employee {
  [key: string]: string | number | undefined;
  ssn: string;
  name: string;
  dept: string;
  designation: string;
  sal: number;
  phone: string;
}

interface PolyTerm {
  coef: number;
  xexp: number;
  yexp: number;
  zexp: number;
}

export const useProgramSimulator = (activeView: string) => {
  const [programOutput, setProgramOutput] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  // States for various programs
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [numDays, setNumDays] = useState(0);
  const [stringMatchData, setStringMatchData] = useState({
    mainString: "",
    patternString: "",
    replaceString: "",
  });
  const [stackElements, setStackElements] = useState<number[]>([]);
  const [stackTop, setStackTop] = useState(-1);
  const [cqElements, setCqElements] = useState<string[]>(new Array(5).fill(""));
  const [cqFront, setCqFront] = useState(-1);
  const [cqRear, setCqRear] = useState(-1);
  const cqSize = 5;
  const [bstRoot, setBstRoot] = useState<BSTNode | null>(null);
  const [hashTable, setHashTable] = useState<(number | null)[]>(
    new Array(10).fill(null),
  );

  // Program 7 & 8
  const [students, setStudents] = useState<Student[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [subMode, setSubMode] = useState(false);

  // Program 9
  const [poly1, setPoly1] = useState<PolyTerm[]>([]);
  const [poly2, setPoly2] = useState<PolyTerm[]>([]);

  // Program 11
  const [adjMatrix, setAdjMatrix] = useState<number[][]>([]);
  const [numVertices, setNumVertices] = useState(0);

  const resetProgramState = () => {
    setProgramOutput([]);
    setUserInput("");
    setCurrentStep(0);
    setCalendarData([]);
    setNumDays(0);
    setStringMatchData({
      mainString: "",
      patternString: "",
      replaceString: "",
    });
    setStackElements([]);
    setStackTop(-1);
    setCqElements(new Array(5).fill(""));
    setCqFront(-1);
    setCqRear(-1);
    setBstRoot(null);
    setHashTable(new Array(10).fill(null));
    setStudents([]);
    setEmployees([]);
    setSubMode(false);
    setPoly1([]);
    setPoly2([]);
    setAdjMatrix([]);
    setNumVertices(0);
  };

  useEffect(() => {
    if (activeView.startsWith("program")) {
      resetProgramState();
      if (PROGRAM_MENUS[activeView]) {
        setProgramOutput(PROGRAM_MENUS[activeView]);
      } else {
        setProgramOutput([
          `--- ${activeView.replace("program", "Program ")} ---`,
          "Enter input to start:",
        ]);
      }
    }
  }, [activeView]);

  // --- Logic Helpers ---

  // Program 4
  const prec = (symb: string): number => {
    switch (symb) {
      case "#":
        return -1;
      case "(":
      case ")":
        return 0;
      case "+":
      case "-":
        return 1;
      case "*":
      case "/":
      case "%":
        return 2;
      case "^":
      case "$":
        return 3;
      default:
        return -1;
    }
  };

  const evaluateInfixToPostfix = (infixExpr: string) => {
    let result = "";
    const newStack = ["#"];
    for (let i = 0; i < infixExpr.length; i++) {
      const symb = infixExpr[i];
      if (symb === "(") newStack.push(symb);
      else if (symb === ")") {
        while (newStack[newStack.length - 1] !== "(") result += newStack.pop();
        newStack.pop();
      } else if (["+", "-", "*", "/", "%", "^", "$"].includes(symb)) {
        while (prec(newStack[newStack.length - 1]) >= prec(symb))
          result += newStack.pop();
        newStack.push(symb);
      } else result += symb;
    }
    while (newStack.length > 1) result += newStack.pop();
    return result;
  };

  // Program 5A
  const evaluateSuffix = (suffix: string) => {
    const stack: number[] = [];
    for (let i = 0; i < suffix.length; i++) {
      const char = suffix[i];
      if (!isNaN(parseInt(char))) stack.push(parseInt(char));
      else {
        const op2 = stack.pop()!;
        const op1 = stack.pop()!;
        switch (char) {
          case "+":
            stack.push(op1 + op2);
            break;
          case "-":
            stack.push(op1 - op2);
            break;
          case "*":
            stack.push(op1 * op2);
            break;
          case "/":
            stack.push(op1 / op2);
            break;
          case "%":
            stack.push(op1 % op2);
            break;
          case "^":
            stack.push(Math.pow(op1, op2));
            break;
        }
      }
    }
    return stack.pop();
  };

  // Program 5B
  const towerOfHanoi = (
    n: number,
    from: string,
    to: string,
    aux: string,
    output: string[] = [],
  ): string[] => {
    if (n === 0) return output;
    towerOfHanoi(n - 1, from, aux, to, output);
    output.push(`Move disk ${n} from ${from} to ${to}`);
    towerOfHanoi(n - 1, aux, to, from, output);
    return output;
  };

  // BST
  const insertBST = (root: BSTNode | null, val: number): BSTNode => {
    if (!root) return { val, left: null, right: null };
    if (val < root.val) root.left = insertBST(root.left, val);
    else root.right = insertBST(root.right, val);
    return root;
  };

  const inorder = (root: BSTNode | null, res: number[] = []) => {
    if (root) {
      inorder(root.left, res);
      res.push(root.val);
      inorder(root.right, res);
    }
    return res;
  };

  const preorder = (root: BSTNode | null, res: number[] = []) => {
    if (root) {
      res.push(root.val);
      preorder(root.left, res);
      preorder(root.right, res);
    }
    return res;
  };

  const postorder = (root: BSTNode | null, res: number[] = []) => {
    if (root) {
      postorder(root.left, res);
      postorder(root.right, res);
      res.push(root.val);
    }
    return res;
  };

  const searchBST = (root: BSTNode | null, key: number): boolean => {
    if (!root) return false;
    if (root.val === key) return true;
    if (key < root.val) return searchBST(root.left, key);
    return searchBST(root.right, key);
  };

  // --- Action Handlers ---

  const handleInputSubmit = () => {
    const choice = parseInt(userInput);

    switch (activeView) {
      case "program1":
        if (currentStep === 0) {
          const days = parseInt(userInput);
          if (isNaN(days) || days <= 0) {
            setProgramOutput([
              ...programOutput,
              "Please enter a valid number of days.",
            ]);
            return;
          }
          setNumDays(days);
          setProgramOutput([
            ...programOutput,
            `Enter the number of days in the week: ${days}`,
          ]);
          setCurrentStep(1);
          setCalendarData([]);
        } else {
          const dayIndex = Math.floor((currentStep - 1) / 3);
          const inputType = (currentStep - 1) % 3;
          const newCalendarData = [...calendarData];
          if (!newCalendarData[dayIndex]) newCalendarData[dayIndex] = {};

          if (inputType === 0) {
            newCalendarData[dayIndex].dayName = userInput;
            setProgramOutput([
              ...programOutput,
              `Enter the day name: ${userInput}`,
            ]);
          } else if (inputType === 1) {
            newCalendarData[dayIndex].date = parseInt(userInput);
            setProgramOutput([
              ...programOutput,
              `Enter the date: ${userInput}`,
            ]);
          } else {
            newCalendarData[dayIndex].activity = userInput;
            setProgramOutput([
              ...programOutput,
              `Enter the activity for the day: ${userInput}`,
            ]);
            if (dayIndex === numDays - 1) {
              setProgramOutput((prev) => [
                ...prev,
                "\nWeek's Activity Details:",
                ...newCalendarData.map(
                  (day, i) =>
                    `Day ${i + 1}:\nDay Name: ${day.dayName}\nDate: ${day.date}\nActivity: ${day.activity}\n`,
                ),
              ]);
              setCurrentStep(-1);
              return;
            }
          }
          setCalendarData(newCalendarData);
          setCurrentStep(currentStep + 1);
        }
        break;

      case "program2":
        if (currentStep === 0) {
          setStringMatchData((prev) => ({ ...prev, mainString: userInput }));
          setProgramOutput([
            ...programOutput,
            `Enter the main string: ${userInput}`,
          ]);
        } else if (currentStep === 1) {
          setStringMatchData((prev) => ({ ...prev, patternString: userInput }));
          setProgramOutput([
            ...programOutput,
            `Enter the pat string: ${userInput}`,
          ]);
        } else if (currentStep === 2) {
          const { mainString, patternString } = stringMatchData;
          let resultString = "";
          let found = false;
          let i = 0;
          while (i < mainString.length) {
            if (
              mainString.slice(i, i + patternString.length) === patternString
            ) {
              resultString += userInput;
              i += patternString.length;
              found = true;
            } else {
              resultString += mainString[i];
              i++;
            }
          }
          setProgramOutput((prev) => [
            ...prev,
            `Enter the replace string: ${userInput}`,
            `The string before pattern match is: ${mainString}`,
            found
              ? `The string after pattern match and replace is: ${resultString}`
              : "Pattern string is not found",
          ]);
        }
        setCurrentStep(currentStep + 1);
        break;

      case "program3":
        if (currentStep === 1) {
          const item = parseInt(userInput);
          if (!isNaN(item)) {
            if (stackTop === 2)
              setProgramOutput((prev) => [
                ...prev,
                "-----------Stack overflow-----------",
              ]);
            else {
              const newStack = [...stackElements];
              newStack[stackTop + 1] = item;
              setStackElements(newStack);
              setStackTop(stackTop + 1);
              setProgramOutput((prev) => [
                ...prev,
                `Element ${item} pushed to stack`,
              ]);
            }
            setCurrentStep(0);
          }
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [
                ...prev,
                "Enter an element to be pushed:",
              ]);
              setCurrentStep(1);
              break;
            case 2:
              if (stackTop === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "-----------Stack underflow-----------",
                ]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  `Element popped is: ${stackElements[stackTop]}`,
                ]);
                setStackTop(stackTop - 1);
              }
              break;
            case 3:
              if (stackTop === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "-----------Stack is empty-----------",
                ]);
              else {
                let flag = true;
                for (let i = 0; i <= Math.floor(stackTop / 2); i++)
                  if (stackElements[i] !== stackElements[stackTop - i]) {
                    flag = false;
                    break;
                  }
                setProgramOutput((prev) => [
                  ...prev,
                  flag
                    ? "It is palindrome number"
                    : "It is not a palindrome number",
                ]);
              }
              break;
            case 4:
              if (stackTop === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "-----------Stack is empty-----------",
                ]);
              else {
                let display = "Stack elements are:\n";
                for (let i = stackTop; i >= 0; i--)
                  display += `| ${stackElements[i]} |\n`;
                setProgramOutput((prev) => [...prev, display]);
              }
              break;
            case 5:
              setProgramOutput((prev) => [...prev, "Exiting program..."]);
              break;
          }
        }
        break;

      case "program4": {
        const p4Res = evaluateInfixToPostfix(userInput);
        setProgramOutput([
          `The entered infix expression is: ${userInput}`,
          `The corresponding postfix expression is: ${p4Res}`,
        ]);
        break;
      }

      case "program5a": {
        const p5aRes = evaluateSuffix(userInput);
        setProgramOutput([
          `The entered suffix expression is: ${userInput}`,
          `The result of evaluation is: ${p5aRes}`,
        ]);
        break;
      }

      case "program5b": {
        const disks = parseInt(userInput);
        if (!isNaN(disks) && disks > 0) {
          const moves = towerOfHanoi(disks, "A", "C", "B");
          setProgramOutput([`Tower of Hanoi with ${disks} disks:`, ...moves]);
        }
        break;
      }

      case "program6":
        if (currentStep === 1) {
          const newRear = (cqRear + 1) % cqSize;
          const newElements = [...cqElements];
          newElements[newRear] = userInput;
          setCqElements(newElements);
          setCqRear(newRear);
          if (cqFront === -1) setCqFront(0);
          setProgramOutput((prev) => [...prev, `Inserted ${userInput}`]);
          setCurrentStep(0);
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [...prev, "Enter element to insert:"]);
              setCurrentStep(1);
              break;
            case 2:
              if (cqFront === -1)
                setProgramOutput((prev) => [...prev, "Queue Underflow"]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted ${cqElements[cqFront]}`,
                ]);
                if (cqFront === cqRear) {
                  setCqFront(-1);
                  setCqRear(-1);
                } else setCqFront((cqFront + 1) % cqSize);
              }
              break;
            case 3:
              if (cqFront === -1)
                setProgramOutput((prev) => [...prev, "Queue is empty"]);
              else {
                let i = cqFront;
                let res = "Queue: ";
                while (true) {
                  res += cqElements[i] + " ";
                  if (i === cqRear) break;
                  i = (i + 1) % cqSize;
                }
                setProgramOutput((prev) => [...prev, res]);
              }
              break;
          }
        }
        break;

      case "program10": {
        if (currentStep === 1) {
          // Create many
          const val = parseInt(userInput);
          if (!isNaN(val)) {
            const newRoot = insertBST(bstRoot ? { ...bstRoot } : null, val);
            setBstRoot(newRoot);
            setProgramOutput((prev) => [...prev, `Inserted ${val}`]);
            if (numVertices === 1) {
              setProgramOutput((prev) => [...prev, "BST Creation complete."]);
              setCurrentStep(0);
            } else {
              setNumVertices((v) => v - 1);
              setProgramOutput((prev) => [...prev, "Enter next value:"]);
            }
          }
        } else if (currentStep === 2) {
          // Search
          const key = parseInt(userInput);
          const found = searchBST(bstRoot, key);
          setProgramOutput((prev) => [
            ...prev,
            `Search for ${key}: ${found ? "FOUND" : "NOT FOUND"}`,
          ]);
          setCurrentStep(0);
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [
                ...prev,
                "Enter number of elements to insert:",
              ]);
              setCurrentStep(-10);
              break;
            case 2:
              setProgramOutput((prev) => [...prev, "Enter key to search:"]);
              setCurrentStep(2);
              break;
            case 3:
              if (!bstRoot)
                setProgramOutput((prev) => [...prev, "Tree empty."]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  "Inorder: " + inorder(bstRoot).join(" "),
                  "Preorder: " + preorder(bstRoot).join(" "),
                  "Postorder: " + postorder(bstRoot).join(" "),
                ]);
              }
              break;
          }
          if (currentStep === -10) {
            const n = parseInt(userInput);
            setNumVertices(n);
            setProgramOutput((prev) => [
              ...prev,
              `Inserting ${n} elements. Enter first value:`,
            ]);
            setCurrentStep(1);
          }
        }
        break;
      }

      case "program12": {
        const hashKey = parseInt(userInput);
        if (!isNaN(hashKey)) {
          let idx = hashKey % 10;
          const newTable = [...hashTable];
          const startIdx = idx;
          while (newTable[idx] !== null) {
            idx = (idx + 1) % 10;
            if (idx === startIdx) {
              setProgramOutput((prev) => [...prev, "Overflow"]);
              return;
            }
          }
          newTable[idx] = hashKey;
          setHashTable(newTable);
          setProgramOutput((prev) => [
            ...prev,
            `Mapped ${hashKey} to ${idx}`,
            "Table: " + JSON.stringify(newTable),
          ]);
        }
        break;
      }

      case "program7": {
        if (currentStep > 0) {
          const fieldIndex = (currentStep - 1) % 5;
          const studentIndex = Math.floor((currentStep - 1) / 5);
          const newStudents = [...students];

          if (!newStudents[studentIndex]) {
            newStudents[studentIndex] = {
              usn: "",
              name: "",
              branch: "",
              sem: 0,
              phone: "",
            };
          }

          const steps = ["USN", "Name", "Branch", "Sem", "Phone"];
          const field = steps[fieldIndex].toLowerCase() as keyof Student;
          if (field === "sem") {
            newStudents[studentIndex].sem = parseInt(userInput);
          } else {
            newStudents[studentIndex][field] = userInput;
          }

          setProgramOutput((prev) => [
            ...prev,
            `Enter ${steps[fieldIndex]}: ${userInput}`,
          ]);

          if (fieldIndex === 4) {
            // Last field
            if (subMode) {
              // Stack Demo (Push)
              setProgramOutput((prev) => [...prev, "Pushed to stack."]);
              setCurrentStep(0);
              setSubMode(false);
            } else if (studentIndex === numVertices - 1) {
              // Creation complete
              setProgramOutput((prev) => [...prev, "SLL Created."]);
              setCurrentStep(0);
            } else {
              setProgramOutput((prev) => [
                ...prev,
                `\nEnter details for Student ${studentIndex + 2}:`,
                "Enter USN:",
              ]);
              setCurrentStep(currentStep + 1);
            }
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `Enter ${steps[fieldIndex + 1]}:`,
            ]);
            setCurrentStep(currentStep + 1);
          }
          setStudents(newStudents);
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [
                ...prev,
                "Enter number of students:",
              ]);
              setCurrentStep(-10); // Special step for N
              break;
            case 2:
              if (students.length === 0)
                setProgramOutput((prev) => [...prev, "SLL is empty."]);
              else {
                let res = "SLL Contents:\n";
                students.forEach(
                  (s, i) =>
                    (res += `|${i + 1}| USN: ${s.usn} | Name: ${s.name} | Branch: ${s.branch} | Sem: ${s.sem} | Ph: ${s.phone}\n`),
                );
                setProgramOutput((prev) => [...prev, res]);
              }
              break;
            case 3:
              setProgramOutput((prev) => [
                ...prev,
                "Insert at End - Enter USN:",
              ]);
              setNumVertices(students.length + 1);
              setCurrentStep(students.length * 5 + 1);
              break;
            case 4:
              if (students.length === 0)
                setProgramOutput((prev) => [...prev, "SLL is empty."]);
              else {
                const popped = students[students.length - 1];
                setStudents(students.slice(0, -1));
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted USN: ${popped.usn}`,
                ]);
              }
              break;
            case 5:
              setProgramOutput((prev) => [
                ...prev,
                "--- Stack Demo ---",
                "1: Push, 2: Pop, 3: Display, 4: Exit",
              ]);
              setSubMode(true);
              break;
            case 6:
              setProgramOutput((prev) => [...prev, "Exiting..."]);
              break;
          }

          if (currentStep === -10) {
            const n = parseInt(userInput);
            if (!isNaN(n) && n > 0) {
              setNumVertices(n);
              setProgramOutput((prev) => [
                ...prev,
                `Number of students: ${n}`,
                "\nEnter details for Student 1:",
                "Enter USN:",
              ]);
              setCurrentStep(1);
            }
          }

          if (subMode) {
            switch (choice) {
              case 1:
                setProgramOutput((prev) => [
                  ...prev,
                  "Enter details for Push:",
                  "Enter USN:",
                ]);
                setCurrentStep(students.length * 5 + 1);
                setNumVertices(students.length + 1);
                // subMode remains true but we use it as a flag in fields
                break;
              case 2:
                if (students.length === 0)
                  setProgramOutput((prev) => [...prev, "Stack underflow."]);
                else {
                  setProgramOutput((prev) => [
                    ...prev,
                    `Popped USN: ${students[0].usn}`,
                  ]);
                  setStudents(students.slice(1));
                }
                break;
              case 3:
                if (students.length === 0)
                  setProgramOutput((prev) => [...prev, "Stack is empty."]);
                else {
                  let res = "Stack (Top to Bottom):\n";
                  students.forEach((s) => (res += `| USN: ${s.usn} |\n`));
                  setProgramOutput((prev) => [...prev, res]);
                }
                break;
              case 4:
                setSubMode(false);
                setProgramOutput((prev) => [
                  ...prev,
                  "Exited Stack Demo.",
                  "--- Main Menu ---",
                  "1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
                ]);
                break;
            }
          }
        }
        break;
      }

      case "program8": {
        if (currentStep > 0) {
          const fieldIndex = (currentStep - 1) % 6;
          const empIndex = Math.floor((currentStep - 1) / 6);
          const newEmps = [...employees];

          if (!newEmps[empIndex]) {
            newEmps[empIndex] = {
              ssn: "",
              name: "",
              dept: "",
              designation: "",
              sal: 0,
              phone: "",
            };
          }

          const steps = ["SSN", "Name", "Dept", "Designation", "Sal", "Phone"];
          const field = steps[fieldIndex].toLowerCase() as keyof Employee;
          if (field === "sal") {
            newEmps[empIndex].sal = parseInt(userInput);
          } else {
            newEmps[empIndex][field] = userInput;
          }

          setProgramOutput((prev) => [
            ...prev,
            `Enter ${steps[fieldIndex]}: ${userInput}`,
          ]);

          if (fieldIndex === 5) {
            // Last field
            if (subMode) {
              // DEQ Demo
              setProgramOutput((prev) => [...prev, "Operation complete."]);
              setCurrentStep(0);
              setSubMode(false);
            } else if (empIndex === numVertices - 1) {
              setProgramOutput((prev) => [...prev, "DLL Created."]);
              setCurrentStep(0);
            } else {
              setProgramOutput((prev) => [
                ...prev,
                `\nEnter details for Employee ${empIndex + 2}:`,
                "Enter SSN:",
              ]);
              setCurrentStep(currentStep + 1);
            }
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `Enter ${steps[fieldIndex + 1]}:`,
            ]);
            setCurrentStep(currentStep + 1);
          }
          setEmployees(newEmps);
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [
                ...prev,
                "Enter number of employees:",
              ]);
              setCurrentStep(-10);
              break;
            case 2:
              if (employees.length === 0)
                setProgramOutput((prev) => [...prev, "DLL is empty."]);
              else {
                let res = "DLL Contents:\n";
                employees.forEach(
                  (e, i) =>
                    (res += `|${i + 1}| SSN: ${e.ssn} | Name: ${e.name} | Dept: ${e.dept} | Desig: ${e.designation} | Sal: ${e.sal} | Ph: ${e.phone}\n`),
                );
                setProgramOutput((prev) => [...prev, res]);
              }
              break;
            case 3: // Insert End
              setProgramOutput((prev) => [
                ...prev,
                "Insert at End - Enter SSN:",
              ]);
              setNumVertices(employees.length + 1);
              setCurrentStep(employees.length * 6 + 1);
              break;
            case 4: // Delete End
              if (employees.length === 0)
                setProgramOutput((prev) => [...prev, "DLL is empty."]);
              else {
                const popped = employees[employees.length - 1];
                setEmployees(employees.slice(0, -1));
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted SSN: ${popped.ssn}`,
                ]);
              }
              break;
            case 5: // Insert Front
              setProgramOutput((prev) => [
                ...prev,
                "Insert at Front - Enter SSN:",
              ]);
              setSubMode(true); // temporary flag
              setCurrentStep(employees.length * 6 + 1);
              setNumVertices(employees.length + 1);
              break;
            case 6: // Delete Front
              if (employees.length === 0)
                setProgramOutput((prev) => [...prev, "DLL is empty."]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted SSN: ${employees[0].ssn}`,
                ]);
                setEmployees(employees.slice(1));
              }
              break;
            case 7:
              setProgramOutput((prev) => [
                ...prev,
                "--- DEQ Demo ---",
                "1: Ins Front, 2: Del Front, 3: Ins End, 4: Del End, 5: Display, 6: Exit",
              ]);
              setSubMode(true);
              break;
          }

          if (currentStep === -10) {
            const n = parseInt(userInput);
            if (!isNaN(n) && n > 0) {
              setNumVertices(n);
              setProgramOutput((prev) => [
                ...prev,
                `Number of employees: ${n}`,
                "\nEnter details for Employee 1:",
                "Enter SSN:",
              ]);
              setCurrentStep(1);
            }
          }

          if (subMode && activeView === "program8") {
            // Handle inner DEQ choices if needed, but the current simplified approach just reuses main menu logic
            // for simplicity in this demo.
          }
        }
        break;
      }

      case "program9": {
        if (currentStep > 0) {
          const fieldIndex = (currentStep - 1) % 4;
          const termIndex = Math.floor((currentStep - 1) / 4);
          const targetPoly = subMode ? poly2 : poly1;
          const newPoly = [...targetPoly];

          if (!newPoly[termIndex])
            newPoly[termIndex] = { coef: 0, xexp: 0, yexp: 0, zexp: 0 };

          const val = parseInt(userInput);
          if (fieldIndex === 0) newPoly[termIndex].coef = val;
          else if (fieldIndex === 1) newPoly[termIndex].xexp = val;
          else if (fieldIndex === 2) newPoly[termIndex].yexp = val;
          else if (fieldIndex === 3) newPoly[termIndex].zexp = val;

          setProgramOutput((prev) => [
            ...prev,
            `${["Coef", "Xexp", "Yexp", "Zexp"][fieldIndex]}: ${userInput}`,
          ]);

          if (fieldIndex === 3) {
            if (termIndex === numVertices - 1) {
              setProgramOutput((prev) => [
                ...prev,
                "Polynomial reading complete.",
              ]);
              setCurrentStep(-5); // evaluation step
              if (subMode) {
                // Addition result
                const res = [...poly1, ...poly2]; // Simplified sum
                setProgramOutput((prev) => [
                  ...prev,
                  "\nSum of Polynomials:",
                  res
                    .map((t) => `${t.coef}x^${t.xexp}y^${t.yexp}z^${t.zexp}`)
                    .join(" + "),
                  "\nAddition simulation complete.",
                ]);
                setCurrentStep(0);
                setSubMode(false);
              } else {
                setProgramOutput((prev) => [
                  ...prev,
                  "\nEnter x, y, z for evaluation (comma separated):",
                ]);
              }
            } else {
              setProgramOutput((prev) => [
                ...prev,
                `\nEnter term ${termIndex + 2}:`,
                "Coef:",
              ]);
              setCurrentStep(currentStep + 1);
            }
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `${["Xexp", "Yexp", "Zexp"][fieldIndex + 1]}:`,
            ]);
            setCurrentStep(currentStep + 1);
          }
          if (subMode) setPoly2(newPoly);
          else setPoly1(newPoly);
        } else if (currentStep === -5) {
          const [x, y, z] = userInput.split(",").map((v) => parseInt(v.trim()));
          let sum = 0;
          poly1.forEach(
            (p) =>
              (sum +=
                p.coef *
                Math.pow(x, p.xexp) *
                Math.pow(y, p.yexp) *
                Math.pow(z, p.zexp)),
          );
          setProgramOutput((prev) => [
            ...prev,
            `Values: x=${x}, y=${y}, z=${z}`,
            `Evaluation Result: ${sum}`,
          ]);
          setCurrentStep(0);
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [
                ...prev,
                "--- Polynomial Evaluation ---",
                "Enter number of terms:",
              ]);
              setCurrentStep(-10);
              setSubMode(false);
              break;
            case 2:
              setProgramOutput((prev) => [
                ...prev,
                "--- Polynomial Addition ---",
                "Enter terms for Poly 1:",
              ]);
              setCurrentStep(-10);
              setSubMode(false);
              break;
          }
          if (currentStep === -10) {
            const n = parseInt(userInput);
            setNumVertices(n);
            setProgramOutput((prev) => [
              ...prev,
              `Terms: ${n}`,
              "Enter Term 1:",
              "Coef:",
            ]);
            setCurrentStep(1);
          }
        }
        break;
      }

      case "program11": {
        if (currentStep === -1) {
          // Adj Matrix row entry
          const row = userInput.split(" ").map((v) => parseInt(v.trim()));
          const newMatrix = [...adjMatrix];
          newMatrix.push(row);
          setAdjMatrix(newMatrix);
          if (newMatrix.length === numVertices) {
            setProgramOutput((prev) => [
              ...prev,
              "Matrix entry complete.",
              "Enter starting vertex (1 to N):",
            ]);
            setCurrentStep(-2); // Starting vertex
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `Enter row ${newMatrix.length + 1}:`,
            ]);
          }
        } else if (currentStep === -2) {
          const start = parseInt(userInput) - 1;
          setNumDays(start); // abuse numDays to store start vertex
          setProgramOutput((prev) => [
            ...prev,
            `Start Vertex: ${start + 1}`,
            "1: BFS, 2: DFS",
          ]);
          setCurrentStep(0);
        } else if (currentStep === 0 && (choice === 1 || choice === 2)) {
          const visitedNodes: number[] = new Array(numVertices).fill(0);
          const output: number[] = [];
          const start = numDays;

          if (choice === 1) {
            // BFS
            const q = [start];
            visitedNodes[start] = 1;
            while (q.length > 0) {
              const u = q.shift()!;
              output.push(u + 1);
              for (let v = 0; v < numVertices; v++) {
                if (adjMatrix[u][v] === 1 && visitedNodes[v] === 0) {
                  visitedNodes[v] = 1;
                  q.push(v);
                }
              }
            }
            setProgramOutput((prev) => [
              ...prev,
              "BFS Output: " + output.join(" "),
            ]);
          } else {
            // DFS
            const traverse = (u: number) => {
              visitedNodes[u] = 1;
              output.push(u + 1);
              for (let v = 0; v < numVertices; v++) {
                if (adjMatrix[u][v] === 1 && visitedNodes[v] === 0) traverse(v);
              }
            };
            traverse(start);
            setProgramOutput((prev) => [
              ...prev,
              "DFS Output: " + output.join(" "),
            ]);
          }
        } else {
          setProgramOutput((prev) => [...prev, "Enter number of vertices:"]);
          setCurrentStep(-10);
          if (currentStep === -10) {
            const n = parseInt(userInput);
            setNumVertices(n);
            setAdjMatrix([]);
            setProgramOutput((prev) => [
              ...prev,
              `Vertices: ${n}`,
              "Enter row 1 (space separated):",
            ]);
            setCurrentStep(-1);
          }
        }
        break;
      }

      default:
        setProgramOutput((prev) => [...prev, `Echo: ${userInput}`]);
        break;
    }
    setUserInput("");
  };

  return {
    programOutput,
    userInput,
    setUserInput,
    handleInputSubmit,
    resetProgramState,
  };
};
