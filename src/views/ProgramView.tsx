import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { Quiz } from "../components/Quiz";
import {
  Trophy,
  Zap,
  Clock,
  Server,
  Terminal,
  BookOpen,
  Home,
  ArrowRight,
} from "lucide-react";
import ProgramSimulator from "../components/ProgramSimulator";
import { useProgramSimulator } from "../hooks/useProgramSimulator";
import {
  C_CODE,
  CPP_CODE,
  PYTHON_CODE,
  JAVA_CODE,
  programsData,
} from "../data/programs";

interface ProgramViewProps {
  completedPrograms: string[];
  toggleProgramComplete: (id: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  darkMode: boolean;
}

export const ProgramView: React.FC<ProgramViewProps> = ({
  completedPrograms,
  toggleProgramComplete,
  selectedLanguage,
  setSelectedLanguage,
  darkMode,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const activeView = id || "";

  const {
    programOutput,
    userInput,
    setUserInput,
    handleInputSubmit,
    resetProgramState,
  } = useProgramSimulator(activeView);

  const program = useMemo(
    () => programsData.find((p) => p.id === activeView),
    [activeView],
  );

  if (!program) {
    return (
      <div className="pt-32 pb-20 px-4 min-h-screen text-center">
        <h2 className="text-2xl font-bold">Program Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg">
          Go Home
        </button>
      </div>
    );
  }

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

  // Helper to trigger navigation to next program by name (needs ID mapping or name->ID logic if inconsistent)
  // Assuming nextName is consistent with ID somewhat, or we should map ID -> ID.
  // The current app logic maps ID -> Name?
  // "program1" -> "Program 2".
  // handleProgramClick uses LowerCase + Replace spaces.
  const handleNextClick = (nextName: string) => {
    const view = nextName.toLowerCase().replace(/\s/g, "");
    navigate(`/program/${view}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-20 px-4 pt-32 min-h-screen">
      <div className="max-w-4xl mx-auto p-6 rounded-lg bg-white shadow-xl dark:bg-white/5">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-orange-500 font-bold mb-1">
                <span className="px-2 py-0.5 bg-orange-500/10 rounded text-xs uppercase tracking-wider">
                  {program.category || "General"}
                </span>
                <span>•</span>
                <span
                  className={`text-xs uppercase tracking-wider ${
                    program.difficulty === "Easy"
                      ? "text-green-500"
                      : program.difficulty === "Medium"
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}>
                  {program.difficulty || "Medium"}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Program {activeView.replace("program", "").toUpperCase()}
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
                {program.time || "O(N)"}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight">
                <Server size={14} /> Space
              </div>
              <div className="font-mono text-pink-500">
                {program.space || "O(N)"}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-1 text-xs font-bold uppercase tracking-tight">
                <Zap size={14} /> Difficulty
              </div>
              <div className="font-semibold text-gray-700 dark:text-gray-300">
                {program.difficulty || "Medium"}
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

          {/* Language Selector */}
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
              href="https://www.onlinegdb.com/online_c_compiler"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-sm dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white">
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
                    ? PYTHON_CODE[activeView as keyof typeof PYTHON_CODE] ||
                      "// Code coming soon"
                    : JAVA_CODE[activeView as keyof typeof JAVA_CODE] ||
                      "// Code coming soon"
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
              <BookOpen size={20} className="text-orange-500" /> Concept
              Breakdown
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <h4 className="font-bold text-orange-500 mb-2 underline decoration-orange-500/30 underline-offset-4">
                  How it works?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  This program implements the core logic of{" "}
                  {program.category.toLowerCase() || "this topic"}. It focuses
                  on{" "}
                  {program.difficulty === "Easy"
                    ? "fundamental operations"
                    : "optimized operations and handling edge cases"}
                  . For a detailed step-by-step walkthrough, refer to the
                  comments in the code above.
                </p>
              </div>
            </div>
          </div>

          {/* Quiz Component */}
          <Quiz programId={activeView} darkMode={darkMode} />

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-orange-500 font-semibold transition-colors">
              <Home size={20} /> <span className="hidden sm:inline">Home</span>
            </button>

            {activeView === "program12" ? (
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-orange-500 text-white rounded-lg font-semibold hover:bg-gray-700 dark:hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md">
                Perfect! Back Home
              </button>
            ) : (
              (() => {
                const nextName = nextMap[activeView];
                return nextName ? (
                  <button
                    onClick={() => handleNextClick(nextName)}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all transform hover:scale-105 shadow-md shadow-orange-500/20">
                    Next <ArrowRight size={20} />
                  </button>
                ) : null;
              })()
            )}
          </div>
        </div>
      </div>
      <ProgramSimulator
        activeView={activeView}
        darkMode={darkMode}
        programOutput={programOutput}
        userInput={userInput}
        setUserInput={setUserInput}
        resetProgramState={resetProgramState}
        handleInputSubmit={handleInputSubmit}
      />
    </section>
  );
};
