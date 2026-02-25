import { useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  User,
  GraduationCap,
  MapPin,
  Code2,
  Copy,
  Check,
  Trophy,
} from "lucide-react";

const colorClasses: Record<string, string> = {
  orange: "bg-orange-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
};

export const AboutView = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  return (
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
                  Hello! I'm a passionate developer currently pursuing my B.E.
                  in Computer Science & Business Systems at{" "}
                  <strong className="text-gray-900 dark:text-white">
                    KSSEM (K.S. School of Engineering and Management)
                  </strong>
                  , Bengaluru.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  My journey in tech is driven by an insatiable curiosity for
                  how things work under the hood. I built{" "}
                  <strong className="text-gray-900 dark:text-white">
                    DSA Study Hub
                  </strong>{" "}
                  to bridge the gap between complex algorithms and intuitive
                  learning. Whether it's pathfinding visualizations or dynamic
                  programming breakdowns, I believe technology should make
                  learning accessible and engaging for everyone.
                </p>
                <div className="pt-2">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Professional Background
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    Dedicated to bridging the gap between theoretical computer
                    science and practical software implementation. My focus lies
                    in developing efficient algorithms and making complex data
                    structures intuitive for the next generation of engineers.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Currently pursuing specialized research in Computer Science
                    and Business Systems, focusing on the intersection of
                    algorithmic efficiency and enterprise scalability.
                  </p>
                </div>
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
                      className={`h-full ${colorClasses[skill.color] || "bg-orange-500"} transition-all duration-1000`}
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
                  href="mailto:pranavarun19@gmail.com"
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
  );
};
