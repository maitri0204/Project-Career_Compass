"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { testAPI } from "@/lib/api";
import { TestResult, PersonalityDimension } from "@/types";
import { ArrowLeft, Brain, Calendar, Download, GraduationCap, BookOpen, Briefcase } from "lucide-react";

const DIMENSION_COLORS: Record<string, { a: string; b: string }> = {
  "E/I": { a: "#6c5ce7", b: "#00b894" },
  "S/N": { a: "#e17055", b: "#0984e3" },
  "T/F": { a: "#fdcb6e", b: "#e84393" },
  "J/P": { a: "#00cec9", b: "#d63031" },
};

const PERSONALITY_CAREERS: Record<string, string[]> = {
  ISTJ: ["Chartered Accountant", "Auditor", "Financial Analyst", "Banking Officer", "Data Analyst", "Civil Engineer", "Operations Manager", "Risk Manager", "Compliance Officer", "Government Officer"],
  ISFJ: ["Nurse", "Teacher", "Counselor", "Physiotherapist", "Social Worker", "Occupational Therapist", "Child Development Specialist", "Healthcare Administrator", "Dietitian", "Community Service Manager"],
  INFJ: ["Psychologist", "Counselor", "Author", "Policy Analyst", "Social Entrepreneur", "Human Rights Advocate", "Professor", "NGO Director", "Diplomat", "Life Coach"],
  INTJ: ["Data Scientist", "AI Engineer", "Software Architect", "Investment Strategist", "Research Scientist", "Economist", "Systems Engineer", "Policy Strategist", "Management Consultant", "Cybersecurity Expert"],
  ISTP: ["Mechanical Engineer", "Robotics Engineer", "Pilot", "Automotive Engineer", "Aerospace Engineer", "Drone Operator", "Industrial Technician", "Cybersecurity Specialist", "Systems Engineer", "Technical Consultant"],
  ISFP: ["Graphic Designer", "Fashion Designer", "Photographer", "Animator", "Interior Designer", "Illustrator", "Film Editor", "Art Director", "Product Designer", "Game Artist"],
  INFP: ["Writer", "Screenwriter", "Psychologist", "Creative Director", "Social Worker", "Journalist", "Editor", "Content Strategist", "Therapist", "NGO Program Manager"],
  INTP: ["Research Scientist", "AI Researcher", "Software Developer", "Mathematician", "Data Scientist", "Game Developer", "Philosopher", "Economist", "Systems Architect", "Machine Learning Engineer"],
  ESTP: ["Entrepreneur", "Stock Trader", "Sales Manager", "Business Development Manager", "Event Manager", "Sports Manager", "Operations Manager", "Real Estate Consultant", "Marketing Executive", "Logistics Manager"],
  ESFP: ["Actor", "Event Host", "Public Relations Specialist", "Hospitality Manager", "Influencer", "Travel Consultant", "Brand Promoter", "Media Presenter", "Content Creator", "Tourism Manager"],
  ENFP: ["Marketing Manager", "Brand Strategist", "Startup Founder", "Creative Director", "Journalist", "Advertising Specialist", "Public Speaker", "HR Trainer", "Content Creator", "Social Media Strategist"],
  ENTP: ["Startup Founder", "Product Manager", "Innovation Consultant", "Venture Capital Analyst", "Business Strategist", "Technology Entrepreneur", "Marketing Strategist", "Digital Product Designer", "Management Consultant", "Business Analyst"],
  ESTJ: ["Business Manager", "Corporate Executive", "Chartered Accountant", "Project Manager", "Banking Manager", "Operations Director", "Government Officer", "Supply Chain Manager", "Retail Director", "Finance Manager"],
  ESFJ: ["HR Manager", "Teacher", "Event Planner", "Hospitality Manager", "Community Relations Manager", "School Counselor", "Public Relations Manager", "Training Manager", "Social Worker", "Customer Experience Manager"],
  ENFJ: ["Teacher", "Leadership Coach", "HR Director", "NGO Leader", "Counselor", "Public Speaker", "Social Entrepreneur", "Policy Advocate", "Training Consultant", "Corporate Coach"],
  ENTJ: ["CEO", "Investment Banker", "Management Consultant", "Strategy Director", "Entrepreneur", "Venture Capitalist", "Corporate Lawyer", "Business Analyst", "Finance Director", "Policy Advisor"],
};

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

const LETTER_NAMES: Record<string, string> = {
  E: "Social Orientation",
  I: "Reflective Orientation",
  S: "Practical Observation",
  N: "Conceptual Thinking",
  T: "Logical Decision Style",
  F: "Value-Based Decision Style",
  J: "Structured Working Style",
  P: "Flexible Working Style",
};

