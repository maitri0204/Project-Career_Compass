import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "../models/Question";

dotenv.config();

const personalityQuestions = [
  // Part 1: Extraversion (E) vs Introversion (I) - 15 questions
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 1,
    questionText: "At a party, you tend to:",
    options: [
      { label: "A", text: "Talk to many people, including strangers" },
      { label: "B", text: "Talk mostly to people you already know" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 2,
    questionText: "You feel more energized after:",
    options: [
      { label: "A", text: "Being around a group of people" },
      { label: "B", text: "Spending time alone or with one close friend" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 3,
    questionText: "When learning something new, you prefer:",
    options: [
      { label: "A", text: "Group discussions and activities" },
      { label: "B", text: "Reading or studying on your own" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 4,
    questionText: "People would describe you as:",
    options: [
      { label: "A", text: "Outgoing and enthusiastic" },
      { label: "B", text: "Reserved and thoughtful" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 5,
    questionText: "In a group project, you tend to:",
    options: [
      { label: "A", text: "Take the lead and coordinate with others" },
      { label: "B", text: "Contribute independently and share when ready" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 6,
    questionText: "You prefer working in:",
    options: [
      { label: "A", text: "An open, bustling environment" },
      { label: "B", text: "A quiet, private space" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 7,
    questionText: "When meeting someone new, you:",
    options: [
      { label: "A", text: "Easily start and carry the conversation" },
      { label: "B", text: "Wait for the other person to initiate" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 8,
    questionText: "Your ideal weekend involves:",
    options: [
      { label: "A", text: "Going out with friends or attending events" },
      { label: "B", text: "Relaxing at home with a book or hobby" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 9,
    questionText: "In conversations, you tend to:",
    options: [
      { label: "A", text: "Think out loud and talk things through" },
      { label: "B", text: "Reflect before speaking" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 10,
    questionText: "You are more comfortable:",
    options: [
      { label: "A", text: "Being the center of attention" },
      { label: "B", text: "Observing from the sidelines" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 11,
    questionText: "When stressed, you prefer to:",
    options: [
      { label: "A", text: "Talk it out with friends" },
      { label: "B", text: "Process your feelings internally" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 12,
    questionText: "You find phone calls:",
    options: [
      { label: "A", text: "Enjoyable and easy" },
      { label: "B", text: "Something you'd rather avoid when possible" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 13,
    questionText: "You tend to have:",
    options: [
      { label: "A", text: "A wide circle of friends and acquaintances" },
      { label: "B", text: "A few deep, close friendships" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 14,
    questionText: "At work or school, you prefer:",
    options: [
      { label: "A", text: "Brainstorming in a group setting" },
      { label: "B", text: "Working through ideas on your own first" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 1,
    partName: "Extraversion (E) vs Introversion (I)",
    questionNumber: 15,
    questionText: "After a long day of socializing, you feel:",
    options: [
      { label: "A", text: "Excited and energized" },
      { label: "B", text: "Drained and in need of quiet time" },
    ],
    correctAnswer: "",
  },

  // Part 2: Sensing (S) vs Intuition (N) - 15 questions
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 1,
    questionText: "You trust more:",
    options: [
      { label: "A", text: "Your direct experience and observations" },
      { label: "B", text: "Your gut feeling and hunches" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 2,
    questionText: "When reading, you prefer:",
    options: [
      { label: "A", text: "Literal, factual content" },
      { label: "B", text: "Metaphorical or symbolic stories" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 3,
    questionText: "You are more interested in:",
    options: [
      { label: "A", text: "What is real and actual" },
      { label: "B", text: "What is possible and imaginative" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 4,
    questionText: "In conversations, you tend to focus on:",
    options: [
      { label: "A", text: "Specific facts and details" },
      { label: "B", text: "The bigger picture and patterns" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 5,
    questionText: "You prefer instructions that are:",
    options: [
      { label: "A", text: "Step-by-step and detailed" },
      { label: "B", text: "General and open to interpretation" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 6,
    questionText: "You find it easier to remember:",
    options: [
      { label: "A", text: "Specific facts and data" },
      { label: "B", text: "Concepts and connections between ideas" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 7,
    questionText: "When solving problems, you rely on:",
    options: [
      { label: "A", text: "Proven methods and past experience" },
      { label: "B", text: "New ideas and creative approaches" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 8,
    questionText: "You are more drawn to:",
    options: [
      { label: "A", text: "Practical, hands-on activities" },
      { label: "B", text: "Theoretical discussions and brainstorming" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 9,
    questionText: "When planning a trip, you:",
    options: [
      { label: "A", text: "Plan every detail in advance" },
      { label: "B", text: "Prefer to be spontaneous and explore" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 10,
    questionText: "You prefer working with:",
    options: [
      { label: "A", text: "Concrete data and evidence" },
      { label: "B", text: "Abstract theories and possibilities" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 11,
    questionText: "In a new situation, you first notice:",
    options: [
      { label: "A", text: "The specific details of your surroundings" },
      { label: "B", text: "The overall atmosphere and mood" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 12,
    questionText: "You prefer a teacher or boss who:",
    options: [
      { label: "A", text: "Gives clear, detailed directions" },
      { label: "B", text: "Outlines the big picture and lets you figure out the details" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 13,
    questionText: "You tend to describe yourself as:",
    options: [
      { label: "A", text: "Realistic and grounded" },
      { label: "B", text: "Imaginative and visionary" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 14,
    questionText: "When learning something new, you prefer:",
    options: [
      { label: "A", text: "Hands-on practice and examples" },
      { label: "B", text: "Understanding the underlying theory first" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 2,
    partName: "Sensing (S) vs Intuition (N)",
    questionNumber: 15,
    questionText: "You would rather be praised for:",
    options: [
      { label: "A", text: "Being practical and efficient" },
      { label: "B", text: "Being innovative and original" },
    ],
    correctAnswer: "",
  },

  // Part 3: Thinking (T) vs Feeling (F) - 15 questions
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 1,
    questionText: "When making decisions, you tend to:",
    options: [
      { label: "A", text: "Analyze pros and cons logically" },
      { label: "B", text: "Consider how it will affect people's feelings" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 2,
    questionText: "In an argument, you value:",
    options: [
      { label: "A", text: "Being right and logical" },
      { label: "B", text: "Maintaining harmony and understanding" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 3,
    questionText: "You think it's more important to be:",
    options: [
      { label: "A", text: "Truthful, even if it hurts" },
      { label: "B", text: "Tactful, even if it stretches the truth" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 4,
    questionText: "Others might see you as:",
    options: [
      { label: "A", text: "Firm and fair" },
      { label: "B", text: "Warm and compassionate" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 5,
    questionText: "When giving feedback, you focus on:",
    options: [
      { label: "A", text: "What needs improvement objectively" },
      { label: "B", text: "Encouraging and supporting the person" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 6,
    questionText: "You admire people who are:",
    options: [
      { label: "A", text: "Logical and consistent" },
      { label: "B", text: "Caring and empathetic" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 7,
    questionText: "In a team conflict, you would:",
    options: [
      { label: "A", text: "Look at the facts and apply rules fairly" },
      { label: "B", text: "Try to understand everyone's feelings and mediate" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 8,
    questionText: "You are more motivated by:",
    options: [
      { label: "A", text: "Achievement and competence" },
      { label: "B", text: "Appreciation and recognition from others" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 9,
    questionText: "When a friend shares a problem, you:",
    options: [
      { label: "A", text: "Offer solutions and advice" },
      { label: "B", text: "Listen and empathize first" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 10,
    questionText: "You prefer decisions to be based on:",
    options: [
      { label: "A", text: "Objective criteria and standards" },
      { label: "B", text: "Personal values and impact on people" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 11,
    questionText: "You are more likely to:",
    options: [
      { label: "A", text: "Question and challenge ideas" },
      { label: "B", text: "Accept and support others' viewpoints" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 12,
    questionText: "In a negotiation, you tend to be:",
    options: [
      { label: "A", text: "Firm and direct" },
      { label: "B", text: "Accommodating and considerate" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 13,
    questionText: "You believe justice should be:",
    options: [
      { label: "A", text: "Blind and impartial" },
      { label: "B", text: "Merciful and considerate of circumstances" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 14,
    questionText: "In relationships, you value:",
    options: [
      { label: "A", text: "Honesty and intellectual connection" },
      { label: "B", text: "Emotional support and understanding" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 3,
    partName: "Thinking (T) vs Feeling (F)",
    questionNumber: 15,
    questionText: "You find it easier to:",
    options: [
      { label: "A", text: "Criticize and point out flaws" },
      { label: "B", text: "Compliment and point out strengths" },
    ],
    correctAnswer: "",
  },

  // Part 4: Judging (J) vs Perceiving (P) - 15 questions
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 1,
    questionText: "You prefer your life to be:",
    options: [
      { label: "A", text: "Well-structured and planned" },
      { label: "B", text: "Flexible and spontaneous" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 2,
    questionText: "When it comes to deadlines, you:",
    options: [
      { label: "A", text: "Finish well ahead of time" },
      { label: "B", text: "Often work best under last-minute pressure" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 3,
    questionText: "Your workspace is usually:",
    options: [
      { label: "A", text: "Neat and organized" },
      { label: "B", text: "A bit messy but you know where things are" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 4,
    questionText: "When making plans, you:",
    options: [
      { label: "A", text: "Like to decide and commit early" },
      { label: "B", text: "Prefer to keep options open" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 5,
    questionText: "You feel more comfortable when:",
    options: [
      { label: "A", text: "Things are decided and settled" },
      { label: "B", text: "Things are open and evolving" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 6,
    questionText: "Your approach to rules is:",
    options: [
      { label: "A", text: "Follow them — they exist for a reason" },
      { label: "B", text: "Bend or question them when needed" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 7,
    questionText: "When shopping, you:",
    options: [
      { label: "A", text: "Go with a list and stick to it" },
      { label: "B", text: "Browse around and buy what catches your eye" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 8,
    questionText: "You prefer to:",
    options: [
      { label: "A", text: "Have a daily routine" },
      { label: "B", text: "Go with the flow each day" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 9,
    questionText: "When starting a project, you:",
    options: [
      { label: "A", text: "Create a detailed plan before beginning" },
      { label: "B", text: "Jump in and figure it out as you go" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 10,
    questionText: "You value more:",
    options: [
      { label: "A", text: "Punctuality and reliability" },
      { label: "B", text: "Creativity and adaptability" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 11,
    questionText: "When packing for a trip, you:",
    options: [
      { label: "A", text: "Pack days in advance with a checklist" },
      { label: "B", text: "Throw things together at the last minute" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 12,
    questionText: "You prefer tasks that are:",
    options: [
      { label: "A", text: "Clearly defined with a deadline" },
      { label: "B", text: "Open-ended with room for exploration" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 13,
    questionText: "Change in plans makes you feel:",
    options: [
      { label: "A", text: "Uncomfortable or frustrated" },
      { label: "B", text: "Excited or curious" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 14,
    questionText: "Your to-do lists are:",
    options: [
      { label: "A", text: "Detailed and checked off regularly" },
      { label: "B", text: "Loosely written or rarely made" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 4,
    partName: "Judging (J) vs Perceiving (P)",
    questionNumber: 15,
    questionText: "You tend to make decisions:",
    options: [
      { label: "A", text: "Quickly and confidently" },
      { label: "B", text: "After exploring many options" },
    ],
    correctAnswer: "",
  },

  // Part 5: Mixed / Reflection - 10 questions
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 1,
    questionText: "When facing a tough decision, you rely more on:",
    options: [
      { label: "A", text: "Logic and analysis" },
      { label: "B", text: "Your personal values and feelings" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 2,
    questionText: "At a social event, you prefer:",
    options: [
      { label: "A", text: "Mingling and meeting new people" },
      { label: "B", text: "Having deep conversations with a few" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 3,
    questionText: "Your dream job involves:",
    options: [
      { label: "A", text: "Structured tasks with clear expectations" },
      { label: "B", text: "Creative freedom and varied challenges" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 4,
    questionText: "When giving a presentation, you focus on:",
    options: [
      { label: "A", text: "Data, charts, and facts" },
      { label: "B", text: "Stories, examples, and inspiration" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 5,
    questionText: "You handle stress better by:",
    options: [
      { label: "A", text: "Making a plan and taking action" },
      { label: "B", text: "Going with the flow and adapting" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 6,
    questionText: "You are more comfortable with:",
    options: [
      { label: "A", text: "Facts and certainty" },
      { label: "B", text: "Ideas and possibilities" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 7,
    questionText: "Your friends would say you are:",
    options: [
      { label: "A", text: "Dependable and organized" },
      { label: "B", text: "Spontaneous and fun" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 8,
    questionText: "When learning, you prefer:",
    options: [
      { label: "A", text: "A well-organized curriculum" },
      { label: "B", text: "Exploring topics freely on your own" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 9,
    questionText: "You would rather be known as:",
    options: [
      { label: "A", text: "Smart and capable" },
      { label: "B", text: "Kind and compassionate" },
    ],
    correctAnswer: "",
  },
  {
    testType: "PERSONALITY",
    partNumber: 5,
    partName: "Mixed / Reflection",
    questionNumber: 10,
    questionText: "Overall, you tend to:",
    options: [
      { label: "A", text: "Plan ahead and follow through" },
      { label: "B", text: "Adapt and improvise as you go" },
    ],
    correctAnswer: "",
  },
];

const seedPersonalityQuestions = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI as string;
    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(mongoURI, { dbName: "Career_Compass" });
    console.log("✅ Connected to MongoDB");

    // Delete existing personality questions
    await Question.deleteMany({ testType: "PERSONALITY" });
    console.log("🗑️ Cleared existing personality questions");

    // Insert new questions
    await Question.insertMany(personalityQuestions);
    console.log(`✅ Seeded ${personalityQuestions.length} personality questions`);

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedPersonalityQuestions();
