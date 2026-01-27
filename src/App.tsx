import { useState, useEffect, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Moon,
  Sun,
  ChevronDown,
  Code2,
  Home,
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Copy,
  Check,
  Menu,
  X,
  BookOpen,
  ArrowRight,
  Map,
  Eye,
  Bug,
  Server,
  BarChart3,
  Network,
  Search,
  Trophy,
  Zap,
  Clock,
  Terminal,
  Package,
  Github,
  Linkedin,
} from "lucide-react";
import PathfindingVisualizer from "./components/PathfindingVisualizer";
import SortingVisualizer from "./components/SortingVisualizer";
import TreeGraphVisualizer from "./components/TreeGraphVisualizer";
import ReportIssue from "./components/ReportIssue";
import { SystemDesign } from "./components/SystemDesign";
import Loader from "./components/Loader";
import KnapsackVisualizer from "./components/KnapsackVisualizer";

// --- DATA: C Source Code for All Programs ---
import { C_CODE, CPP_CODE, PYTHON_CODE, JAVA_CODE } from "./data/programs";

// --- Helper Component for Copy Button ---
const CodeBlock = ({
  code,
  darkMode,
  language = "c",
}: {
  code: string;
  darkMode: boolean;
  language?: string;
}) => {
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
          title="Copy code">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={darkMode ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          backgroundColor: darkMode ? "#1f2937" : "#f9fafb",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}
        showLineNumbers={true}
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: darkMode ? "#6b7280" : "#9ca3af",
          textAlign: "right",
        }}
        wrapLines={true}
        wrapLongLines={true}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    if (typeof window === "undefined") return "home";
    const path = window.location.pathname.substring(1); // Remove leading '/'
    return path || "home";
  });

  const [selectedLanguage, setSelectedLanguage] = useState("c");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedPrograms, setCompletedPrograms] = useState<string[]>(() => {
    const saved = localStorage.getItem("completedPrograms");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleProgramComplete = (id: string) => {
    const newCompleted = completedPrograms.includes(id)
      ? completedPrograms.filter((p) => p !== id)
      : [...completedPrograms, id];
    setCompletedPrograms(newCompleted);
    localStorage.setItem("completedPrograms", JSON.stringify(newCompleted));
  };

  const [isLoading, setIsLoading] = useState(true);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // --- RESET ---
  const resetProgramState = () => {
    setIsProgramsOpen(false);
  };

  // --- NAVIGATION HELPER ---
  const navigateTo = (view: string) => {
    window.history.pushState(null, "", "/" + view);
    setActiveView(view);
    window.scrollTo(0, 0);
    resetProgramState();
    setIsMobileMenuOpen(false);
  };

  const handleProgramClick = (pid: string) => {
    const view = pid.toLowerCase().replace(/\s/g, "");
    navigateTo(view);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const s = () => setIsNavbarScrolled(window.scrollY > 20);
    window.addEventListener("scroll", s);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleThemeChange);

    // --- Browser History (Back/Forward) Support ---
    const handlePopState = () => {
      const path = window.location.pathname.substring(1) || "home";
      setActiveView(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("scroll", s);
      mediaQuery.removeEventListener("change", handleThemeChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const programsData = [
    {
      id: "program1",
      name: "Program 1",
      category: "Basic",
      difficulty: "Easy",
      time: "O(1)",
      space: "O(1)",
    },
    {
      id: "program2",
      name: "Program 2",
      category: "Strings",
      difficulty: "Easy",
      time: "O(N)",
      space: "O(N)",
    },
    {
      id: "program3",
      name: "Program 3",
      category: "Stack",
      difficulty: "Easy",
      time: "O(N)",
      space: "O(N)",
    },
    {
      id: "program4",
      name: "Program 4",
      category: "Queue",
      difficulty: "Easy",
      time: "O(N)",
      space: "O(N)",
    },
    {
      id: "program5a",
      name: "Program 5A",
      category: "Recursion",
      difficulty: "Medium",
      time: "O(N)",
      space: "O(N)",
    },
    {
      id: "program5b",
      name: "Program 5B",
      category: "Recursion",
      difficulty: "Medium",
      time: "O(2^N)",
      space: "O(N)",
    },
    {
      id: "program6",
      name: "Program 6",
      category: "Circular Queue",
      difficulty: "Medium",
      time: "O(1)",
      space: "O(N)",
    },
    {
      id: "program7",
      name: "Program 7",
      category: "Linked List",
      difficulty: "Medium",
      time: "O(N)",
      space: "O(N)",
    },
    {
      id: "program8",
      name: "Program 8",
      category: "Linked List",
      difficulty: "Medium",
      time: "O(N)",
      space: "O(N)",
    },
    {
      id: "program9",
      name: "Program 9",
      category: "Polynomial",
      difficulty: "Hard",
      time: "O(N*M)",
      space: "O(N+M)",
    },
    {
      id: "program10",
      name: "Program 10",
      category: "BST",
      difficulty: "Hard",
      time: "O(H)",
      space: "O(H)",
    },
    {
      id: "program11",
      name: "Program 11",
      category: "Graphs",
      difficulty: "Hard",
      time: "O(V+E)",
      space: "O(V)",
    },
    {
      id: "program12",
      name: "Program 12",
      category: "Hashing",
      difficulty: "Medium",
      time: "O(1) avg",
      space: "O(M)",
    },
  ];

  const notes = [
    { name: "Module 1", href: "/notes/BCS304-module-1.pdf" },
    { name: "Module 2", href: "/notes/BCS304-module-2.pdf" },
    { name: "Module 3", href: "/notes/BCS304-module-3.pdf" },
    { name: "Module 4", href: "/notes/BCS304-module-4.pdf" },
    { name: "Module 5", href: "/notes/BCS304-module-5.pdf" },
  ];

  const allSearchableItems = useMemo(() => {
    const items = [
      // Programs
      ...programsData.map((p) => ({
        id: p.id,
        type: "program",
        title: p.name,
        subtitle: `${p.category} • ${p.difficulty}`,
        content: [
          p.name,
          p.category,
          p.difficulty,
          C_CODE[p.id as keyof typeof C_CODE] || "",
          CPP_CODE[p.id as keyof typeof CPP_CODE] || "",
          JAVA_CODE[p.id as keyof typeof JAVA_CODE] || "",
          PYTHON_CODE[p.id as keyof typeof PYTHON_CODE] || "",
        ]
          .join(" ")
          .toLowerCase(),
        action: () => handleProgramClick(p.name),
        icon: Code2,
      })),
      // Visualizers
      {
        id: "knapsack",
        type: "visualizer",
        title: "Knapsack Visualizer",
        subtitle: "Dynamic Programming Visualization",
        content: "knapsack dynamic programming visualizer dp",
        action: () => navigateTo("knapsack"),
        icon: Package,
      },
      {
        id: "pathfinder",
        type: "visualizer",
        title: "Pathfinding Visualizer",
        subtitle: "BFS, DFS, Dijkstra",
        content: "pathfinder pathfinding bfs dfs dijkstra graph visualizer",
        action: () => navigateTo("visualizer"),
        icon: Map,
      },
      {
        id: "sorting",
        type: "visualizer",
        title: "Sorting Visualizer",
        subtitle: "Bubble, Merge, Quick Sort",
        content:
          "sorting visualizer sort bubble merge quick heap insertion selection",
        action: () => navigateTo("sorting"),
        icon: BarChart3,
      },
      {
        id: "tree-graph",
        type: "visualizer",
        title: "Tree & Graph Visualizer",
        subtitle: "Tree Traversals and Graph Algorithms",
        content:
          "tree graph visualizer traversal inorder preorder postorder bfs dfs",
        action: () => navigateTo("tree-graph"),
        icon: Network,
      },
      {
        id: "system-design",
        type: "visualizer",
        title: "System Design",
        subtitle: "Architecture and Design Patterns",
        content: "system design architecture patterns",
        action: () => navigateTo("system-design"),
        icon: Server,
      },
      // Notes
      ...notes.map((n) => ({
        id: n.name,
        type: "note",
        title: n.name,
        subtitle: "PDF Note",
        content: n.name.toLowerCase(),
        action: () => window.open(n.href, "_blank"),
        icon: BookOpen,
      })),
      // Pages
      {
        id: "about",
        type: "page",
        title: "About Me",
        subtitle: "Profile and Bio",
        content: "about me profile bio contact pranav arun",
        action: () => navigateTo("about"),
        icon: User,
      },
      {
        id: "home",
        type: "page",
        title: "Home",
        subtitle: "Main Page",
        content: "home start learning welcome",
        action: () => navigateTo("home"),
        icon: Home,
      },
    ];
    return items;
  }, [programsData, notes]);

  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return allSearchableItems.filter((item) =>
        ["program1", "program10", "knapsack", "about"].includes(item.id),
      );
    }
    return allSearchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, allSearchableItems]);

  if (isLoading) return <Loader />;

  return (
    <div
      className={`min-h-screen relative z-0 transition-colors duration-300 ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Search Modal Removed - Replaced with Dropdown below */}
      <div
        className={`absolute inset-0 -z-10 bg-[size:30px_30px] ${darkMode ? "bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)]"}`}></div>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${isNavbarScrolled ? "bg-white/10 backdrop-blur-lg shadow-lg" : "bg-transparent"}`}>
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center h-16 px-4">
            {/* Left: Logo */}
            <div className="flex-1 flex justify-start items-center">
              <h1
                className="text-xl lg:text-2xl font-bold tracking-tight whitespace-nowrap cursor-pointer text-gray-900 dark:text-white"
                onClick={() => {
                  resetProgramState();
                  window.location.hash = "home";
                }}>
                DSA Study <span className="text-orange-500">Hub</span>
              </h1>
            </div>

            {/* Center: Tabs Container */}
            <div className="hidden md:flex flex-shrink-0 items-center justify-center space-x-2 lg:space-x-4">
              <button
                onClick={() => navigateTo("home")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                <Home size={18} />
                <span>Home</span>
              </button>
              <div className="relative programs-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProgramsOpen(!isProgramsOpen);
                    if (!isProgramsOpen) setIsNotesOpen(false);
                  }}
                  className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                  <Code2 size={18} />
                  <span>Programs</span>
                  <ChevronDown size={14} />
                </button>
                {isProgramsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 border border-white/20 h-64 overflow-y-auto z-50">
                    {programsData.map((program) => (
                      <a
                        key={program.id}
                        href={`/${program.id}`}
                        className="flex items-center justify-between px-4 py-2 hover:bg-orange-500/10"
                        onClick={(e) => {
                          e.preventDefault();
                          handleProgramClick(program.name);
                        }}>
                        <span>{program.name}</span>
                        {completedPrograms.includes(program.id) && (
                          <Check size={14} className="text-green-500" />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative notes-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotesOpen(!isNotesOpen);
                    if (!isNotesOpen) setIsProgramsOpen(false);
                  }}
                  className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                  <BookOpen size={18} />
                  <span>Notes</span>
                  <ChevronDown size={14} />
                </button>
                {isNotesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 border border-white/20">
                    {notes.map((note) => (
                      <a
                        key={note.name}
                        href={note.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 hover:bg-orange-500/10">
                        {note.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo("knapsack")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                <Package size={18} />
                <span>Knapsack</span>
              </button>
              <button
                onClick={() => navigateTo("visualizer")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                <Map size={18} />
                <span>Pathfinder</span>
              </button>
              <button
                onClick={() => navigateTo("sorting")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                <BarChart3 size={18} />
                <span>Sorter</span>
              </button>
              <button
                onClick={() => navigateTo("tree-graph")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                <Network size={18} />
                <span>Trees</span>
              </button>
              <button
                onClick={() => navigateTo("system-design")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                <Server size={18} />
                <span>Design</span>
              </button>

              <button
                onClick={() => navigateTo("about")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors">
                <User size={18} />
                <span>About Me</span>
              </button>
              <button
                onClick={() => navigateTo("report")}
                className="flex items-center space-x-1 hover:text-orange-500 transition-colors"
                title="Report Issue">
                <Bug size={18} />
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex items-center justify-end space-x-2">
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-full hover:bg-orange-500/10 transition-colors text-gray-700 dark:text-gray-200"
                  title="Search">
                  <Search size={22} />
                </button>

                {isSearchOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSearchOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[350px] md:w-[450px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col max-h-[70vh]">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <Search className="text-gray-400" size={18} />
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search..."
                          className="flex-1 bg-transparent border-none outline-none text-base text-gray-800 dark:text-gray-100"
                          value={searchQuery}
                          maxLength={60}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 60) {
                              const sanitized = value.replace(
                                /[<>;'"\\`]/g,
                                "",
                              );
                              setSearchQuery(sanitized);
                            }
                          }}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <div className="overflow-y-auto p-2">
                        {!searchQuery && (
                          <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Suggestions
                          </div>
                        )}
                        {searchResults.length > 0 ? (
                          searchResults.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                item.action();
                                setIsSearchOpen(false);
                              }}
                              className="w-full flex items-center justify-between p-3 hover:bg-orange-500/10 rounded-xl transition-colors group text-left">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                  <item.icon size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                    {item.title}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {item.subtitle}
                                  </div>
                                </div>
                              </div>
                              {item.type === "program" &&
                                completedPrograms.includes(item.id) && (
                                  <Check size={14} className="text-green-500" />
                                )}
                            </button>
                          ))
                        ) : (
                          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            No results found
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={toggleTheme}
                className="hidden md:flex p-2 rounded-full hover:bg-orange-500/10 text-gray-700 dark:text-gray-200">
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button>

              {/* Mobile Menu Button - shows on right */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-700 dark:text-gray-200 hover:text-orange-500 transition-colors">
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl absolute top-16 left-0 w-full p-4 flex flex-col space-y-4 border-b border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => navigateTo("home")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <Home size={20} />
              <span>Home</span>
            </button>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded-lg w-full">
                <div className="flex items-center space-x-2">
                  <Code2 size={20} />
                  <span>Programs</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isProgramsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isProgramsOpen && (
                <div className="pl-8 flex flex-col space-y-2">
                  {programsData.map((program) => (
                    <a
                      key={program.id}
                      href={`#${program.id}`}
                      className="flex items-center justify-between py-1 text-sm opacity-80 hover:text-orange-500"
                      onClick={(e) => {
                        e.preventDefault();
                        handleProgramClick(program.name);
                        setIsMobileMenuOpen(false);
                      }}>
                      <span>{program.name}</span>
                      {completedPrograms.includes(program.id) && (
                        <Check size={14} className="text-green-500" />
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded-lg w-full">
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span>Notes</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isNotesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isNotesOpen && (
                <div className="pl-8 flex flex-col space-y-2">
                  {notes.map((note) => (
                    <a
                      key={note.name}
                      href={note.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-1 text-sm opacity-80 hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      {note.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => navigateTo("knapsack")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <Package size={20} />
              <span>Knapsack Visualizer</span>
            </button>
            <button
              onClick={() => navigateTo("visualizer")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <Map size={20} />
              <span>Pathfinder</span>
            </button>
            <button
              onClick={() => navigateTo("sorting")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <BarChart3 size={20} />
              <span>Sorter</span>
            </button>
            <button
              onClick={() => navigateTo("tree-graph")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <Network size={20} />
              <span>Trees & Graphs</span>
            </button>
            <button
              onClick={() => navigateTo("system-design")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <Server size={20} />
              <span>System Design</span>
            </button>
            <button
              onClick={() => navigateTo("report")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <Bug size={20} />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => navigateTo("about")}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              <User size={20} />
              <span>About Me</span>
            </button>

            <button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>
                {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* VIEW: HOME */}
      {activeView === "home" && (
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 pb-2 text-gray-900 dark:text-white tracking-tight">
              Master Data Structures & Algorithms
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Comprehensive study materials and interactive visualizations to
              understand complex algorithms.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={() => navigateTo("program1")}
                className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                Start Learning <ArrowRight size={20} />
              </button>
              <button
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="px-8 py-4 bg-transparent border-2 border-slate-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-lg hover:border-orange-500 hover:text-orange-500 transition-all hover:-translate-y-1">
                Browse Notes
              </button>
            </div>
          </div>
        </section>
      )}

      {/* VIEW: HOME - CURATED LISTS */}
      {activeView === "home" && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-5xl font-bold mb-12 text-center text-gray-900 dark:text-white tracking-tight">
              Don't know where to start?{" "}
              <span className="text-orange-500">Try these curated lists.</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card A: Beginner's 50 */}
              <div className="group relative p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                    <Code2 size={24} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                    BEGINNER
                  </span>
                </div>

                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  The Beginner's 50
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Core concepts to build your foundation. Perfect for your first
                  month of preparation.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["Arrays", "Strings", "Loops", "Logic"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span>Your Progress</span>
                    <span>
                      {
                        completedPrograms.filter((id) =>
                          programsData.find(
                            (p) =>
                              p.id === id &&
                              p.id.startsWith("program") &&
                              !isNaN(parseInt(p.id.replace("program", ""))),
                          ),
                        ).length
                      }
                      /12 Solved
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000 ease-out"
                      style={{
                        width: `${(completedPrograms.filter((id) => programsData.find((p) => p.id === id && p.id.startsWith("program") && !isNaN(parseInt(p.id.replace("program", ""))))).length / 12) * 100}%`,
                      }}></div>
                  </div>
                </div>
              </div>

              {/* Card B: Interview 75 */}
              <div className="group relative p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>

                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full">
                    INTERMEDIATE
                  </span>
                </div>

                <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  The Interview 75
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  The most frequently asked questions by FAANG. High-yield
                  patterns only.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {["DP", "Graphs", "Trees", "Heaps", "Recursion"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600">
                        {tag}
                      </span>
                    ),
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                    <span>Your Progress</span>
                    <span>
                      {
                        completedPrograms.filter((id) =>
                          programsData.find(
                            (p) => p.id === id && p.category !== "Basic",
                          ),
                        ).length
                      }
                      /75 Solved
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.max(2, (completedPrograms.filter((id) => programsData.find((p) => p.id === id && p.category !== "Basic")).length / 75) * 100)}%`,
                      }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIEW: HOME - INTERACTIVE ROADMAP */}
      {activeView === "home" && (
        <section className="py-16 px-4 bg-gray-50/50 dark:bg-gray-900/20 backdrop-blur-sm border-y border-gray-100 dark:border-white/5">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
              <Map className="text-orange-500" size={32} />
              <span>
                Your <span className="text-orange-500">Learning Path</span>
              </span>
            </h3>

            <div className="relative">
              {/* Roadmap Path Line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-pink-500 to-orange-400 opacity-20 hidden sm:block"></div>

              <div className="space-y-12">
                {[
                  {
                    title: "The Basics",
                    desc: "Arrays, Objects, and Basic Logic",
                    icon: <Zap size={20} />,
                    programs: ["program1", "program2"],
                  },
                  {
                    title: "Linear Structures",
                    desc: "Stacks, Queues, and Circular variations",
                    icon: <BarChart3 size={20} />,
                    programs: ["program3", "program4", "program6"],
                  },
                  {
                    title: "Dynamic Logic",
                    desc: "Recursion and Mathematical mapping",
                    icon: <Network size={20} />,
                    programs: ["program5a", "program5b"],
                  },
                  {
                    title: "Linked Data",
                    desc: "Singly, Doubly, and Circular Linked Lists",
                    icon: <Eye size={20} />,
                    programs: ["program7", "program8", "program9"],
                  },
                  {
                    title: "Non-Linear Structures",
                    desc: "Binary Trees and Graph Algorithms",
                    icon: <Server size={20} />,
                    programs: ["program10", "program11"],
                  },
                  {
                    title: "Advanced Mapping",
                    desc: "Hashing and Hash Tables",
                    icon: <Trophy size={20} />,
                    programs: ["program12"],
                  },
                ].map((step, idx) => {
                  const isStepComplete = step.programs.every((p) =>
                    completedPrograms.includes(p),
                  );
                  const isStepPartial = step.programs.some((p) =>
                    completedPrograms.includes(p),
                  );

                  return (
                    <div key={idx} className="relative pl-0 sm:pl-12">
                      {/* Path Indicator */}
                      <div
                        className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 hidden sm:flex ${
                          isStepComplete
                            ? "bg-green-500 border-green-200 dark:border-green-900 text-white"
                            : isStepPartial
                              ? "bg-orange-500 border-orange-200 dark:border-orange-900 text-white animate-pulse"
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
                        }`}>
                        {isStepComplete ? <Check size={20} /> : step.icon}
                      </div>

                      <div
                        className={`p-6 rounded-2xl border transition-all duration-300 ${
                          isStepComplete
                            ? "bg-green-500/5 border-green-500/20"
                            : isStepPartial
                              ? "bg-orange-500/5 border-orange-500/20"
                              : "bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                        }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <h4 className="text-xl font-bold mb-1">
                              {step.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {step.desc}
                            </p>
                          </div>
                          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-bold text-gray-500">
                            {
                              step.programs.filter((p) =>
                                completedPrograms.includes(p),
                              ).length
                            }{" "}
                            / {step.programs.length} Completed
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {step.programs.map((pid) => {
                            const p = programsData.find(
                              (prog) => prog.id === pid,
                            );
                            return (
                              <button
                                key={pid}
                                onClick={() =>
                                  handleProgramClick(p ? p.name : pid)
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                  completedPrograms.includes(pid)
                                    ? "bg-green-500 text-white shadow-sm"
                                    : "bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700 hover:border-orange-500"
                                }`}>
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
      {activeView === "home" && (
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
              Browse by Topic
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Arrays & Hashing", link: "Program 12" },
                { title: "Two Pointers", link: "Program 2" },
                { title: "Sliding Window", link: "Program 2" },
                { title: "Stack & Queue", link: "Program 3" },
                { title: "Trees & Graphs", link: "Program 11" },
                { title: "Dynamic Programming", link: "Program 1" },
              ].map((topic) => (
                <button
                  key={topic.title}
                  onClick={() => handleProgramClick(topic.link)}
                  className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-orange-500 transition-all hover:-translate-y-1 text-left font-semibold text-gray-800 dark:text-gray-100 hover:bg-orange-50 dark:hover:bg-orange-900/10 focus:outline-none focus:ring-2 focus:ring-orange-400">
                  {topic.title}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIEW: HOME - FEATURES SECTION */}
      {activeView === "home" && (
        <section className="py-20 px-4 bg-gray-50/80 dark:bg-black/20 backdrop-blur-sm border-t border-gray-100 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Structured Learning */}
              <div className="p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400">
                  <Map size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Structured Learning
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Follow a curated path from Arrays to Dynamic Programming. No
                  more guessing what to learn next.
                </p>
              </div>

              {/* Card 2: Interview Prep */}
              <div className="p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
                  <Briefcase size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Company Archives
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Practice real questions asked by Google, Amazon, and Microsoft
                  in the last 6 months.
                </p>
              </div>

              {/* Card 3: Visualizations */}
              <div
                onClick={() => navigateTo("visualizer")}
                className="cursor-pointer p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                  <Eye size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Pathfinder
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Understand pathfinding algorithms like BFS, DFS, and Dijkstra
                  with interactive grid visualizations.
                </p>
              </div>

              {/* Card 4: Trees & Graphs */}
              <div
                onClick={() => navigateTo("tree-graph")}
                className="cursor-pointer p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <Network size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Trees & Graphs
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Visualize tree traversals (Inorder, Preorder, Postorder) and
                  graph algorithms in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIEW: ABOUT */}
      {activeView === "about" && (
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
            {/* Top Card: Profile & Bio */}
            <div className="bg-white dark:bg-gray-800/50 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row">
                {/* Left: Identity */}
                <div className="md:w-1/3 p-8 bg-white dark:bg-gray-800/20 flex flex-col items-center border-r border-gray-100 dark:border-white/5">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                      <img
                        src="/screenshots/profile.jpeg"
                        alt="Pranav Arun"
                        className="w-full h-full object-cover object-top transform transition-transform duration-700 group-hover:scale-110 shrink-0"
                      />
                    </div>
                  </div>

                  <h2 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white text-center">
                    Pranav Arun
                  </h2>
                  <p className="text-orange-500 font-semibold mt-1">
                    Full Stack Developer
                  </p>

                  {/* Social Buttons */}
                  <div className="flex gap-3 mt-8">
                    <a
                      href="https://github.com/toxicbishop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-md text-gray-700 dark:text-gray-200 hover:text-orange-500 transition-all hover:scale-110 hover:shadow-orange-500/20">
                      <Github size={20} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/pranav-arun/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-md text-gray-700 dark:text-gray-200 hover:text-blue-500 transition-all hover:scale-110 hover:shadow-blue-500/20">
                      <Linkedin size={20} />
                    </a>
                    <a
                      href="mailto:pranavarun19@gmail.com"
                      className="p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-md text-gray-700 dark:text-gray-200 hover:text-red-500 transition-all hover:scale-110 hover:shadow-red-500/20">
                      <Mail size={20} />
                    </a>
                  </div>
                </div>

                {/* Right: Biography & Info */}
                <div className="md:w-2/3 p-8 md:p-12 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="text-orange-500" /> About Me
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      Hello! I'm a passionate developer currently pursuing my
                      B.E. in Computer Science & Business Systems at{" "}
                      <strong className="text-gray-900 dark:text-white">
                        KSSEM (K.S. School of Engineering and Management)
                      </strong>
                      , Bengaluru.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      My journey in tech is driven by an insatiable curiosity
                      for how things work under the hood. I built{" "}
                      <strong className="text-gray-900 dark:text-white">
                        DSA Study Hub
                      </strong>{" "}
                      to bridge the gap between complex algorithms and intuitive
                      learning. Whether it's pathfinding visualizations or
                      dynamic programming breakdowns, I believe technology
                      should make learning accessible and engaging for everyone.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-orange-500/5 transition-colors border border-transparent hover:border-orange-500/20">
                      <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                          Degree
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          B.E in CS&BS
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-pink-500/5 transition-colors border border-transparent hover:border-pink-500/20">
                      <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl text-pink-600 dark:text-pink-400">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                          Location
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          Bengaluru, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Skills & Tech */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-white dark:bg-gray-800/50 shadow-xl border border-gray-100 dark:border-white/5 backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Code2 className="text-orange-500" /> Technical Arsenal
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { name: "C Language", level: "90%", color: "orange" },
                    { name: "React", level: "85%", color: "blue" },
                    { name: "TypeScript", level: "80%", color: "blue" },
                    { name: "Tailwind CSS", level: "95%", color: "cyan" },
                    { name: "Data Structures", level: "90%", color: "orange" },
                    { name: "Algorithms", level: "85%", color: "pink" },
                    { name: "Python", level: "75%", color: "yellow" },
                    { name: "Node.js", level: "70%", color: "green" },
                  ].map((skill) => (
                    <div
                      key={skill.name}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/50 text-center group hover:-translate-y-1 transition-all duration-300">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                        {skill.name}
                      </p>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-orange-500 transition-all duration-1000`}
                          style={{ width: skill.level }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white/5 dark:bg-white/5 shadow-xl text-gray-900 dark:text-white flex flex-col justify-between border border-gray-200 dark:border-gray-700 backdrop-blur-xl relative overflow-hidden group">
                <div className="relative">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trophy size={24} className="text-orange-500" /> Goals
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="mt-1 flex-shrink-0 text-orange-500"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Mastering Advanced Graph Traversal logic.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="mt-1 flex-shrink-0 text-pink-500"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Building more intuitive System Design breakdowns.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="mt-1 flex-shrink-0 text-orange-400"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Contributing to open-source educational tools.
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="relative w-full mt-6 py-5 px-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-2 shadow-xl shadow-orange-500/20 transform transition-transform hover:scale-[1.01]">
                  <span className="text-xs uppercase tracking-widest opacity-90">
                    Contact Me :
                  </span>
                  <div className="flex flex-wrap justify-center items-center gap-3 relative">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=pranavarun19@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-lg sm:text-xl hover:opacity-80 transition-opacity break-all">
                      <Mail size={22} className="flex-shrink-0" />
                      <span>pranavarun19@gmail.com</span>
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("pranavarun19@gmail.com");
                        setEmailCopied(true);
                        setTimeout(() => setEmailCopied(false), 2000);
                      }}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors relative"
                      title="Copy to clipboard">
                      {emailCopied ? <Check size={18} /> : <Copy size={18} />}
                      {emailCopied && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded shadow-lg animate-fade-in-up whitespace-nowrap">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIEW: PRIVACY */}
      {activeView === "privacy" && (
        <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-orange-500">
            Privacy Policy
          </h2>
          <div className="space-y-6">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>
              Welcome to DSA Study Hub. This Privacy Policy explains how we
              handle your information.
            </p>
            <h3 className="text-2xl font-semibold">
              1. Information We Collect
            </h3>
            <p>
              We do not collect any personal information. Your progress and
              preferences (like theme settings) are stored locally on your
              device.
            </p>
            <h3 className="text-2xl font-semibold">2. Third-Party Links</h3>
            <p>
              Our site contains links to other websites (like GitHub, LinkedIn).
              We are not responsible for the privacy practices of these sites.
            </p>
          </div>
        </section>
      )}

      {/* VIEW: TERMS */}
      {activeView === "terms" && (
        <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-orange-500">
            Terms of Service
          </h2>
          <div className="space-y-6">
            <p>By using DSA Study Hub, you agree to these terms.</p>
            <h3 className="text-2xl font-semibold">Usage</h3>
            <p>
              This content is for educational purposes. Code examples are
              provided "as is" without warranty of any kind.
            </p>
          </div>
        </section>
      )}

      {/* VIEW: COOKIES */}
      {activeView === "cookies" && (
        <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200">
          <h2 className="text-4xl font-bold mb-8 text-orange-500">
            Cookie Policy
          </h2>
          <div className="space-y-6">
            <p>
              We use local storage technology (not traditional cookies) to
              remember your theme preference (Dark/Light mode). No tracking or
              third-party cookies are used by us directly.
            </p>
          </div>
        </section>
      )}

      {/* VIEW: PROGRAMS */}
      {activeView.startsWith("program") && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto p-6 rounded-lg bg-white shadow-xl dark:bg-white/5">
            {/* General Render for ANY program including 1-12 */}
            <div className="space-y-6">
              {(() => {
                const program = programsData.find((p) => p.id === activeView);
                return (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-orange-500 font-bold mb-1">
                          <span className="px-2 py-0.5 bg-orange-500/10 rounded text-xs uppercase tracking-wider">
                            {program?.category || "General"}
                          </span>
                          <span>•</span>
                          <span
                            className={`text-xs uppercase tracking-wider ${
                              program?.difficulty === "Easy"
                                ? "text-green-500"
                                : program?.difficulty === "Medium"
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}>
                            {program?.difficulty || "Medium"}
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                          Program{" "}
                          {activeView.replace("program", "").toUpperCase()}
                        </h2>
                      </div>

                      <button
                        onClick={() => toggleProgramComplete(activeView)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                          completedPrograms.includes(activeView)
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-500/10 hover:text-green-500"
                        }`}>
                        {completedPrograms.includes(activeView) ? (
                          <>
                            <Trophy size={18} /> Completed
                          </>
                        ) : (
                          <>
                            <Zap size={18} /> Mark Complete
                          </>
                        )}
                      </button>
                    </div>

                    {/* Complexity Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight">
                          <Clock size={14} /> Time
                        </div>
                        <div className="font-mono text-orange-500">
                          {program?.time || "O(N)"}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight">
                          <Server size={14} /> Space
                        </div>
                        <div className="font-mono text-pink-500">
                          {program?.space || "O(N)"}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight">
                          <Zap size={14} /> Difficulty
                        </div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">
                          {program?.difficulty || "Medium"}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight">
                          <Terminal size={14} /> Lang
                        </div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">
                          C Language
                        </div>
                      </div>
                    </div>

                    {/* Use the Dictionary to fetch C Code */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        {["c", "cpp", "python", "java"].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => setSelectedLanguage(lang)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                              selectedLanguage === lang
                                ? "bg-orange-500 text-white shadow-sm"
                                : "text-gray-500 hover:text-orange-500"
                            }`}>
                            {lang}
                          </button>
                        ))}
                      </div>
                      <a
                        href={`https://www.programiz.com/${selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "python" ? "python" : selectedLanguage === "java" ? "java" : "c"}-programming/online-compiler/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg">
                        <Terminal size={14} /> Run Online
                      </a>
                    </div>
                    <CodeBlock
                      code={
                        selectedLanguage === "c"
                          ? C_CODE[activeView as keyof typeof C_CODE] ||
                            "// Code not found"
                          : selectedLanguage === "cpp"
                            ? CPP_CODE[activeView as keyof typeof CPP_CODE] ||
                              "// Code coming soon"
                            : selectedLanguage === "python"
                              ? PYTHON_CODE[
                                  activeView as keyof typeof PYTHON_CODE
                                ] || "// Code coming soon"
                              : JAVA_CODE[
                                  activeView as keyof typeof JAVA_CODE
                                ] || "// Code coming soon"
                      }
                      darkMode={darkMode}
                      language={
                        selectedLanguage === "cpp"
                          ? "cpp"
                          : selectedLanguage === "python"
                            ? "python"
                            : selectedLanguage === "java"
                              ? "java"
                              : "c"
                      }
                    />

                    {/* Concept breakdown */}
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-orange-500" />{" "}
                        Concept Breakdown
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                          <h4 className="font-bold text-orange-500 mb-2 underline decoration-orange-500/30 underline-offset-4">
                            How it works?
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            This program implements the core logic of{" "}
                            {program?.category.toLowerCase() || "this topic"}.
                            It focuses on{" "}
                            {program?.difficulty === "Easy"
                              ? "fundamental operations"
                              : "optimized operations and handling edge cases"}
                            . For a detailed step-by-step walkthrough, refer to
                            the comments in the code above.
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
                  onClick={() => navigateTo("home")}
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-orange-500 font-semibold transition-colors">
                  <Home size={20} />{" "}
                  <span className="hidden sm:inline">Home</span>
                </button>

                {activeView === "program12" ? (
                  <button
                    onClick={() => navigateTo("home")}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-orange-500 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md">
                    Perfect! Back Home
                  </button>
                ) : (
                  (() => {
                    const nextMap: Record<string, string> = {
                      program1: "Program 2",
                      program2: "Program 3",
                      program3: "Program 4",
                      program4: "Program 5A",
                      program5a: "Program 5B",
                      program5b: "Program 6",
                      program6: "Program 7",
                      program7: "Program 8",
                      program8: "Program 9",
                      program9: "Program 10",
                      program10: "Program 11",
                      program11: "Program 12",
                    };
                    const nextName = nextMap[activeView];
                    return nextName ? (
                      <button
                        onClick={() => handleProgramClick(nextName)}
                        className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md shadow-orange-500/20">
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

      {/* VIEW: KNAPSACK */}
      {activeView === "knapsack" && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
          <KnapsackVisualizer />
        </section>
      )}

      {/* VIEW: VISUALIZER */}
      {activeView === "visualizer" && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
          <PathfindingVisualizer />
        </section>
      )}
      {/* VIEW: SORTING */}
      {activeView === "sorting" && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
          <SortingVisualizer />
        </section>
      )}

      {/* VIEW: TREES & GRAPHS */}
      {activeView === "tree-graph" && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
          <TreeGraphVisualizer />
        </section>
      )}

      {/* VIEW: SYSTEM DESIGN */}
      {activeView === "system-design" && (
        <section className="pt-32 pb-20 px-4 min-h-screen">
          <SystemDesign />
        </section>
      )}

      {/* VIEW: REPORT ISSUE */}
      {activeView === "report" && (
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
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">
              Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Topic-wise Roadmap
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Blind 75 Sheet
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("system-design")}
                  className="hover:text-orange-400 transition-colors text-left">
                  System Design Primer
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Mock Tests
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company/Support */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => navigateTo("about")}
                  className="hover:text-orange-400 transition-colors">
                  About Me
                </button>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=pranavarun19@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("report")}
                  className="hover:text-orange-400 transition-colors">
                  Report Issue
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("privacy")}
                  className="hover:text-orange-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">
              Connect
            </h3>
            <div className="flex space-x-5">
              {/* GitHub Icon */}
              <a
                href="https://github.com/toxicbishop"
                className="p-2 bg-slate-800 rounded-full hover:bg-orange-600 hover:text-white transition-all group">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/in/pranav-arun/"
                className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* X / Twitter Icon */}
              <a
                href="https://x.com/Pranav63076884"
                className="p-2 bg-slate-800 rounded-full hover:bg-black hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X.com - Pranav">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram/Web Icon */}
              <a
                href="https://www.instagram.com/toxicbishop_/"
                className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer">
                <svg
                  className="w-5 h-5 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Discord Icon */}
              <a
                href="https://discord.com/users/701732138269016064"
                className="p-2 bg-slate-800 rounded-full hover:bg-indigo-500 hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 DSA Study Hub. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button
              onClick={() => navigateTo("terms")}
              className="hover:text-gray-300">
              Terms
            </button>
            <button
              onClick={() => navigateTo("privacy")}
              className="hover:text-gray-300">
              Privacy
            </button>
            <button
              onClick={() => navigateTo("cookies")}
              className="hover:text-gray-300">
              Cookies
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
