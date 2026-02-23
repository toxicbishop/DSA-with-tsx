import {
  ArrowRight,
  Code2,
  Briefcase,
  Map,
  Eye,
  Network,
  Zap,
  BarChart3,
  Server,
  Trophy,
  Check,
  Package,
} from "lucide-react";
import { programsData } from "../data/programs";

interface HomeViewProps {
  navigateTo: (view: string) => void;
  isNotesOpen: boolean;
  setIsNotesOpen: (val: boolean) => void;
  completedPrograms: string[];
  handleProgramClick: (name: string) => void;
}

export const HomeView = ({
  navigateTo,
  isNotesOpen,
  setIsNotesOpen,
  completedPrograms,
  handleProgramClick,
}: HomeViewProps) => {
  return (
    <>
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
                {["DP", "Graphs", "Trees", "Heaps", "Recursion"].map((tag) => (
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

      <section className="py-16 px-4 bg-gray-50/50 dark:bg-gray-900/20 backdrop-blur-sm border-y border-gray-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
            <Map className="text-orange-500" size={32} />
            <span>
              Interactive <span className="text-orange-500">Roadmap</span>
            </span>
            <div className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 uppercase tracking-wider">
              BETA
            </div>
          </h3>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Your <span className="text-orange-500">Learning Path</span>
            </h3>
          </div>

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
                      className={`absolute left-0 top-0 w-10 h-10 rounded-full items-center justify-center border-4 z-10 transition-all duration-500 hidden sm:flex ${
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

            {/* Card 5: Sorting Visualizer */}
            <div
              onClick={() => navigateTo("sorting")}
              className="cursor-pointer p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Sorting Visualizer
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Watch Bubble, Merge, Quick, and Heap Sort come alive with
                step-by-step animated bar comparisons.
              </p>
            </div>

            {/* Card 6: Knapsack DP */}
            <div
              onClick={() => navigateTo("knapsack")}
              className="cursor-pointer p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                Knapsack DP
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Explore the classic 0/1 Knapsack problem with an interactive
                dynamic programming table builder.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