const DIMENSION_STYLES: Record<string, string> = {
  "E/I": "Energy Style",
  "S/N": "Cognitive Style",
  "T/F": "Values Style",
  "J/P": "Life Style",
};

const PERSONALITY_STREAMS: Record<string, string> = {
  ISTJ: "Commerce / Science",
  ISFJ: "Arts / Science",
  INFJ: "Arts / Humanities",
  INTJ: "Science / Commerce",
  ISTP: "Science",
  ISFP: "Arts / Humanities",
  INFP: "Arts / Humanities",
  INTP: "Science",
  ESTP: "Commerce / Science",
  ESFP: "Arts / Commerce",
  ENFP: "Arts / Commerce",
  ENTP: "Commerce / Science",
  ESTJ: "Commerce",
  ESFJ: "Arts / Commerce",
  ENFJ: "Arts / Humanities",
  ENTJ: "Commerce / Science",
};

const PERSONALITY_SUBJECTS: Record<string, string[]> = {
  ISTJ: ["Mathematics", "Accountancy", "Economics", "Statistics"],
  ISFJ: ["Biology", "Psychology", "Sociology", "Education"],
  INFJ: ["Psychology", "Literature", "Philosophy", "Sociology"],
  INTJ: ["Mathematics", "Physics", "Computer Science", "Economics"],
  ISTP: ["Physics", "Mathematics", "Computer Science"],
  ISFP: ["Design", "Fine Arts", "Media Studies"],
  INFP: ["Literature", "Psychology", "Philosophy"],
  INTP: ["Mathematics", "Physics", "Computer Science", "Statistics"],
  ESTP: ["Business Studies", "Economics", "Mathematics"],
  ESFP: ["Media Studies", "Communication", "Performing Arts"],
  ENFP: ["Marketing", "Psychology", "Media Studies"],
  ENTP: ["Entrepreneurship", "Economics", "Computer Science"],
  ESTJ: ["Accountancy", "Business Studies", "Economics"],
  ESFJ: ["Psychology", "Sociology", "Communication"],
  ENFJ: ["Psychology", "Political Science", "Literature"],
  ENTJ: ["Economics", "Mathematics", "Business Studies"],
};

