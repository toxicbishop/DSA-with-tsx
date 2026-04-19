import { describe, it, expect } from "vitest";
import { quizzesData } from "../data/quizzes";

describe("quizzes data integrity", () => {
  it("has quiz data for at least one program", () => {
    const keys = Object.keys(quizzesData);
    expect(keys.length).toBeGreaterThan(0);
  });

  it("each quiz question has required fields", () => {
    for (const [programId, questions] of Object.entries(quizzesData)) {
      for (const q of questions) {
        expect(q.id, `${programId}: missing id`).toBeTruthy();
        expect(q.question, `${programId}/${q.id}: missing question`).toBeTruthy();
        expect(q.options.length, `${programId}/${q.id}: needs options`).toBeGreaterThanOrEqual(2);
        expect(q.correctAnswerIndex, `${programId}/${q.id}: invalid answer index`).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
        expect(q.explanation, `${programId}/${q.id}: missing explanation`).toBeTruthy();
      }
    }
  });

  it("each quiz has unique question IDs", () => {
    for (const [programId, questions] of Object.entries(quizzesData)) {
      const ids = questions.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size, `${programId}: duplicate question IDs`).toBe(ids.length);
    }
  });
});
