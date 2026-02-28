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
    if (!userInput.trim()) return;
    const choice = parseInt(userInput);

    // Echo user input in terminal style
    setProgramOutput((prev) => [...prev, `> ${userInput}`]);

    switch (activeView) {
      case "program1":
        if (currentStep === 0) {
          const daysNum = parseInt(userInput);
          if (isNaN(daysNum) || daysNum <= 0) {
            setProgramOutput((prev) => [
              ...prev,
              "Please enter a valid number of days:",
            ]);
            return;
          }
          setNumDays(daysNum);
          setProgramOutput((prev) => [
            ...prev,
            `\nEnter details for Day 1:`,
            "Enter the day name:",
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
            setProgramOutput((prev) => [...prev, "Enter the date:"]);
          } else if (inputType === 1) {
            newCalendarData[dayIndex].date = parseInt(userInput);
            setProgramOutput((prev) => [
              ...prev,
              "Enter the activity for the day:",
            ]);
          } else {
            newCalendarData[dayIndex].activity = userInput;
            if (dayIndex === numDays - 1) {
              setProgramOutput((prev) => [
                ...prev,
                "\nFinal Week Activity Details:",
                ...newCalendarData.map(
                  (day, i) =>
                    `Day ${i + 1} (${day.dayName}, ${day.date}): ${day.activity}`,
                ),
                "\nSimulation complete. Reset to start again.",
              ]);
              setCurrentStep(-1);
              setUserInput("");
              return;
            }
            setProgramOutput((prev) => [
              ...prev,
              `\nEnter details for Day ${dayIndex + 2}:`,
              "Enter the day name:",
            ]);
          }
          setCalendarData(newCalendarData);
          setCurrentStep(currentStep + 1);
        }
        break;

      case "program2":
        if (currentStep === 0) {
          setStringMatchData((prev) => ({ ...prev, mainString: userInput }));
          setProgramOutput((prev) => [...prev, "Enter the pattern string:"]);
        } else if (currentStep === 1) {
          setStringMatchData((prev) => ({ ...prev, patternString: userInput }));
          setProgramOutput((prev) => [...prev, "Enter the replace string:"]);
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
            `Original: ${mainString}`,
            found ? `Modified: ${resultString}` : "Pattern not found.",
            "\nSimulation complete. Reset to start again.",
          ]);
          setCurrentStep(-1);
        }
        if (currentStep < 2) setCurrentStep(currentStep + 1);
        break;

      case "program3":
        if (currentStep === 1) {
          const item = parseInt(userInput);
          if (!isNaN(item)) {
            if (stackTop >= 4) {
              setProgramOutput((prev) => [
                ...prev,
                "Stack Overflow!",
                "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
              ]);
            } else {
              const newS = [...stackElements];
              newS[stackTop + 1] = item;
              setStackElements(newS);
              setStackTop(stackTop + 1);
              setProgramOutput((prev) => [
                ...prev,
                `Pushed ${item}`,
                "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
              ]);
            }
            setCurrentStep(0);
          }
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [...prev, "Enter element to push:"]);
              setCurrentStep(1);
              break;
            case 2:
              if (stackTop === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "Stack Underflow!",
                  "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
                ]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  `Popped: ${stackElements[stackTop]}`,
                  "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
                ]);
                setStackTop(stackTop - 1);
              }
              break;
            case 3:
              if (stackTop === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "Stack Empty.",
                  "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
                ]);
              else {
                let isPalAt3 = true;
                for (let i = 0; i <= Math.floor(stackTop / 2); i++)
                  if (stackElements[i] !== stackElements[stackTop - i]) {
                    isPalAt3 = false;
                    break;
                  }
                setProgramOutput((prev) => [
                  ...prev,
                  isPalAt3 ? "It is a palindrome." : "Not a palindrome.",
                  "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
                ]);
              }
              break;
            case 4:
              if (stackTop === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "Stack Empty.",
                  "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
                ]);
              else {
                let sDisp = "Stack contents:\n";
                for (let i = stackTop; i >= 0; i--)
                  sDisp += `| ${stackElements[i]} |\n`;
                setProgramOutput((prev) => [
                  ...prev,
                  sDisp,
                  "\n1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
                ]);
              }
              break;
            case 5:
              setProgramOutput((prev) => [...prev, "Exited simulation."]);
              break;
          }
        }
        break;

      case "program4": {
        const p4Result = evaluateInfixToPostfix(userInput);
        setProgramOutput((prev) => [
          ...prev,
          `Postfix: ${p4Result}`,
          "\nEnter another expression (or reset):",
        ]);
        break;
      }

      case "program5a": {
        const p5aResult = evaluateSuffix(userInput);
        setProgramOutput((prev) => [
          ...prev,
          `Result: ${p5aResult}`,
          "\nEnter another expression (or reset):",
        ]);
        break;
      }

      case "program5b": {
        const hDisks = parseInt(userInput);
        if (!isNaN(hDisks) && hDisks > 0) {
          const moves = towerOfHanoi(hDisks, "A", "C", "B");
          setProgramOutput((prev) => [
            ...prev,
            `Moves for ${hDisks} disks:`,
            ...moves,
            "\nEnter number of disks for another run:",
          ]);
        } else
          setProgramOutput((prev) => [...prev, "Invalid number. Enter disks:"]);
        break;
      }

      case "program6":
        if (currentStep === 1) {
          const nR = (cqRear + 1) % cqSize;
          const nE = [...cqElements];
          nE[nR] = userInput;
          setCqElements(nE);
          setCqRear(nR);
          if (cqFront === -1) setCqFront(0);
          setProgramOutput((prev) => [
            ...prev,
            `Inserted ${userInput}`,
            "\n1: Insert, 2: Delete, 3: Display, 4: Exit",
          ]);
          setCurrentStep(0);
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [...prev, "Enter element to insert:"]);
              setCurrentStep(1);
              break;
            case 2:
              if (cqFront === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "Queue Underflow!",
                  "\n1: Insert, 2: Delete, 3: Display, 4: Exit",
                ]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted: ${cqElements[cqFront]}`,
                  "\n1: Insert, 2: Delete, 3: Display, 4: Exit",
                ]);
                if (cqFront === cqRear) {
                  setCqFront(-1);
                  setCqRear(-1);
                } else setCqFront((cqFront + 1) % cqSize);
              }
              break;
            case 3:
              if (cqFront === -1)
                setProgramOutput((prev) => [
                  ...prev,
                  "Queue Empty.",
                  "\n1: Insert, 2: Delete, 3: Display, 4: Exit",
                ]);
              else {
                let ci = cqFront;
                let cRes = "Queue: ";
                while (true) {
                  cRes += cqElements[ci] + " ";
                  if (ci === cqRear) break;
                  ci = (ci + 1) % cqSize;
                }
                setProgramOutput((prev) => [
                  ...prev,
                  cRes,
                  "\n1: Insert, 2: Delete, 3: Display, 4: Exit",
                ]);
              }
              break;
            case 4:
              setProgramOutput((prev) => [...prev, "Exited simulation."]);
              break;
          }
        }
        break;

      case "program7": {
        if (currentStep > 0) {
          const fIdx = (currentStep - 1) % 5;
          const sIdx = Math.floor((currentStep - 1) / 5);
          const newS = [...students];
          if (!newS[sIdx])
            newS[sIdx] = { usn: "", name: "", branch: "", sem: 0, phone: "" };
          const sFields = ["USN", "Name", "Branch", "Sem", "Phone"];
          const f = sFields[fIdx].toLowerCase() as keyof Student;
          if (f === "sem") newS[sIdx].sem = parseInt(userInput);
          else newS[sIdx][f] = userInput;
          setStudents(newS);

          if (fIdx === 4) {
            if (subMode) {
              setProgramOutput((prev) => [
                ...prev,
                "Pushed to stack.",
                "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
              ]);
              setCurrentStep(0);
              setSubMode(false);
            } else if (sIdx === numVertices - 1) {
              setProgramOutput((prev) => [
                ...prev,
                "SLL Created.",
                "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
              ]);
              setCurrentStep(0);
            } else {
              setProgramOutput((prev) => [
                ...prev,
                `\nEnter details for Student ${sIdx + 2}:`,
                "Enter USN:",
              ]);
              setCurrentStep(currentStep + 1);
            }
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `Enter ${sFields[fIdx + 1]}:`,
            ]);
            setCurrentStep(currentStep + 1);
          }
        } else if (currentStep === -10) {
          const n = parseInt(userInput);
          if (!isNaN(n) && n > 0) {
            setNumVertices(n);
            setProgramOutput((prev) => [
              ...prev,
              `Creating SLL for ${n} students.`,
              "\nEnter details for Student 1:",
              "Enter USN:",
            ]);
            setCurrentStep(1);
          } else
            setProgramOutput((prev) => [
              ...prev,
              "Invalid number. Enter students:",
            ]);
        } else {
          switch (choice) {
            case 1:
              setProgramOutput((prev) => [
                ...prev,
                "Enter number of students:",
              ]);
              setCurrentStep(-10);
              break;
            case 2:
              if (students.length === 0)
                setProgramOutput((prev) => [
                  ...prev,
                  "SLL Empty.",
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
                ]);
              else {
                let sRes = "SLL Contents:\n";
                students.forEach(
                  (s, i) =>
                    (sRes += `|${i + 1}| USN: ${s.usn} | Name: ${s.name} | Branch: ${s.branch} | Sem: ${s.sem} | Ph: ${s.phone}\n`),
                );
                setProgramOutput((prev) => [
                  ...prev,
                  sRes,
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
                ]);
              }
              break;
            case 3:
              setProgramOutput((prev) => [...prev, "Insert End - Enter USN:"]);
              setNumVertices(students.length + 1);
              setCurrentStep(students.length * 5 + 1);
              break;
            case 4:
              if (students.length === 0)
                setProgramOutput((prev) => [
                  ...prev,
                  "SLL Empty.",
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
                ]);
              else {
                const popped = students[students.length - 1];
                setStudents(students.slice(0, -1));
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted: ${popped.usn}`,
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
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
              setProgramOutput((prev) => [...prev, "Exited simulation."]);
              break;
          }
          if (subMode && choice !== 1) {
            // Choice 1 in submode handled by currentStep > 0
            if (choice === 2) {
              if (students.length === 0)
                setProgramOutput((prev) => [
                  ...prev,
                  "Stack Underflow.",
                  "\n1: Push, 2: Pop, 3: Display, 4: Exit",
                ]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  `Popped: ${students[0].usn}`,
                  "\n1: Push, 2: Pop, 3: Display, 4: Exit",
                ]);
                setStudents(students.slice(1));
              }
            } else if (choice === 3) {
              if (students.length === 0)
                setProgramOutput((prev) => [
                  ...prev,
                  "Stack Empty.",
                  "\n1: Push, 2: Pop, 3: Display, 4: Exit",
                ]);
              else {
                let stRes = "Stack (Top to Bottom):\n";
                students.forEach((s) => (stRes += `| USN: ${s.usn} |\n`));
                setProgramOutput((prev) => [
                  ...prev,
                  stRes,
                  "\n1: Push, 2: Pop, 3: Display, 4: Exit",
                ]);
              }
            } else if (choice === 4) {
              setSubMode(false);
              setProgramOutput((prev) => [
                ...prev,
                "Exited Stack Demo.",
                "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
              ]);
            }
          }
        }
        break;
      }

      case "program8": {
        if (currentStep > 0) {
          const fIdx8 = (currentStep - 1) % 6;
          const eIdx = Math.floor((currentStep - 1) / 6);
          const newE = [...employees];
          if (!newE[eIdx])
            newE[eIdx] = {
              ssn: "",
              name: "",
              dept: "",
              designation: "",
              sal: 0,
              phone: "",
            };
          const eFields = [
            "SSN",
            "Name",
            "Dept",
            "Designation",
            "Sal",
            "Phone",
          ];
          const f8 = eFields[fIdx8].toLowerCase() as keyof Employee;
          if (f8 === "sal") newE[eIdx].sal = parseInt(userInput);
          else newE[eIdx][f8] = userInput;
          setEmployees(newE);

          if (fIdx8 === 5) {
            if (subMode) {
              setProgramOutput((prev) => [
                ...prev,
                "Operation complete.",
                "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
              ]);
              setCurrentStep(0);
              setSubMode(false);
            } else if (eIdx === numVertices - 1) {
              setProgramOutput((prev) => [
                ...prev,
                "DLL Created.",
                "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
              ]);
              setCurrentStep(0);
            } else {
              setProgramOutput((prev) => [
                ...prev,
                `\nEnter details for Employee ${eIdx + 2}:`,
                "Enter SSN:",
              ]);
              setCurrentStep(currentStep + 1);
            }
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `Enter ${eFields[fIdx8 + 1]}:`,
            ]);
            setCurrentStep(currentStep + 1);
          }
        } else if (currentStep === -10) {
          const n8 = parseInt(userInput);
          if (!isNaN(n8) && n8 > 0) {
            setNumVertices(n8);
            setProgramOutput((prev) => [
              ...prev,
              `Creating DLL for ${n8} employees.`,
              "\nEnter details for Employee 1:",
              "Enter SSN:",
            ]);
            setCurrentStep(1);
          } else
            setProgramOutput((prev) => [
              ...prev,
              "Invalid number. Enter count:",
            ]);
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
                setProgramOutput((prev) => [
                  ...prev,
                  "DLL Empty.",
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
                ]);
              else {
                let eRes = "DLL Contents:\n";
                employees.forEach(
                  (e, i) =>
                    (eRes += `|${i + 1}| SSN: ${e.ssn} | Name: ${e.name} | Dept: ${e.dept} | Sal: ${e.sal} | Ph: ${e.phone}\n`),
                );
                setProgramOutput((prev) => [
                  ...prev,
                  eRes,
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
                ]);
              }
              break;
            case 3:
              setProgramOutput((prev) => [...prev, "Insert End - Enter SSN:"]);
              setNumVertices(employees.length + 1);
              setCurrentStep(employees.length * 6 + 1);
              break;
            case 4:
              if (employees.length === 0)
                setProgramOutput((prev) => [
                  ...prev,
                  "DLL Empty.",
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
                ]);
              else {
                const p = employees[employees.length - 1];
                setEmployees(employees.slice(0, -1));
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted: ${p.ssn}`,
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
                ]);
              }
              break;
            case 5:
              setProgramOutput((prev) => [
                ...prev,
                "Insert Front - Enter SSN:",
              ]);
              setSubMode(true);
              setNumVertices(employees.length + 1);
              setCurrentStep(employees.length * 6 + 1);
              break;
            case 6:
              if (employees.length === 0)
                setProgramOutput((prev) => [
                  ...prev,
                  "DLL Empty.",
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
                ]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  `Deleted: ${employees[0].ssn}`,
                  "\n1: Create, 2: Display, 3: Insert End, 4: Delete End, 5: Insert Front, 6: Delete Front, 7: DEQ Demo, 8: Exit",
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
            case 8:
              setProgramOutput((prev) => [...prev, "Exited simulation."]);
              break;
          }
        }
        break;
      }

      case "program9": {
        if (currentStep > 0) {
          const fIdx9 = (currentStep - 1) % 4;
          const tIdx = Math.floor((currentStep - 1) / 4);
          const tPoly = subMode ? poly2 : poly1;
          const nP = [...tPoly];
          if (!nP[tIdx]) nP[tIdx] = { coef: 0, xexp: 0, yexp: 0, zexp: 0 };
          const val9 = parseInt(userInput);
          if (fIdx9 === 0) nP[tIdx].coef = val9;
          else if (fIdx9 === 1) nP[tIdx].xexp = val9;
          else if (fIdx9 === 2) nP[tIdx].yexp = val9;
          else if (fIdx9 === 3) nP[tIdx].zexp = val9;

          if (fIdx9 === 3) {
            if (tIdx === numVertices - 1) {
              if (subMode) {
                const sumPoly = [...poly1, ...poly2];
                setProgramOutput((prev) => [
                  ...prev,
                  "Sum: " +
                    sumPoly
                      .map((t) => `${t.coef}x^${t.xexp}y^${t.yexp}z^${t.zexp}`)
                      .join(" + "),
                  "\n1: Evaluate, 2: Addition",
                ]);
                setCurrentStep(0);
                setSubMode(false);
              } else {
                setProgramOutput((prev) => [
                  ...prev,
                  "Polynomial entry complete.",
                  "Enter x, y, z for evaluation (comma separated):",
                ]);
                setCurrentStep(-5);
              }
            } else {
              setProgramOutput((prev) => [
                ...prev,
                `\nEnter term ${tIdx + 2}:`,
                "Coef:",
              ]);
              setCurrentStep(currentStep + 1);
            }
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `${["Xexp", "Yexp", "Zexp"][fIdx9 + 1]}:`,
            ]);
            setCurrentStep(currentStep + 1);
          }
          if (subMode) setPoly2(nP);
          else setPoly1(nP);
        } else if (currentStep === -10) {
          const n9 = parseInt(userInput);
          if (!isNaN(n9) && n9 > 0) {
            setNumVertices(n9);
            setProgramOutput((prev) => [...prev, `Enter Term 1:`, "Coef:"]);
            setCurrentStep(1);
          } else
            setProgramOutput((prev) => [
              ...prev,
              "Invalid number. Enter terms:",
            ]);
        } else if (currentStep === -5) {
          const vals = userInput.split(",").map((v) => parseInt(v.trim()));
          if (vals.length === 3) {
            const [x, y, z] = vals;
            let sumEval = 0;
            poly1.forEach(
              (p) =>
                (sumEval +=
                  p.coef *
                  Math.pow(x, p.xexp) *
                  Math.pow(y, p.yexp) *
                  Math.pow(z, p.zexp)),
            );
            setProgramOutput((prev) => [
              ...prev,
              `Evaluation Result: ${sumEval}`,
              "\n1: Evaluate, 2: Addition",
            ]);
            setCurrentStep(0);
          } else
            setProgramOutput((prev) => [...prev, "Enter x, y, z (3 values):"]);
        } else {
          if (choice === 1) {
            setProgramOutput((prev) => [
              ...prev,
              "--- Evaluation ---",
              "Enter number of terms:",
            ]);
            setCurrentStep(-10);
            setSubMode(false);
          } else if (choice === 2) {
            setProgramOutput((prev) => [
              ...prev,
              "--- Addition ---",
              "Enter number of terms for Poly 2 (Poly 1 already set or needs entry):",
            ]);
            setCurrentStep(-10);
            setSubMode(true);
          }
        }
        break;
      }

      case "program10": {
        if (currentStep === 1) {
          const v10 = parseInt(userInput);
          if (!isNaN(v10)) {
            const nR10 = insertBST(bstRoot ? { ...bstRoot } : null, v10);
            setBstRoot(nR10);
            if (numVertices === 1) {
              setProgramOutput((prev) => [
                ...prev,
                `Inserted ${v10}. BST Created.`,
                "\n1: Insert, 2: Search, 3: Traversal, 4: Exit",
              ]);
              setCurrentStep(0);
            } else {
              setNumVertices((v) => v - 1);
              setProgramOutput((prev) => [
                ...prev,
                `Inserted ${v10}. Enter next value:`,
              ]);
            }
          }
        } else if (currentStep === 2) {
          const key10 = parseInt(userInput);
          const found10 = searchBST(bstRoot, key10);
          setProgramOutput((prev) => [
            ...prev,
            `Search for ${key10}: ${found10 ? "FOUND" : "NOT FOUND"}`,
            "\n1: Insert, 2: Search, 3: Traversal, 4: Exit",
          ]);
          setCurrentStep(0);
        } else if (currentStep === -10) {
          const n10 = parseInt(userInput);
          if (!isNaN(n10) && n10 > 0) {
            setNumVertices(n10);
            setProgramOutput((prev) => [
              ...prev,
              `Enter first value to insert:`,
            ]);
            setCurrentStep(1);
          } else
            setProgramOutput((prev) => [
              ...prev,
              "Invalid number. Enter count:",
            ]);
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
              if (!bstRoot)
                setProgramOutput((prev) => [
                  ...prev,
                  "BST Empty.",
                  "\n1: Insert, 2: Search, 3: Traversal, 4: Exit",
                ]);
              else {
                setProgramOutput((prev) => [...prev, "Enter key to search:"]);
                setCurrentStep(2);
              }
              break;
            case 3:
              if (!bstRoot)
                setProgramOutput((prev) => [
                  ...prev,
                  "BST Empty.",
                  "\n1: Insert, 2: Search, 3: Traversal, 4: Exit",
                ]);
              else {
                setProgramOutput((prev) => [
                  ...prev,
                  "Inorder: " + inorder(bstRoot).join(" "),
                  "Preorder: " + preorder(bstRoot).join(" "),
                  "Postorder: " + postorder(bstRoot).join(" "),
                  "\n1: Insert, 2: Search, 3: Traversal, 4: Exit",
                ]);
              }
              break;
            case 4:
              setProgramOutput((prev) => [...prev, "Exited simulation."]);
              break;
          }
        }
        break;
      }

      case "program11": {
        if (currentStep === -1) {
          const row11 = userInput.split(" ").map((v) => parseInt(v.trim()));
          const nM11 = [...adjMatrix, row11];
          setAdjMatrix(nM11);
          if (nM11.length === numVertices) {
            setProgramOutput((prev) => [
              ...prev,
              "Matrix complete.",
              "Enter starting vertex (1 to N):",
            ]);
            setCurrentStep(-2);
          } else {
            setProgramOutput((prev) => [
              ...prev,
              `Enter row ${nM11.length + 1}:`,
            ]);
          }
        } else if (currentStep === -2) {
          const s11 = parseInt(userInput) - 1;
          setNumDays(s11); // store start in numDays
          setProgramOutput((prev) => [
            ...prev,
            `Start: ${s11 + 1}`,
            "\n1: BFS, 2: DFS",
          ]);
          setCurrentStep(0);
        } else if (currentStep === -10) {
          const n11 = parseInt(userInput);
          if (!isNaN(n11) && n11 > 0) {
            setNumVertices(n11);
            setAdjMatrix([]);
            setProgramOutput((prev) => [
              ...prev,
              `Matrix size ${n11}x${n11}.`,
              "Enter row 1 (space separated):",
            ]);
            setCurrentStep(-1);
          } else
            setProgramOutput((prev) => [
              ...prev,
              "Invalid count. Enter vertices:",
            ]);
        } else if (currentStep === 0 && (choice === 1 || choice === 2)) {
          const visited = new Array(numVertices).fill(0);
          const resPath: number[] = [];
          const stV = numDays;
          if (choice === 1) {
            // BFS
            const q11 = [stV];
            visited[stV] = 1;
            while (q11.length) {
              const u = q11.shift()!;
              resPath.push(u + 1);
              for (let v = 0; v < numVertices; v++)
                if (adjMatrix[u][v] && !visited[v]) {
                  visited[v] = 1;
                  q11.push(v);
                }
            }
            setProgramOutput((prev) => [
              ...prev,
              "BFS Path: " + resPath.join(" "),
              "\n1: BFS, 2: DFS",
            ]);
          } else {
            // DFS
            const dfs = (u: number) => {
              visited[u] = 1;
              resPath.push(u + 1);
              for (let v = 0; v < numVertices; v++)
                if (adjMatrix[u][v] && !visited[v]) dfs(v);
            };
            dfs(stV);
            setProgramOutput((prev) => [
              ...prev,
              "DFS Path: " + resPath.join(" "),
              "\n1: BFS, 2: DFS",
            ]);
          }
        } else {
          setProgramOutput((prev) => [...prev, "Enter number of vertices:"]);
          setCurrentStep(-10);
        }
        break;
      }

      case "program12": {
        const k12 = parseInt(userInput);
        if (!isNaN(k12)) {
          let idx12 = k12 % 10;
          const nT12 = [...hashTable];
          const st12 = idx12;
          while (nT12[idx12] !== null) {
            idx12 = (idx12 + 1) % 10;
            if (idx12 === st12) {
              setProgramOutput((prev) => [
                ...prev,
                "Table Full (Overflow)!",
                "Enter key to insert (or reset):",
              ]);
              return;
            }
          }
          nT12[idx12] = k12;
          setHashTable(nT12);
          setProgramOutput((prev) => [
            ...prev,
            `Mapped ${k12} to index ${idx12}.`,
            "Table: " + JSON.stringify(nT12),
            "\nEnter next key (or reset):",
          ]);
        } else
          setProgramOutput((prev) => [...prev, "Invalid key. Enter number:"]);
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
