"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { testAPI } from "@/lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TestResult {
  _id: string;
  status: string;
  personalityType?: string;
  totalScore?: number;
  submittedAt?: string;
  createdAt?: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await testAPI.getMyResults();
      setResults(res.data.data || []);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error("Failed to load results");
      }
    } finally {
      setLoading(false);
    }
  };

  const latestResult = results.find((r) => r.status === "COMPLETED");
  const inProgressTest = results.find((r) => r.status === "IN_PROGRESS");
  const hasCompletedTest = results.some((r) => r.status === "COMPLETED");

  const personalityNames: Record<string, string> = {
    ISTJ: "The Systematic Organizer",
    ISFJ: "The Protective Supporter",
    INFJ: "The Purpose Driven Guide",
    INTJ: "The Master Strategist",
    ISTP: "The Practical Problem Solver",
    ISFP: "The Artist",
    INFP: "The Value Creator",
    INTP: "The Curious",
    ESTP: "The Action Taker",
    ESFP: "The Joyful Performer",
    ENFP: "The Visionary",
    ENTP: "The Entrepreneur",
    ESTJ: "The Strategic Leader",
    ESFJ: "The Community Builder",
    ENFJ: "The Mentor Leader",
    ENTJ: "The Visionary Director",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white overflow-hidden shadow-lg">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || "Student"}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {latestResult
                ? "Check out your personality insights below."
                : "Ready to discover your personality type? Take the MBTI assessment!"}
            </p>
          </div>
          {!hasCompletedTest && (
            <Link
              href="/student/test"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {inProgressTest ? "Continue Test" : "Take Test"}
            </Link>
          )}
        </div>
      </div>

      {/* Latest Result */}
      {latestResult && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Your Latest Result</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your most recent personality assessment</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Personality Type Badge */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 flex flex-col items-center justify-center shadow-sm p-3">
                  <span className="text-base font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-center leading-tight">
                    {personalityNames[latestResult.personalityType || ""] || latestResult.personalityType || "—"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 font-medium">Personality Type</span>
                </div>
              </div>

              {/* Description */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {latestResult.submittedAt
                      ? new Date(latestResult.submittedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                  {latestResult.totalScore !== undefined && (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {latestResult.totalScore}/70 questions answered
                    </span>
                  )}
                </div>
                <Link
                  href={`/student/results/${latestResult._id}`}
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] text-sm"
                >
                  View Full Analysis
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Past Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Past Results</h2>
              <p className="text-sm text-gray-500 mt-0.5">{results.length} assessment(s) taken</p>
            </div>
            <Link
              href="/student/results"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {results.slice(0, 5).map((result) => (
              <div
                key={result._id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    result.status === "COMPLETED"
                      ? "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}>
                    {result.status === "COMPLETED" ? (
                      <span className="text-[10px] font-bold text-blue-700 leading-tight text-center">
                        {(personalityNames[result.personalityType || ""] || result.personalityType || "✓").substring(0, 8)}
                      </span>
                    ) : (
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {result.status === "COMPLETED"
                        ? personalityNames[result.personalityType || ""] || result.personalityType || "—"
                        : "In Progress"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.submittedAt
                        ? new Date(result.submittedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : result.createdAt
                        ? `Started ${new Date(result.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}`
                        : "—"}
                    </p>
                  </div>
                </div>
                <Link
                  href={
                    result.status === "COMPLETED"
                      ? `/student/results/${result._id}`
                      : "/student/test"
                  }
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {result.status === "COMPLETED" ? "View →" : "Continue →"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !hasCompletedTest && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Tests Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Take your first personality assessment to discover your MBTI type and get personalized career insights!
          </p>
          <Link
            href="/student/test"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Your First Test
          </Link>
        </div>
      )}
    </div>
  );
}