export default function ResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) {
      fetchResult(params.id as string);
    }
  }, [params.id]);

  const fetchResult = async (id: string) => {
    try {
      const res = await testAPI.getResult(id);
      setResult(res.data.data);
    } catch (error) {
      console.error("Failed to fetch result:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = 210;
      const pageHeight = 297;

      const loadImage = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const addImagePage = async (src: string) => {
        try {
          const img = await loadImage(src);
          pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
        } catch {
          pdf.setFontSize(14);
          pdf.text("Page content unavailable", pageWidth / 2, pageHeight / 2, { align: "center" });
        }
      };

      const personality = result.personality;
      const pt = result.personalityType || personality?.personalityType || "UNKNOWN";
      const studentObj = typeof result.student === "object" ? result.student : null;
      const studentName = studentObj
        ? [studentObj.firstName, (studentObj as any).middleName, studentObj.lastName].filter(Boolean).join(" ")
        : "—";

      // Page 1 - Cover
      await addImagePage("/1.png");

      // Page 2 - Student Information
      pdf.addPage();
      // Warm cream background
      pdf.setFillColor(255, 251, 244);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      // Orange header bar
      pdf.setFillColor(255, 189, 89);
      pdf.rect(0, 0, pageWidth, 45, "F");
      // Subtle orange stripe at bottom of header
      pdf.setFillColor(230, 168, 48);
      pdf.rect(0, 43, pageWidth, 3, "F");
      pdf.setTextColor(30, 20, 5);
      pdf.setFontSize(30);
      pdf.setFont("helvetica", "bold");
      pdf.text("Student Information", pageWidth / 2, 28, { align: "center" });

      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(20, 60, 170, 165, 6, 6, "F");
      pdf.setDrawColor(255, 189, 89);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(20, 60, 170, 165, 6, 6, "S");
      pdf.setLineWidth(0.2);

      const infoFields = [
        { label: "Student Name", value: studentName },
        { label: "Class / Grade", value: (studentObj as any)?.classGrade || "—" },
        { label: "School Name", value: (studentObj as any)?.schoolName || "—" },
        { label: "Date of Assessment", value: result.submittedAt ? new Date(result.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
        { label: "Counselor Name", value: "Administered by AdmitRA" },
      ];

      let yPos = 80;
      infoFields.forEach((field, idx) => {
        // Left orange accent bar
        pdf.setFillColor(255, 189, 89);
        pdf.rect(27, yPos - 4, 3, 16, "F");
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(160, 120, 60);
        pdf.text(field.label.toUpperCase(), 36, yPos);
        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(20, 20, 20);
        pdf.text(field.value, 36, yPos + 10);
        if (idx < infoFields.length - 1) {
          pdf.setDrawColor(250, 220, 170);
          pdf.line(35, yPos + 16, 178, yPos + 16);
        }
        yPos += 30;
      });

      // Page 3
      pdf.addPage();
      await addImagePage("/3.png");

      // Page 4
      pdf.addPage();
      await addImagePage("/4.png");

      // Page 5
      pdf.addPage();
      await addImagePage("/5.png");

      // Page 6 - Career Pathway (orange theme, visual)
      pdf.addPage();
      // Warm cream background
      pdf.setFillColor(255, 251, 244);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      // Orange header bar
      pdf.setFillColor(255, 189, 89);
      pdf.rect(0, 0, pageWidth, 45, "F");
      pdf.setFillColor(230, 168, 48);
      pdf.rect(0, 43, pageWidth, 3, "F");
      pdf.setTextColor(30, 20, 5);
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.text("Your Career Pathway", pageWidth / 2, 28, { align: "center" });

      // Personality type badge
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(20, 55, 170, 24, 4, 4, "F");
      pdf.setFillColor(255, 189, 89);
      pdf.roundedRect(20, 55, 5, 24, 2, 2, "F");
      pdf.setTextColor(120, 80, 20);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("PERSONALITY TYPE", 32, 63);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 20);
      pdf.text(PERSONALITY_NAMES[pt] || "Unknown Type", 32, 74);

      // Stream & Subjects side by side
      const colW = 80;
      // Stream card
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(20, 90, colW, 38, 4, 4, "F");
      pdf.setFillColor(255, 189, 89);
      pdf.roundedRect(20, 90, 4, 38, 2, 2, "F");
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(150, 100, 20);
      pdf.text("SUGGESTED STREAM", 30, 99);
      pdf.setFontSize(17);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(20, 20, 20);
      pdf.text(PERSONALITY_STREAMS[pt] || "—", 30, 113);
      // Subjects card
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(110, 90, colW, 38, 4, 4, "F");
      pdf.setFillColor(230, 168, 48);
      pdf.roundedRect(110, 90, 4, 38, 2, 2, "F");
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(150, 100, 20);
      pdf.text("SUGGESTED SUBJECTS", 120, 99);
      pdf.setFontSize(13);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(20, 20, 20);
      const subjStr = (PERSONALITY_SUBJECTS[pt] || []).join(", ");
      const subjLines = pdf.splitTextToSize(subjStr, 58);
      pdf.text(subjLines, 120, 109);

      // Top 10 careers in 2-column grid
      const careers6 = PERSONALITY_CAREERS[pt] || [];
      let y6 = 142;
      // Section header
      pdf.setFillColor(255, 189, 89);
      pdf.roundedRect(20, y6 - 2, 170, 14, 3, 3, "F");
      pdf.setTextColor(30, 20, 5);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("TOP 10 RECOMMENDED CAREERS", pageWidth / 2, y6 + 7, { align: "center" });
      y6 += 20;
      const colA = 20;
      const colB = 110;
      careers6.forEach((career, i) => {
        const isLeft = i % 2 === 0;
        const xPos = isLeft ? colA : colB;
        const row = Math.floor(i / 2);
        const yItem = y6 + row * 16;
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(xPos, yItem - 3, colW, 13, 3, 3, "F");
        pdf.setFillColor(255, 189, 89);
        pdf.circle(xPos + 7, yItem + 3, 4, "F");
        pdf.setTextColor(30, 20, 5);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text(String(i + 1), xPos + 7, yItem + 5, { align: "center" });
        pdf.setTextColor(20, 20, 20);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(career, xPos + 14, yItem + 5);
      });

      // Page 7
      pdf.addPage();
      await addImagePage("/7.png");

      pdf.save(`Career_Compass_Report.pdf`);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Result not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 font-medium cursor-pointer hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const personality = result.personality;
  const dimensions = personality?.dimensions || [];
  const personalityType = result.personalityType || personality?.personalityType || "—";
  const description = personality?.description || "";
  const careers = PERSONALITY_CAREERS[personalityType] || [];
  const stream = PERSONALITY_STREAMS[personalityType] || "—";
  const subjects = PERSONALITY_SUBJECTS[personalityType] || [];

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Results
      </button>

      {/* Personality Type Card */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Brain size={40} className="text-white opacity-80" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/80 uppercase tracking-widest font-bold mb-1">Your Personality Type</p>
            <h1 className="text-3xl font-black text-white drop-shadow-sm">
              {PERSONALITY_NAMES[personalityType] || personalityType}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-white/80 font-semibold">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(result.submittedAt || "").toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Brain size={12} />
                {personality?.totalAnswered || 0} questions answered
              </span>
            </div>
          </div>
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl border border-white/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={16} />
            {downloading ? "Generating..." : "Download Report"}
          </button>
        </div>
      </div>

      {/* MBTI Visual Personality Diagram */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 mb-6">
        <div className="text-center mb-10">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Personality Profile</h2>
          <p className="text-lg font-bold text-gray-600 mt-2">{PERSONALITY_NAMES[personalityType]}</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {dimensions.map((dim) => {
            const styleLabel = DIMENSION_STYLES[dim.pair] || "";
            const col = DIMENSION_COLORS[dim.pair] || { a: "#6c5ce7", b: "#00b894" };
            const aWins = dim.winner === dim.letterA;
            return (
              <div key={dim.pair} className="flex flex-col items-center border-r border-gray-100 last:border-r-0 px-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6 text-center">
                  {styleLabel}
                </span>
                <span className="text-lg font-black mb-3" style={{ color: col.a }}>
                  {dim.percentA}%
                </span>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
                  style={{
                    backgroundColor: aWins ? col.a : `${col.a}15`,
                    color: aWins ? "white" : col.a,
                    boxShadow: aWins ? `0 6px 20px ${col.a}40` : "none",
                  }}
                >
                  {dim.letterA}
                </div>
                <div className="my-3 text-2xl font-bold" style={{ color: `${col.a}40` }}>↕</div>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black"
                  style={{
                    backgroundColor: !aWins ? col.b : `${col.b}15`,
                    color: !aWins ? "white" : col.b,
                    boxShadow: !aWins ? `0 6px 20px ${col.b}40` : "none",
                  }}
                >
                  {dim.letterB}
                </div>
                <span className="text-lg font-black mt-3" style={{ color: col.b }}>
                  {dim.percentB}%
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-center text-sm font-black text-gray-300 uppercase tracking-[0.3em] mt-10">Personality Type</p>
      </div>

      {/* Description */}
      {description && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-2">About This Personality</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Dimension Breakdown */}
      {dimensions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Dimension Breakdown</h2>
          <div className="space-y-4">
            {dimensions.map((dim: PersonalityDimension) => {
              const col = DIMENSION_COLORS[dim.pair] || { a: "#6c5ce7", b: "#00b894" };
              const aWins = dim.winner === dim.letterA;
              return (
                <div key={dim.pair}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span style={{ color: col.a }}>
                      {dim.letterA} — {LETTER_NAMES[dim.letterA] || dim.nameA}
                    </span>
                    <span style={{ color: col.b }}>
                      {LETTER_NAMES[dim.letterB] || dim.nameB} — {dim.letterB}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${dim.percentA}%`, backgroundColor: col.a }}
                    />
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${dim.percentB}%`, backgroundColor: col.b }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{dim.percentA}%</span>
                    <span>{aWins ? dim.letterA : dim.letterB} wins</span>
                    <span>{dim.percentB}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Career Pathway — Beautiful Combined Section */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-amber-100">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Your Career Pathway</h2>
            <p className="text-sm text-amber-100 mt-0.5">
              Tailored for {PERSONALITY_NAMES[personalityType] || personalityType}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Briefcase size={22} className="text-white" />
          </div>
        </div>

        {/* Stream + Subjects Row */}
        <div className="bg-white grid grid-cols-2 divide-x divide-amber-50">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <GraduationCap size={14} className="text-amber-600" />
              </div>
              <span className="text-xs font-black text-gray-500 uppercase tracking-[0.15em]">Suggested Stream</span>
            </div>
            <p className="text-2xl font-black text-gray-800 mt-1">{stream}</p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <BookOpen size={14} className="text-orange-500" />
              </div>
              <span className="text-xs font-black text-gray-500 uppercase tracking-[0.15em]">Suggested Subjects</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {subjects.map((sub) => (
                <span key={sub} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-100">  
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Top 10 Careers Grid */}
        {careers.length > 0 && (
          <div className="bg-gradient-to-b from-orange-50/60 to-amber-50/30 p-5 border-t border-amber-100">
            <p className="text-sm font-black text-gray-600 uppercase tracking-[0.15em] mb-3">Top 10 Recommended Careers</p>
            <div className="grid grid-cols-2 gap-2">
              {careers.map((career, i) => (
                <div
                  key={career}
                  className="flex items-center gap-3 bg-white rounded-xl px-3.5 py-3 border border-amber-100/70 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-200 group"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-black text-white flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200">
                    {i + 1}
                  </span>
                  <span className="text-base font-semibold text-gray-800">{career}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
