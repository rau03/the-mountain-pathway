import { Step } from "../../types";

export const steps: Step[] = [
  {
    id: 0,
    key: "begin",
    title: "Begin",
    subtitle: "A moment of stillness",
    prompt:
      "Take a few moments of silence to rest in God's presence. When you're ready, begin your journey.",
    isInput: false,
    isTimer: true,
  },
  {
    id: 1,
    key: "reflect",
    title: "Reflect",
    subtitle: "Read and meditate",
    prompt:
      "Read through Psalm 139 slowly and thoughtfully. Let the words settle in your heart.",
    isInput: false,
  },
  {
    id: 2,
    key: "respond",
    title: "Respond",
    subtitle: "Name your focus",
    prompt:
      "What specific issue, situation, or topic would you like to bring before God today?",
    isInput: true,
  },
  {
    id: 3,
    key: "thoughts",
    title: "Thoughts",
    subtitle: "Unpack your mind",
    prompt:
      "What thoughts are present? What truths do you know? What lies might you be believing?",
    isInput: true,
  },
  {
    id: 4,
    key: "emotions",
    title: "Emotions",
    subtitle: "Honor your heart",
    prompt:
      "What emotions are you experiencing? Name the feelings present in your heart and body.",
    isInput: true,
  },
  {
    id: 5,
    key: "desire",
    title: "Desire",
    subtitle: "Voice your longings",
    prompt:
      "What are your deep longings in this situation? What God-given hopes do you carry?",
    isInput: true,
  },
  {
    id: 6,
    key: "pause",
    title: "Pause",
    subtitle: "Invite Jesus in",
    prompt:
      "Take a moment to consciously invite Jesus into this situation. What do you sense Him saying?",
    isInput: true,
  },
  {
    id: 7,
    key: "choices",
    title: "Choices",
    subtitle: "Discern your path",
    prompt:
      "What would be a wise, loving, and faithful next step in this situation?",
    isInput: true,
  },
  {
    id: 8,
    key: "prayer",
    title: "Prayer",
    subtitle: "Offer it all to God",
    prompt:
      "Summarize your entire journey in a prayer to God. Offer Him your thoughts, emotions, desires, and next steps.",
    isInput: true,
    isSummary: true,
  },
];
