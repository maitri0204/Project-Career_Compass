"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminTestAPI } from "@/lib/api";
import { TestResult } from "@/types";
import { FileText, ArrowRight, Calendar, ArrowLeft } from "lucide-react";

interface Student {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
}

const PERSONALITY_NAMES: Record<string, string> = {
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

export default function AdminStudentResultsPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [results, setResults] = useState<TestResult[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const fetchResults = async () => {
    try {
      const res = await adminTestAPI.getStudentResults(studentId);
      const data: TestResult[] = res.data.data || [];
      setResults(data);
      // Extract student info from first result if available
      if (data.length > 0 && typeof data[0].student === "object") {
        setStudent(data[0].student as Student);
      } else {
        // Fetch student list to get name
        const studentsRes = await adminTestAPI.getStudents();
        const found = (studentsRes.data.data || []).find(
          (s: Student) => s._id === studentId
        );
        if (found) setStudent(found);
      }
    } catch (error) {
      console.error("Failed to fetch student results:", error);
    } finally {
      setLoading(false);
    }
  };

  const studentName = student
    ? [student.firstName, student.middleName, student.lastName]
        .filter(Boolean)
        .join(" ")
    : "Student";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {studentName}&apos;s Test Results
        </h1>
        {student?.email && (
          <p className="text-gray-500 text-sm mt-0.5">{student.email}</p>
        )}
        <p className="text-gray-400 text-sm mt-1">
          {results.length} completed test{results.length !== 1 ? "s" : ""}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <FileText
            size={48}
            className="mx-auto text-gray-300 mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            No Results Yet
          </h2>
          <p className="text-sm text-gray-400">
            This student hasn&apos;t completed any tests yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result, index) => (
            <div
              key={result._id}
              onClick={() =>
                router.push(
                  `/admin/students/${studentId}/results/${result._id}`
                )
              }
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                  Attempt #{results.length - index}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Personality Type:{" "}
                <span className="text-blue-600">
                  {PERSONALITY_NAMES[result.personalityType || ""] || result.personalityType || "Unknown"}
                </span>
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                <Calendar size={12} />
                <span>
                  {new Date(result.submittedAt || "").toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-blue-500 font-medium mt-3 group-hover:gap-2 transition-all">
                View Analysis <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
