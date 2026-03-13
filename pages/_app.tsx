import '../src/index.css';
import type { AppProps } from 'next/app';
import { Providers } from '../src/components/Providers';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '../src/components/Navbar';
import Snowfall from 'react-snowfall';
import Loader from '../src/components/Loader';
import { programsData } from '../src/data/programs';
import { GoogleUser } from '../src/components/GoogleAuth';
import { secureFetch } from '../src/utils/api';
import { useRouter } from 'next/router';
import { 
  Code2, 
  Home, 
  User, 
  Map, 
  Server, 
  BarChart3, 
  Package, 
  Mail, 
  Shield, 
  Route as RouteIcon 
} from 'lucide-react';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("c");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [completedPrograms, setCompletedPrograms] = useState<string[]>([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    const savedCompleted = localStorage.getItem("completedPrograms");
    if (savedCompleted) {
      setCompletedPrograms(JSON.parse(savedCompleted));
    }

    const checkAuth = async () => {
      try {
        const res = await secureFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
          if (data.user.completedPrograms?.length > 0) {
            setCompletedPrograms(data.user.completedPrograms);
            localStorage.setItem("completedPrograms", JSON.stringify(data.user.completedPrograms));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const isWinter = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    return month === 11 || (month === 0 && now.getDate() <= 15);
  }, []);

  const toggleProgramComplete = async (id: string) => {
    const newCompleted = completedPrograms.includes(id)
      ? completedPrograms.filter((p) => p !== id)
      : [...completedPrograms, id];
    setCompletedPrograms(newCompleted);
    localStorage.setItem("completedPrograms", JSON.stringify(newCompleted));

    if (user) {
      try {
        await secureFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/progress`, {
          method: "PUT",
          body: JSON.stringify({ completedPrograms: newCompleted }),
        });
      } catch (error) {
        console.error("Failed to sync progress:", error);
      }
    }
  };

  const handleProgramClick = useCallback((pid: string) => {
    const view = pid.toLowerCase().replace(/\s/g, "");
    router.push(`/program/${view}`);
  }, [router]);

  const navigateTo = (view: string) => {
    if (view.startsWith("program")) {
      router.push(`/program/${view}`);
    } else if (view === "home") {
      router.push("/");
    } else {
      router.push(`/${view}`);
    }
  };

  const resetProgramState = () => {
    setIsProgramsOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const s = () => setIsNavbarScrolled(window.scrollY > 20);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  const allSearchableItems = useMemo(() => {
    return [
      ...programsData.map((p) => ({
        id: p.id,
        type: "program",
        title: p.name,
        subtitle: `${p.category} • ${p.difficulty}`,
        content: [p.name, p.category, p.difficulty].join(" ").toLowerCase(),
        action: () => handleProgramClick(p.name),
        icon: Code2,
      })),
      {
        id: "knapsack",
        type: "visualizer",
        title: "Knapsack Visualizer",
        subtitle: "Dynamic Programming Visualization",
        content: "knapsack dynamic programming visualizer dp",
        action: () => router.push("/knapsack"),
        icon: Package,
      },
      // ... more visualizer items similar to App.tsx
      {
        id: "about",
        type: "page",
        title: "About Me",
        subtitle: "Profile and Bio",
        content: "about me profile bio contact pranav arun",
        action: () => router.push("/about"),
        icon: User,
      },
      {
        id: "home",
        type: "page",
        title: "Home",
        subtitle: "Main Page",
        content: "home start learning welcome",
        action: () => router.push("/"),
        icon: Home,
      },
    ];
  }, [handleProgramClick, router]);

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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdminModalOpen(false);
        setAdminPassword("");
        router.push("/admin");
      }
    } catch {
      // error
    }
  };


  if (isLoading) return <Loader />;

  return (
    <Providers>
      <div className={`min-h-screen relative z-0 transition-colors duration-300 ${darkMode ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        {isWinter && <Snowfall />}
        <div className={`absolute inset-0 -z-10 bg-[size:30px_30px] ${darkMode ? "bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" : "bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)]"}`}></div>
        
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
          onLogin={setUser}
          onLogout={() => setUser(null)}
        />

        <main>
          <Component 
            {...pageProps} 
            user={user}
            onLogin={setUser}
            onLogout={() => setUser(null)}
            completedPrograms={completedPrograms}
            toggleProgramComplete={toggleProgramComplete}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            darkMode={darkMode}
            isNotesOpen={isNotesOpen}
            setIsNotesOpen={setIsNotesOpen}
            handleProgramClick={handleProgramClick}
            navigateTo={navigateTo}
          />
        </main>

        <footer className="bg-slate-900 text-gray-300 py-16 mt-20 border-t border-slate-800 font-sans">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                DSA Study <span className="text-orange-500">Hub</span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                The complete platform to master Data Structures and Algorithms.
                Interactive visualizations and practice quizzes to help you succeed.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Learning</h3>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigateTo("home")} className="hover:text-orange-400 transition-colors flex items-center gap-2"><Map size={14} /> Topic Roadmap</button></li>
                <li><button onClick={() => navigateTo("system-design")} className="hover:text-orange-400 transition-colors flex items-center gap-2"><Server size={14} /> System Design</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Visualizers</h3>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigateTo("visualizer")} className="hover:text-orange-400 transition-colors flex items-center gap-2"><RouteIcon size={14} /> Pathfinding</button></li>
                <li><button onClick={() => navigateTo("sorting")} className="hover:text-orange-400 transition-colors flex items-center gap-2"><BarChart3 size={14} /> Sorting</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-sm">Connect</h3>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => navigateTo("about")} className="hover:text-orange-400 transition-colors flex items-center gap-2"><User size={14} /> About Me</button></li>
                <li><a href="mailto:pranavarun19@gmail.com" className="hover:text-orange-400 transition-colors flex items-center gap-2"><Mail size={14} /> Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2026 DSA Study Hub.</p>
            <div className="flex items-center space-x-6">
              <button onClick={() => navigateTo("terms")}>Terms</button>
              <button onClick={() => navigateTo("privacy")}>Privacy</button>
              <button onClick={() => navigateTo("cookies")}>Cookies</button>
              <button onClick={() => setIsAdminModalOpen(true)} className="opacity-20 hover:opacity-60"><Shield size={13} /></button>
            </div>
          </div>
        </footer>

        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setIsAdminModalOpen(false)}>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-white font-bold text-lg mb-4">Admin Access</h2>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <input
                  type={showAdminPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm"
                />
                <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold">Authenticate</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Providers>
  );
}

export default MyApp;
