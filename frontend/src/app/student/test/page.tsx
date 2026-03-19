"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { testAPI } from "@/lib/api";
import { Question } from "@/types";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertTriangle,
  Clock,
  Maximize,
} from "lucide-react";

export default function TakeTestPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testId, setTestId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Start test ──
  useEffect(() => {
    startTest();
  }, []);

  const startTest = async () => {
    try {
      const res = await testAPI.start();
      const data = res.data.data;

      if (data.questions) {
        setQuestions(data.questions);
        setTestId(data.testId);
      } else {
        setTestId(data._id);
        if (data.answers) {
          const restored: Record<string, string> = {};
          Object.entries(data.answers).forEach(([k, v]) => {
            restored[k] = v as string;
          });
          setAnswers(restored);
        }
        const { questionAPI } = await import("@/lib/api");
        const qRes = await questionAPI.getAll();
        setQuestions(qRes.data.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start test");
    } finally {
      setLoading(false);
    }
  };

  // ── Fullscreen management ──
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen not supported
    }
  }, []);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      enterFullscreen();
    }
  }, [loading, questions.length, enterFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (!isFull && !loading && questions.length > 0) {
        setShowResumeModal(true);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [loading, questions.length]);

  // ── Anti-cheat measures ──
  useEffect(() => {
    if (loading || questions.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F5, F11, F12
      if (["F5", "F11", "F12"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // Block Escape
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      // Block Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        const blocked = [
          "c", "v", "a", "u", "s", "p", "f", "g", "h", "j", "r",
        ];
        if (blocked.includes(e.key.toLowerCase())) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error("Please do not switch tabs during the test!", { id: "tab-switch" });
      }
    };

    const handleCopyPaste = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
    };
  }, [loading, questions.length]);

  // ── Handlers ──
  const handleAnswer = (questionId: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
  };

  const goToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setVisited((prev) => new Set(prev).add(idx));
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      toast.error(`Please answer all questions. ${unanswered} remaining.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await testAPI.submit(testId, answers);
      // Exit fullscreen
      if (document.fullscreenElement) {
        await document.exitFullscreen().catch(() => {});
      }
      toast.success("Test submitted successfully!");
      const resultId = res.data.data?.testId;
      if (resultId) {
        router.push(`/student/results/${resultId}`);
      } else {
        router.push("/student/results");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResumeFullscreen = async () => {
    setShowResumeModal(false);
    await enterFullscreen();
  };

  // ── Derived data ──
  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered === questions.length;
  const currentQuestion = questions[currentIndex];

  // Group questions by part for navigator
  const partMap = new Map<number, { name: string; questions: { q: Question; globalIndex: number }[] }>();
  questions.forEach((q, idx) => {
    if (!partMap.has(q.partNumber)) {
      partMap.set(q.partNumber, { name: q.partName, questions: [] });
    }
    partMap.get(q.partNumber)!.questions.push({ q, globalIndex: idx });
  });
  const parts = Array.from(partMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([num, val]) => ({ num, ...val }));

  // Question circle color logic
  const getCircleColor = (idx: number, q: Question) => {
    if (idx === currentIndex) return "bg-blue-600 text-white ring-2 ring-blue-300"; // current
    if (answers[q._id]) return "bg-green-500 text-white"; // answered
    if (visited.has(idx)) return "bg-red-400 text-white"; // visited, not answered
    return "bg-gray-200 text-gray-600"; // not visited
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-[9999]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your test...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-[9999]">
        <div className="text-center">
          <AlertTriangle size={40} className="text-amber-500 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-lg">No questions available</p>
          <p className="text-gray-500 text-sm mt-1">Please contact your administrator.</p>
          <button
            onClick={() => router.push("/student/dashboard")}
            className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-gray-50 flex flex-col select-none"
      style={{ userSelect: "none" }}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* ═══════════ TOP HEADER BAR ═══════════ */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/career-compass-logo.png"
            alt="Career Compass"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
          <div className="border-l border-gray-200 pl-4">
            <h1 className="text-base font-bold text-gray-900">
              Career Compass
            </h1>
            <p className="text-xs text-gray-500">
              Answer all {questions.length} questions — every question is compulsory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* No Time Limit badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl">
            <Clock size={14} className="text-green-600" />
            <span className="text-xs font-semibold text-green-700">No Time Limit</span>
          </div>

          {/* Progress count */}
          <div className="text-sm font-medium text-gray-600">
            <span className="text-blue-600 font-bold">{totalAnswered}</span>
            <span className="text-gray-400"> / {questions.length}</span>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !allAnswered}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              allAnswered
                ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Submit Test
          </button>
        </div>
      </header>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── Question Area ── */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto">
          <div className="w-full">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500 font-medium mb-6">
              Part {currentQuestion.partNumber}: {currentQuestion.partName}
              <span className="text-gray-300 mx-2">·</span>
              Question {currentIndex + 1} of {questions.length}
            </p>

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
              <div className="flex items-start gap-4 mb-8">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {currentIndex + 1}
                </span>
                <p className="text-lg text-gray-800 leading-relaxed font-medium pt-1.5">
                  {currentQuestion.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion._id] === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswer(currentQuestion._id, opt.label)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-blue-800" : "text-gray-700"
                        }`}
                      >
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-gray-400 font-medium">
                Question {currentIndex + 1} of {questions.length}
              </span>

              <button
                onClick={goNext}
                disabled={currentIndex === questions.length - 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>

        {/* ── Question Navigator Sidebar ── */}
        <aside className="w-96 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Question Navigator
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {parts.map((part) => {
              const partColors = [
                "text-blue-600",
                "text-green-600",
                "text-purple-600",
                "text-amber-600",
                "text-rose-600",
              ];
              const color = partColors[(part.num - 1) % partColors.length];
              return (
                <div key={part.num}>
                  <p className={`text-xs font-bold mb-3 ${color}`}>
                    Part {part.num}: {part.name}
                  </p>
                  <div className="grid grid-cols-6 gap-2">
                    {part.questions.map(({ q, globalIndex }) => (
                      <button
                        key={q._id}
                        onClick={() => goToQuestion(globalIndex)}
                        className={`w-10 h-10 rounded-full text-xs font-bold transition-all cursor-pointer ${getCircleColor(
                          globalIndex,
                          q
                        )}`}
                        title={`Q${globalIndex + 1}`}
                      >
                        {globalIndex + 1}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-5 py-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-gray-200 flex-shrink-0" />
              <span className="text-xs text-gray-500">Not visited</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-green-500 flex-shrink-0" />
              <span className="text-xs text-gray-500">Visited &amp; answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-400 flex-shrink-0" />
              <span className="text-xs text-gray-500">Visited, not answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="text-xs text-gray-500">Current</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ═══════════ BOTTOM BAR ═══════════ */}
      {!allAnswered && (
        <div className="flex-shrink-0 bg-amber-50 border-t border-amber-200 px-6 py-2.5 flex items-center justify-center gap-2">
          <AlertTriangle size={14} className="text-amber-600" />
          <span className="text-xs font-medium text-amber-700">
            {questions.length - totalAnswered} question{questions.length - totalAnswered !== 1 ? "s" : ""} remaining
          </span>
        </div>
      )}

      {/* ═══════════ RESUME FULLSCREEN MODAL ═══════════ */}
      {showResumeModal && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Test Paused</h2>
            <p className="text-sm text-gray-500 mb-6">
              You exited fullscreen mode. Please resume to continue your test.
            </p>
            <button
              onClick={handleResumeFullscreen}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition cursor-pointer"
            >
              <Maximize size={16} />
              Resume Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
