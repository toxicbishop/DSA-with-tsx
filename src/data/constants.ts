export const NOTES = [
  { name: "Module 1", file: "BCS304-module-1.pdf" },
  { name: "Module 2", file: "BCS304-module-2.pdf" },
  { name: "Module 3", file: "BCS304-module-3.pdf" },
  { name: "Module 4", file: "BCS304-module-4.pdf" },
  { name: "Module 5", file: "BCS304-module-5.pdf" },
];

export const PROGRAMS = [
  { name: "Program 1" },
  { name: "Program 2" },
  { name: "Program 3" },
  { name: "Program 4" },
  { name: "Program 5A" },
  { name: "Program 5B" },
  { name: "Program 6" },
  { name: "Program 7" },
  { name: "Program 8" },
  { name: "Program 9" },
  { name: "Program 10" },
  { name: "Program 11" },
  { name: "Program 12" },
];

export const PROGRAM_MENUS: Record<string, string[]> = {
  program1: [
    "--- Program 1: Calendar Management ---",
    "Enter the number of days in the week:",
  ],
  program3: [
    "--- Program 3: Stack Operations ---",
    "1: Push, 2: Pop, 3: Palindrome, 4: Display, 5: Exit",
  ],
  program6: [
    "--- Program 6: Circular Queue ---",
    "1: Insert, 2: Delete, 3: Display, 4: Exit",
  ],
  program7: [
    "--- Program 7: SLL Operations ---",
    "1: Create SLL, 2: Display, 3: Insert End, 4: Delete End, 5: Stack Demo, 6: Exit",
  ],
  program8: [
    "--- Program 8: DLL Operations ---",
    "1: Create DLL, 2: Display, 3: Insert End, 4: Delete End, 7: DEQ Demo, 8: Exit",
  ],
  program9: [
    "--- Program 9: Polynomial Operations ---",
    "1: Evaluate P(x,y,z), 2: Sum POLY1 + POLY2, 3: Exit",
  ],
  program10: [
    "--- Program 10: BST Operations ---",
    "1: Create BST, 2: Search, 3: Traversals, 4: Exit",
  ],
  program11: [
    "--- Program 11: Graph Operations ---",
    "Enter the number of nodes in the graph:",
  ],
  program12: [
    "--- Program 12: Hashing ---",
    "Enter a key to hash (index = key % 10):",
  ],
};
