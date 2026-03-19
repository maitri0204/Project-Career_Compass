"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { testAPI } from "@/lib/api";
import { TestResult } from "@/types";
import { FileText, ArrowRight, Calendar, Brain } from "lucide-react";

export default function StudentResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await testAPI.getMyResults();
      setResults(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Results</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          View your personality test results
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center">
          <FileText
            size={48}
            className="mx-auto text-[var(--text-secondary)] opacity-30 mb-4"
          />
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No Results Yet
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Complete the personality test to see your results here.
          </p>
          <button
            onClick={() => router.push("/student/test")}
            className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[var(--primary-light)] transition-colors cursor-pointer"
          >
            Take Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result, index) => (
            <div
              key={result._id}
              onClick={() => router.push(`/student/results/${result._id}`)}
              className="bg-white rounded-xl border border-[var(--border)] p-5 card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                {/* <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-[var(--accent)]">
                    {result.personalityType || "?"}
                  </span>
                </div> */}
                <span className="text-xs text-[var(--text-secondary)] bg-gray-50 px-2.5 py-1 rounded-full">
                  Attempt #{results.length - index}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                Personality Type: {result.personalityType || "Unknown"}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-2">
                <Calendar size={12} />
                <span>
                  {new Date(result.submittedAt || "").toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium mt-3">
                View Analysis <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
