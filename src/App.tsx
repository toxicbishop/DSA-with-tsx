import { useState, useEffect, useMemo } from "react";
import { CodeBlock } from "./components/CodeBlock";
import { Navbar } from "./components/Navbar";
import { HomeView } from "./views/HomeView";
import { AboutView } from "./views/AboutView";
import {
  Code2,
  Home,
  User,
  BookOpen,
  ArrowRight,
  Map,
  Server,
  BarChart3,
  Network,
  Trophy,
  Zap,
  Clock,
  Terminal,
  Package,
} from "lucide-react";
import PathfindingVisualizer from "./components/PathfindingVisualizer";
import SortingVisualizer from "./components/SortingVisualizer";
import TreeGraphVisualizer from "./components/TreeGraphVisualizer";
import ReportIssue from "./components/ReportIssue";
import { SystemDesign } from "./components/SystemDesign";
import Loader from "./components/Loader";
import KnapsackVisualizer from "./components/KnapsackVisualizer";

// --- DATA: C Source Code for All Programs ---
import {
  C_CODE,
  CPP_CODE,
  PYTHON_CODE,
  JAVA_CODE,
  programsData,
  notes,
} from "./data/programs";

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
      <Navbar
        isNavbarScrolled={isNavbarScrolled}
        navigateTo={navigateTo}
        resetProgramState={resetProgramState}
        isProgramsOpen={isProgramsOpen}
        setIsProgramsOpen={setIsProgramsOpen}
        isNotesOpen={isNotesOpen}
        setIsNotesOpen={setIsNotesOpen}
        completedPrograms={completedPrograms}
        handleProgramClick={handleProgramClick}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* VIEW: HOME */}
      {activeView === "home" && (
        <HomeView
          navigateTo={navigateTo}
          isNotesOpen={isNotesOpen}
          setIsNotesOpen={setIsNotesOpen}
          completedPrograms={completedPrograms}
          handleProgramClick={handleProgramClick}
        />
      )}

      {/* VIEW: ABOUT */}
      {activeView === "about" && <AboutView />}

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
