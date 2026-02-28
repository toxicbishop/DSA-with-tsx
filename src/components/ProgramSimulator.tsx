import { useEffect, useRef } from "react";

interface ProgramSimulatorProps {
  activeView: string;
  darkMode: boolean;
  programOutput: string[];
  userInput: string;
  setUserInput: (input: string) => void;
  resetProgramState: () => void;
  handleInputSubmit: () => void;
}

const ProgramSimulator = ({
  activeView,
  darkMode,
  programOutput,
  userInput,
  setUserInput,
  resetProgramState,
  handleInputSubmit,
}: ProgramSimulatorProps) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [programOutput]);

  if (!activeView.startsWith("program")) return null;

  return (
    <section className="pt-24 md:pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className={`p-4 md:p-6 rounded-lg ${
            darkMode
              ? "bg-gray-900 border border-gray-700"
              : "bg-white shadow-2xl"
          }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-orange-500 capitalize">
              {activeView.replace("program", "Program ")}
            </h2>
            <button
              onClick={resetProgramState}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors">
              Reset
            </button>
          </div>

          {/* Simulation Terminal */}
          <div
            ref={outputRef}
            className={`font-mono p-4 rounded-md mb-6 h-[400px] overflow-y-auto ${
              darkMode ? "bg-black text-green-400" : "bg-gray-100 text-gray-800"
            }`}>
            {programOutput.length === 0 ? (
              <p className="opacity-50">Program output will appear here...</p>
            ) : (
              programOutput.map((line, i) => (
                <div key={i} className="mb-1 whitespace-pre-wrap">
                  {line}
                </div>
              ))
            )}
            {/* Auto-scroll target */}
            <div id="terminal-end"></div>
          </div>

          {/* Input Area */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
              placeholder="Enter input here..."
              className={`flex-1 p-3 rounded-md border ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-orange-500 outline-none transition-all`}
            />
            <button
              onClick={handleInputSubmit}
              className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors shadow-lg">
              Submit
            </button>
          </div>

          <p className="mt-4 text-sm opacity-60">
            Type your input and press Enter or click Submit.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProgramSimulator;
