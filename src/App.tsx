import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import Snowfall from "react-snowfall";

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
// Lazy Loaded Views
const HomeView = lazy(() =>
  import("./views/HomeView").then((module) => ({ default: module.HomeView })),
);
const AboutView = lazy(() =>
  import("./views/AboutView").then((module) => ({ default: module.AboutView })),
);
const ProgramView = lazy(() =>
  import("./views/ProgramView").then((module) => ({
    default: module.ProgramView,
  })),
);

import {
  Code2,
  Home,
  User,
  BookOpen,
  Map,
  Server,
  BarChart3,
  Network,
  Package,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ExternalLink,
} from "lucide-react";
const PathfindingVisualizer = lazy(
  () => import("./components/PathfindingVisualizer"),
);
const SortingVisualizer = lazy(() => import("./components/SortingVisualizer"));
const TreeGraphVisualizer = lazy(
  () => import("./components/TreeGraphVisualizer"),
);
const ReportIssue = lazy(() => import("./components/ReportIssue"));
const SystemDesign = lazy(() =>
  import("./components/SystemDesign").then((module) => ({
    default: module.SystemDesign,
  })),
);
import Loader from "./components/Loader";
const KnapsackVisualizer = lazy(
  () => import("./components/KnapsackVisualizer"),
);

// --- DATA ---
import { programsData, notes } from "./data/programs";

// Inline Page Components
const PrivacyPage = () => (
  <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200 min-h-screen">
    <h2 className="text-4xl font-bold mb-8 text-orange-500">Privacy Policy</h2>
    <div className="space-y-6">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        Welcome to DSA Study Hub. This Privacy Policy explains how we handle
        your information.
      </p>
      <h3 className="text-2xl font-semibold">1. Information We Collect</h3>
      <p>
        We do not collect any personal information. Your progress and
        preferences (like theme settings) are stored locally on your device.
      </p>
      <h3 className="text-2xl font-semibold">2. Third-Party Links</h3>
      <p>
        Our site contains links to other websites (like GitHub, LinkedIn). We
        are not responsible for the privacy practices of these sites.
      </p>
    </div>
  </section>
);

const TermsPage = () => (
  <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200 min-h-screen">
    <h2 className="text-4xl font-bold mb-8 text-orange-500">
      Terms of Service
    </h2>
    <div className="space-y-6">
      <p>By using DSA Study Hub, you agree to these terms.</p>
      <h3 className="text-2xl font-semibold">Usage</h3>
      <p>
        This content is for educational purposes. Code examples are provided "as
        is" without warranty of any kind.
      </p>
    </div>
  </section>
);

