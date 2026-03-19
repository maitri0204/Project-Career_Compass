"use client";

import { useEffect, useState } from "react";
import { questionAPI } from "@/lib/api";
import { Question } from "@/types";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
} from "lucide-react";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 1,
    questionText: "",
    optionA: "",
    optionB: "",
  });
  const [saving, setSaving] = useState(false);

  const partNames: Record<number, string> = {
    1: "Extraversion (E) vs Introversion (I)",
    2: "Sensing (S) vs Intuition (N)",
    3: "Thinking (T) vs Feeling (F)",
    4: "Judging (J) vs Perceiving (P)",
    5: "Mixed / Reflection",
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await questionAPI.getAll();
      setQuestions(res.data.data || []);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Group questions by part
  const partMap = new Map<number, { name: string; questions: Question[] }>();
  questions.forEach((q) => {
    if (!partMap.has(q.partNumber)) {
      partMap.set(q.partNumber, { name: q.partName, questions: [] });
    }
    partMap.get(q.partNumber)!.questions.push(q);
  });
  const parts = Array.from(partMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([num, val]) => ({ num, ...val }));

  const activePart = parts.find((p) => p.num === activeTab) || parts[0];
  const partQuestions =
    activePart?.questions?.sort((a, b) => a.questionNumber - b.questionNumber) || [];

  const openAdd = () => {
    setEditingQuestion(null);
    setFormData({
      partNumber: activePart?.num || 1,
      partName: partNames[activePart?.num || 1],
      questionNumber: (activePart?.questions?.length || 0) + 1,
      questionText: "",
      optionA: "",
      optionB: "",
    });
    setShowModal(true);
  };

  const openEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      partNumber: q.partNumber,
      partName: q.partName,
      questionNumber: q.questionNumber,
      questionText: q.questionText,
      optionA: q.options[0]?.text || "",
      optionB: q.options[1]?.text || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.questionText.trim() || !formData.optionA.trim() || !formData.optionB.trim()) {
      return toast.error("All fields are required");
    }

    setSaving(true);
    try {
      const payload = {
        partNumber: formData.partNumber,
        partName: formData.partName,
        questionNumber: formData.questionNumber,
        questionText: formData.questionText,
        options: [
          { label: "A", text: formData.optionA },
          { label: "B", text: formData.optionB },
        ],
        correctAnswer: "",
      };

      if (editingQuestion) {
        await questionAPI.update(editingQuestion._id, payload);
        toast.success("Question updated!");
      } else {
        await questionAPI.create(payload);
        toast.success("Question created!");
      }

      setShowModal(false);
      fetchQuestions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save question");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await questionAPI.delete(id);
      toast.success("Question deleted");
      fetchQuestions();
    } catch {
      toast.error("Failed to delete");
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
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personality Questions</h1>
          <p className="text-gray-500 text-sm mt-1">
            {questions.length} questions across {parts.length} parts
          </p>
        </div>
      </div>

      {/* Main card with tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Horizontal Part Tabs (scrollable) */}
        {parts.length > 0 && (
          <div className="border-b border-gray-200 bg-white flex-shrink-0">
            <nav className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {parts.map((part) => {
                const isActive = activePart?.num === part.num;
                return (
                  <button
                    key={part.num}
                    onClick={() => setActiveTab(part.num)}
                    className={`relative flex-shrink-0 flex flex-col items-center gap-1 px-6 py-3.5 text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-t-full bg-blue-600" />
                    )}
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${
                          isActive ? "bg-blue-600" : "bg-blue-400"
                        }`}
                      >
                        P{part.num}
                      </span>
                      <span className={isActive ? "font-semibold" : ""}>
                        {part.name}
                      </span>
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {part.questions.length} Qs
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900">
              {activePart
                ? `Part ${activePart.num}: ${activePart.name}`
                : "No questions yet"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {partQuestions.length} question{partQuestions.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl transition hover:bg-blue-700 cursor-pointer"
          >
            <Plus size={16} />
            Add Question
          </button>
        </div>

        {/* Questions list (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {partQuestions.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-16">
              No questions in this part yet.
            </p>
          )}
          {partQuestions.map((q) => (
            <div
              key={q._id}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition group"
            >
              <div className="flex items-start gap-3">
                {/* Question number badge */}
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                  {q.questionNumber}
                </span>
                {/* Question content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 leading-relaxed font-medium">
                    {q.questionText}
                  </p>
                  {/* Options row */}
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {q.options.map((opt) => (
                      <span
                        key={opt.label}
                        className="text-xs px-2.5 py-1 rounded-lg border bg-white text-gray-600 border-gray-200"
                      >
                        <strong>{opt.label}.</strong> {opt.text}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEdit(q)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition cursor-pointer"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ Add/Edit Modal ═══════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {editingQuestion ? <Pencil size={16} /> : <Plus size={16} />}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </h2>
                  <p className="text-sm text-gray-500">Personality Assessment</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Part
                  </label>
                  <select
                    value={formData.partNumber}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      setFormData((f) => ({
                        ...f,
                        partNumber: num,
                        partName: partNames[num],
                      }));
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        Part {n}: {partNames[n]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Question #
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.questionNumber}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, questionNumber: Number(e.target.value) }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Question Text
                </label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData((f) => ({ ...f, questionText: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter the question text..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Option A
                </label>
                <input
                  type="text"
                  value={formData.optionA}
                  onChange={(e) => setFormData((f) => ({ ...f, optionA: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option A..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Option B
                </label>
                <input
                  type="text"
                  value={formData.optionB}
                  onChange={(e) => setFormData((f) => ({ ...f, optionB: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter option B..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {editingQuestion ? "Save Changes" : "Add Question"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
