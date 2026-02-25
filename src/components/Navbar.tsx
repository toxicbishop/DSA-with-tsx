import {
  Code2,
  Home,
  User,
  Package,
  Map,
  BarChart3,
  Network,
  Server,
  Bug,
  Search,
  X,
  ChevronDown,
  BookOpen,
  Check,
  Sun,
  Moon,
  Menu,
  LogOut,
  ArrowRight,
  UserCircle,
} from "lucide-react";
import { programsData, notes } from "../data/programs";
import { GoogleAuth, GoogleUser } from "./GoogleAuth";

interface SearchItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  action: () => void;
  icon: React.ElementType;
  content: string;
}

interface NavbarProps {
  isNavbarScrolled: boolean;
  navigateTo: (view: string) => void;
  resetProgramState: () => void;
  isProgramsOpen: boolean;
  setIsProgramsOpen: (val: boolean) => void;
  isNotesOpen: boolean;
  setIsNotesOpen: (val: boolean) => void;
  completedPrograms: string[];
  handleProgramClick: (name: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchResults: SearchItem[];
  darkMode: boolean;
  toggleTheme: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (val: boolean) => void;
  user: GoogleUser | null;
  onLogin: (user: GoogleUser) => void;
  onLogout: () => void;
}

export const Navbar = ({
  isNavbarScrolled,
  navigateTo,
  resetProgramState,
  isProgramsOpen,
  setIsProgramsOpen,
  isNotesOpen,
  setIsNotesOpen,
  completedPrograms,
  handleProgramClick,
  isSearchOpen,
  setIsSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  darkMode,
  toggleTheme,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  user,
  onLogin,
  onLogout,
}: NavbarProps) => {
  return (
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
                  <div className="fixed top-16 left-2 right-2 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:mt-2 sm:w-[350px] md:w-[450px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col max-h-[70vh]">
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
                            const sanitized = value.replace(/[<>;'"\\`]/g, "");
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
              className="hidden md:flex p-2 rounded-full hover:bg-orange-500/10 text-gray-700 dark:text-gray-200"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            {/* Desktop only: Auth button */}
            <div id="desktop-auth-btn" className="ml-2 hidden md:flex">
              <GoogleAuth user={user} onLogin={onLogin} onLogout={onLogout} />
            </div>

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
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl absolute top-16 left-0 w-full flex flex-col border-b border-gray-200 dark:border-gray-700 max-h-[85vh]">
          {/* Scrollable nav items */}
          <div className="overflow-y-auto flex-1 p-4 flex flex-col space-y-1">
            {/* Top row: Home + Theme toggle */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => {
                  navigateTo("home");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg text-gray-800 dark:text-gray-100">
                <Home size={20} />
                <span className="font-medium">Home</span>
              </button>
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="p-2 rounded-full hover:bg-orange-500/10 text-gray-600 dark:text-gray-300 transition-colors"
                title={
                  darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Programs accordion */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsProgramsOpen(!isProgramsOpen)}
                className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded-lg w-full text-gray-800 dark:text-gray-100">
                <div className="flex items-center space-x-2">
                  <Code2 size={20} />
                  <span className="font-medium">Programs</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isProgramsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isProgramsOpen && (
                <div className="pl-8 flex flex-col space-y-1 mt-1">
                  {programsData.map((program) => (
                    <a
                      key={program.id}
                      href={`#${program.id}`}
                      className="flex items-center justify-between py-1.5 px-2 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 rounded-md hover:bg-orange-500/5"
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

            {/* Notes accordion */}
            <div className="flex flex-col">
              <button
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="flex items-center justify-between p-2 hover:bg-orange-500/10 rounded-lg w-full text-gray-800 dark:text-gray-100">
                <div className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span className="font-medium">Notes</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${isNotesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isNotesOpen && (
                <div className="pl-8 flex flex-col space-y-1 mt-1">
                  {notes.map((note) => (
                    <a
                      key={note.name}
                      href={note.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-1.5 px-2 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 rounded-md hover:bg-orange-500/5"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      {note.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Feature nav items */}
            {[
              { label: "Knapsack Visualizer", icon: Package, view: "knapsack" },
              { label: "Pathfinder", icon: Map, view: "visualizer" },
              { label: "Sorter", icon: BarChart3, view: "sorting" },
              { label: "Trees & Graphs", icon: Network, view: "tree-graph" },
              { label: "System Design", icon: Server, view: "system-design" },
              { label: "Report Issue", icon: Bug, view: "report" },
              { label: "About Me", icon: User, view: "about" },
            ].map(({ label, icon: Icon, view }) => (
              <button
                key={view}
                onClick={() => {
                  navigateTo(view);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 p-2 hover:bg-orange-500/10 rounded-lg text-gray-800 dark:text-gray-100 w-full text-left">
                <Icon
                  size={20}
                  className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Pinned Footer: Auth section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            {user ? (
              /* Logged-in user card */
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    navigateTo("about");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 group p-2 rounded-xl hover:bg-orange-500/10 transition-colors">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-orange-500/30 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <UserCircle size={20} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex-shrink-0"
                  title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              /* Logged-out CTA */
              <div className="flex flex-col gap-3">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Track progress, save notes, and unlock all features.
                </p>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // Trigger the hidden desktop GoogleAuth button to open its modal
                    setTimeout(() => {
                      const authBtn = document
                        .getElementById("desktop-auth-btn")
                        ?.querySelector<HTMLButtonElement>("button");
                      authBtn?.click();
                    }, 50);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/30">
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
