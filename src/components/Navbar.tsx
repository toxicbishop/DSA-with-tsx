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
              className="hidden md:flex p-2 rounded-full hover:bg-orange-500/10 text-gray-700 dark:text-gray-200">
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <div className="hidden md:flex ml-4">
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
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex justify-center pb-8">
            <GoogleAuth user={user} onLogin={onLogin} onLogout={onLogout} />
          </div>
        </div>
      )}
    </nav>
  );
};
