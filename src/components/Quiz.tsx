import React, { useState } from "react";
import { quizzesData } from "../data/quizzes";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

interface QuizProps {
  programId: string;
  darkMode: boolean;
}

export const Quiz: React.FC<QuizProps> = ({ programId, darkMode }) => {
  const quizQuestions = quizzesData[programId] || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (quizQuestions.length === 0) {
    return null; // Return null if there are no quizzes for this program
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    let currentScore = 0;
    quizQuestions.forEach((q, index) => {
      if (selectedOptions[index] === q.correctAnswerIndex) {
        currentScore++;
      }
    });
    setScore(currentScore);
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setIsSubmitted(false);
    setScore(0);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const hasSelectedOption = selectedOptions[currentQuestionIndex] !== undefined;

  return (
    <div
      className={`mt-10 p-6 rounded-xl border transition-all shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="text-orange-500" size={24} />
        <h3
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          Knowledge Check
        </h3>
      </div>

      {!isSubmitted ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-sm font-semibold tracking-wide uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </span>
          </div>

          <p
            className={`text-lg font-medium mb-6 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            {currentQuestion.question}
          </p>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all font-medium ${
                  selectedOptions[currentQuestionIndex] === idx
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-500/50 " +
                      (darkMode ? "text-gray-300" : "text-gray-700")
                }`}>
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed text-gray-400" : "text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10"}`}>
              Previous
            </button>

            {currentQuestionIndex === quizQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={
                  Object.keys(selectedOptions).length !== quizQuestions.length
                }
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                Submit Answers
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!hasSelectedOption}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in text-center py-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-500/20 mb-6">
            <span className="text-3xl font-bold text-orange-500">
              {score}/{quizQuestions.length}
            </span>
          </div>
          <h4
            className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Quiz Completed!
          </h4>
          <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {score === quizQuestions.length
              ? "Perfect score! Outstanding job."
              : "Great effort! Learn from the explanations below."}
          </p>

          <div className="space-y-6 text-left w-full mb-8">
            {quizQuestions.map((q, idx) => {
              const userAns = selectedOptions[idx];
              const isCorrect = userAns === q.correctAnswerIndex;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"}`}>
                  <p
                    className={`font-semibold mb-3 flex items-start gap-2 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                    <span className="mt-1">
                      {isCorrect ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <XCircle className="text-red-500" size={18} />
                      )}
                    </span>
                    <span>
                      {idx + 1}. {q.question}
                    </span>
                  </p>
                  <div className="ml-7 space-y-2 text-sm">
                    <p
                      className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Your Answer:{" "}
                      <span
                        className={`font-semibold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                        {q.options[userAns]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p
                        className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Correct Answer:{" "}
                        <span className="font-semibold text-green-500">
                          {q.options[q.correctAnswerIndex]}
                        </span>
                      </p>
                    )}
                    <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      <strong className="font-semibold">Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleReset}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20">
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};
