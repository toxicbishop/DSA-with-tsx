import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
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
import { AuthCallbackView } from "./views/AuthCallbackView";

// --- DATA ---
import { programsData, notes } from "./data/programs";
import { GoogleUser } from "./components/GoogleAuth";

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
  const [user, setUser] = useState<GoogleUser | null>(null);

  const isWinter = useMemo(() => {
    const now = new Date();
    const month = now.getMonth(); // 0 is January, 11 is December
    const day = now.getDate();
    return month === 11 || (month === 0 && day <= 15);
  }, []);

  const toggleProgramComplete = async (id: string) => {
    const newCompleted = completedPrograms.includes(id)
      ? completedPrograms.filter((p) => p !== id)
      : [...completedPrograms, id];
    setCompletedPrograms(newCompleted);
    localStorage.setItem("completedPrograms", JSON.stringify(newCompleted));

    if (user) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/users/progress`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completedPrograms: newCompleted }),
          credentials: "include",
        });
      } catch (error) {
        console.error("Failed to sync progress:", error);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (
            data.user.completedPrograms &&
            data.user.completedPrograms.length > 0
          ) {
            setCompletedPrograms(data.user.completedPrograms);
            localStorage.setItem(
              "completedPrograms",
              JSON.stringify(data.user.completedPrograms),
            );
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();

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

  const handleProgramClick = useCallback(
    (pid: string) => {
      const view = pid.toLowerCase().replace(/\s/g, "");
      navigate(`/program/${view}`);
    },
    [navigate],
  );

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
        content: [p.name, p.category, p.difficulty].join(" ").toLowerCase(),
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
  }, [handleProgramClick, navigate]);

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
        user={user}
        onLogin={(authedUser) => {
          setUser(authedUser);
          if (
            authedUser.completedPrograms &&
            authedUser.completedPrograms.length > 0
          ) {
            setCompletedPrograms(authedUser.completedPrograms);
            localStorage.setItem(
              "completedPrograms",
              JSON.stringify(authedUser.completedPrograms),
            );
          }
        }}
        onLogout={() => {
          setUser(null);
        }}
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
          <Route path="/auth/callback" element={<AuthCallbackView />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-gray-300 py-16 mt-20 border-t border-slate-800 font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
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

          {/* Column 2: Learning */}
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

          {/* Column 3: Visualizers */}
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

          {/* Column 4: Connect */}
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

            <div className="flex space-x-5">
              <a
                href="https://github.com/toxicbishop"
                className="p-2 bg-slate-800 rounded-full hover:bg-[#181717] hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/pranavarun"
                className="p-2 bg-slate-800 rounded-full hover:bg-[#0A66C2] hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://x.com/Pranav63076884"
                className="p-2 bg-slate-800 rounded-full hover:bg-black hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/toxicbishop_/"
                className="p-2 bg-slate-800 rounded-full hover:bg-[#E4405F] hover:text-white transition-all group"
                target="_blank"
                rel="noopener noreferrer">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 DSA Study Hub.</p>
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