const CookiesPage = () => (
  <section className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-gray-800 dark:text-gray-200 min-h-screen">
    <h2 className="text-4xl font-bold mb-8 text-orange-500">Cookie Policy</h2>
    <div className="space-y-6">
      <p>
        We use local storage technology (not traditional cookies) to remember
        your theme preference (Dark/Light mode). No tracking or third-party
        cookies are used by us directly.
      </p>
    </div>
  </section>
);

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

  const [selectedLanguage, setSelectedLanguage] = useState("c");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedPrograms, setCompletedPrograms] = useState<string[]>(() => {
    const saved = localStorage.getItem("completedPrograms");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isWinter = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0 is January, 11 is December
    const day = now.getDate();
    return month === 11 || (month === 0 && day <= 15);
  }, []);

  const toggleProgramComplete = (id: string) => {
    const newCompleted = completedPrograms.includes(id)
      ? completedPrograms.filter((p) => p !== id)
      : [...completedPrograms, id];
    setCompletedPrograms(newCompleted);
    localStorage.setItem("completedPrograms", JSON.stringify(newCompleted));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // --- RESET & NAVIGATION ---
  const resetProgramState = () => {
    setIsProgramsOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    resetProgramState();
  }, [location.pathname]);

  const navigateTo = (view: string) => {
    // Map view names to routes if necessary, or just use path
    if (view.startsWith("program")) {
      navigate(`/program/${view}`);
    } else if (view === "home") {
      navigate("/");
    } else {
      navigate(`/${view}`);
    }
  };

  const handleProgramClick = (pid: string) => {
    const view = pid.toLowerCase().replace(/\s/g, "");
    navigate(`/program/${view}`);
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

    return () => {
      window.removeEventListener("scroll", s);
      mediaQuery.removeEventListener("change", handleThemeChange);
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
          // Removed code content from search index to keep it light, or keep it if needed?
          // Keeping it as before:
          p.name,
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
        action: () => navigate("/knapsack"),
        icon: Package,
      },
      {
        id: "pathfinder",
        type: "visualizer",
        title: "Pathfinding Visualizer",
        subtitle: "BFS, DFS, Dijkstra",
        content: "pathfinder pathfinding bfs dfs dijkstra graph visualizer",
        action: () => navigate("/visualizer"),
        icon: Map,
      },
      {
        id: "sorting",
        type: "visualizer",
        title: "Sorting Visualizer",
        subtitle: "Bubble, Merge, Quick Sort",
        content:
          "sorting visualizer sort bubble merge quick heap insertion selection",
        action: () => navigate("/sorting"),
        icon: BarChart3,
      },
      {
        id: "tree-graph",
        type: "visualizer",
        title: "Tree & Graph Visualizer",
        subtitle: "Tree Traversals and Graph Algorithms",
        content:
          "tree graph visualizer traversal inorder preorder postorder bfs dfs",
        action: () => navigate("/tree-graph"),
        icon: Network,
      },
      {
        id: "system-design",
        type: "visualizer",
        title: "System Design",
        subtitle: "Architecture and Design Patterns",
        content: "system design architecture patterns",
        action: () => navigate("/system-design"),
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
        action: () => navigate("/about"),
        icon: User,
      },
      {
        id: "home",
        type: "page",
        title: "Home",
        subtitle: "Main Page",
        content: "home start learning welcome",
        action: () => navigate("/"),
        icon: Home,
      },
    ];
    return items;
  }, [programsData, notes, navigate]);

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
      {isWinter && <Snowfall />}

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

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                navigateTo={navigateTo}
                isNotesOpen={isNotesOpen}
                setIsNotesOpen={setIsNotesOpen}
                completedPrograms={completedPrograms}
                handleProgramClick={handleProgramClick}
              />
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/about" element={<AboutView />} />

          {/* Dynamic Program Route */}
          <Route
            path="/program/:id"
            element={
              <ProgramView
                completedPrograms={completedPrograms}
                toggleProgramComplete={toggleProgramComplete}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                darkMode={darkMode}
              />
            }
          />

          {/* Visualizers */}
          <Route
            path="/knapsack"
            element={
              <section className="pt-32 pb-20 px-4 min-h-screen">
                <KnapsackVisualizer />
              </section>
            }
          />
          <Route
            path="/visualizer"
            element={
              <section className="pt-32 pb-20 px-4 min-h-screen">
                <PathfindingVisualizer />
              </section>
            }
          />
          <Route
            path="/sorting"
            element={
              <section className="pt-32 pb-20 px-4 min-h-screen">
                <SortingVisualizer />
              </section>
            }
          />
          <Route
            path="/tree-graph"
            element={
              <section className="pt-32 pb-20 px-4 min-h-screen">
                <TreeGraphVisualizer />
              </section>
            }
          />
          <Route
            path="/system-design"
            element={
              <section className="pt-32 pb-20 px-4 min-h-screen">
                <SystemDesign />
              </section>
            }
          />

          {/* Utilities */}
          <Route
            path="/report"
            element={
              <section className="pt-32 pb-20 px-4 min-h-screen">
                <ReportIssue />
              </section>
            }
          />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-gray-300 py-16 mt-20 border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              DSA Study <span className="text-orange-500">Hub</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              The complete platform to master Data Structures and Algorithms.
              Interactive visualizations and practice quizzes to help you
              succeed.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">
              Learning
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => navigateTo("home")}
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-2">
                  <Map size={14} /> Topic Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("system-design")}
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-2">
                  <Server size={14} /> System Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("home")}
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-2">
                  <BookOpen size={14} /> Interactive Quizzes
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">
              Visualizers
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  onClick={() => navigateTo("visualizer")}
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-2">
                  <Network size={14} /> Pathfinding
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("sorting")}
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-2">
                  <BarChart3 size={14} /> Sorting
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("tree-graph")}
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-2">
                  <Network size={14} /> Trees & Graphs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("knapsack")}
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-2">
                  <Package size={14} /> Knapsack DP
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">
              Connect
            </h3>
            <ul className="space-y-3 text-sm mb-8">
              <li>
                <button
                  onClick={() => navigateTo("about")}
                  className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <User size={14} /> About Me
                </button>
              </li>
              <li>
                <a
                  href="mailto:pranavarun19@gmail.com"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <Mail size={14} /> Contact
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("report")}
                  className="hover:text-orange-400 transition-colors flex items-center gap-2">
                  <ExternalLink size={14} /> Report Issue
                </button>
              </li>
            </ul>
            <div className="flex space-x-4">
              <a
                href="https://github.com/toxicbishop"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 rounded-xl hover:bg-orange-600 hover:text-white transition-all transform hover:scale-110"
                title="GitHub">
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com/in/pranav-arun/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 rounded-xl hover:bg-sky-500 hover:text-white transition-all transform hover:scale-110"
                title="Twitter">
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 rounded-xl hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110"
                title="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 DSA Study Hub. Crafted with ❤️ for the community.</p>
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
