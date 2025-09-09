// src/lib/pathway-data.ts

export interface PathwayStep {
  stepIndex: number;
  stageName: string;
  title: string;
  subtitle?: string;
  type: "landing" | "timer" | "reflection" | "input" | "summary";
  prompt: string;
  content?: {
    scripture?: string;
    instructions?: string;
    specialMessage?: string;
  };
  isInput: boolean;
  isTimer?: boolean;
  isSummary?: boolean;
  key: string;
}

export interface PathwayContent {
  appTitle: string;
  appSubtitle: string;
  appDescription: string;
  landingPage: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    buttonText: string;
    footerText: string;
  };
  summaryPage: {
    title: string;
    subtitle: string;
    completionMessage: string;
    downloadButtonText: string;
    copyButtonText: string;
    copiedText: string;
    newJourneyButtonText: string;
    generatingText: string;
  };
  timerScreen: {
    durationLabel: string;
    beginButtonText: string;
    pauseText: string;
    resumeText: string;
    resetText: string;
    completionMessage: string;
    completionSubtext: string;
  };
  reflectionScreen: {
    instructionText: string;
  };
  navigation: {
    backButtonText: string;
    continueButtonText: string;
    completeButtonText: string;
    stepCounterText: string; // e.g., "Step {current} of {total}"
    journeyCompleteText: string;
  };
  general: {
    characterCountText: string; // e.g., "{count} characters"
    textareaPlaceholder: string;
  };
}

export const pathwayData: PathwayStep[] = [
  {
    stepIndex: 0,
    stageName: "Trailhead",
    title: "Begin",
    subtitle: "A moment of stillness",
    type: "timer",
    prompt:
      "Take a few moments of silence to rest in God's presence. When you're ready, begin your journey.",
    isInput: false,
    isTimer: true,
    key: "begin",
  },
  {
    stepIndex: 1,
    stageName: "Ascent",
    title: "Reflect",
    subtitle: "Read and meditate",
    type: "reflection",
    prompt:
      "Read through Psalm 139 slowly and thoughtfully. Let the words settle in your heart.",
    content: {
      scripture: `O Lord, you have searched me and known me!
You know when I sit down and when I rise up;
you discern my thoughts from afar.
You search out my path and my lying down
and are acquainted with all my ways.
Even before a word is on my tongue,
behold, O Lord, you know it altogether.
You hem me in, behind and before,
and lay your hand upon me.
Such knowledge is too wonderful for me;
it is high; I cannot attain it.

Where shall I go from your Spirit?
Or where shall I flee from your presence?
If I ascend to heaven, you are there!
If I make my bed in Sheol, you are there!
If I take the wings of the morning
and dwell in the uttermost parts of the sea,
even there your hand shall lead me,
and your right hand shall hold me.
If I say, "Surely the darkness shall cover me,
and the light about me be night,"
even the darkness is not dark to you;
the night is bright as the day,
for darkness is as light with you.

For you formed my inward parts;
you knitted me together in my mother's womb.
I praise you, for I am fearfully and wonderfully made.
Wonderful are your works;
my soul knows it very well.
My frame was not hidden from you,
when I was being made in secret,
intricately woven in the depths of the earth.
Your eyes saw my unformed substance;
in your book were written, every one of them,
the days that were formed for me,
when as yet there was none of them.

How precious to me are your thoughts, O God!
How vast is the sum of them!
If I would count them, they are more than the sand.
I awake, and I am still with you.

Search me, O God, and know my heart!
Try me and know my thoughts!
And see if there be any grievous way in me,
and lead me in the way everlasting!

— Psalm 139 (ESV)`,
      instructions: "Take your time. Let the words settle in your heart.",
    },
    isInput: false,
    key: "reflect",
  },
  {
    stepIndex: 2,
    stageName: "Ascent",
    title: "Respond",
    subtitle: "Name your focus",
    type: "input",
    prompt:
      "What specific issue, situation, or topic would you like to bring before God today?",
    isInput: true,
    key: "respond",
  },
  {
    stepIndex: 3,
    stageName: "Overlook",
    title: "Thoughts",
    subtitle: "Unpack your mind",
    type: "input",
    prompt:
      "What thoughts are present? What truths do you know? What lies might you be believing?",
    isInput: true,
    key: "thoughts",
  },
  {
    stepIndex: 4,
    stageName: "Overlook",
    title: "Emotions",
    subtitle: "Honor your heart",
    type: "input",
    prompt:
      "What emotions are you experiencing? Name the feelings present in your heart and body.",
    isInput: true,
    key: "emotions",
  },
  {
    stepIndex: 5,
    stageName: "Summit Path",
    title: "Desire",
    subtitle: "Voice your longings",
    type: "input",
    prompt:
      "What are your deep longings in this situation? What God-given hopes do you carry?",
    isInput: true,
    key: "desire",
  },
  {
    stepIndex: 6,
    stageName: "Summit Path",
    title: "Pause",
    subtitle: "Invite Jesus in",
    type: "input",
    prompt:
      "Take a moment to consciously invite Jesus into this situation. What do you sense Him saying?",
    isInput: true,
    key: "pause",
  },
  {
    stepIndex: 7,
    stageName: "Summit Path",
    title: "Choices",
    subtitle: "Discern your path",
    type: "input",
    prompt:
      "What would be a wise, loving, and faithful next step in this situation?",
    isInput: true,
    key: "choices",
  },
  {
    stepIndex: 8,
    stageName: "Summit",
    title: "Prayer",
    subtitle: "Offer it all to God",
    type: "input",
    prompt:
      "Summarize your entire journey in a prayer to God. Offer Him your thoughts, emotions, desires, and next steps.",
    content: {
      specialMessage:
        "This is your final reflection. Take time to offer everything to God in prayer.",
    },
    isInput: true,
    isSummary: true,
    key: "prayer",
  },
];

export const pathwayContent: PathwayContent = {
  appTitle: "The Mountain Pathway",
  appSubtitle: "Climb inward. Look upward.",
  appDescription:
    "A guided journey inward — and upward. Where quiet leads to clarity through scripture, stillness, and structured reflection.",

  landingPage: {
    heroTitle: "The Mountain Pathway",
    heroSubtitle: "Climb inward. Look upward.",
    heroDescription:
      "A guided journey inward — and upward. Where quiet leads to clarity through scripture, stillness, and structured reflection.",
    buttonText: "Begin Your Pathway",
    footerText: "Follow the path. Find perspective.",
  },

  summaryPage: {
    title: "Journey Complete",
    subtitle: "Your spiritual pathway has been recorded",
    completionMessage: "The Mountain Pathway - Spiritual Journey",
    downloadButtonText: "Download PDF",
    copyButtonText: "Copy Text",
    copiedText: "Copied!",
    newJourneyButtonText: "Start New Journey",
    generatingText: "Generating...",
  },

  timerScreen: {
    durationLabel: "Duration (minutes)",
    beginButtonText: "Begin Silence",
    pauseText: "Pause",
    resumeText: "Resume",
    resetText: "Reset",
    completionMessage: "Time for silence complete",
    completionSubtext: "When you're ready, continue your journey",
  },

  reflectionScreen: {
    instructionText: "Take your time. Let the words settle in your heart.",
  },

  navigation: {
    backButtonText: "Back",
    continueButtonText: "Continue",
    completeButtonText: "Complete Journey",
    stepCounterText: "Step {current} of {total}",
    journeyCompleteText: "Journey Complete",
  },

  general: {
    characterCountText: "{count} characters",
    textareaPlaceholder: "Share your thoughts here...",
  },
};

// Visual mapping for stage backgrounds
export const stageVisuals = {
  Trailhead: "/homepage-background.v2.jpg",
  Ascent: "/stage-2-ascent.jpg",
  Overlook: "/stage-3-overlook.jpeg",
  "Summit Path": "/stage-4-summit-path.jpg",
  Summit: "/stage-5-summit.jpg",
} as const;

// Helper function to get background image for current step
export const getBackgroundForStep = (stepIndex: number): string => {
  if (stepIndex === -1) {
    // Landing page uses Trailhead
    return stageVisuals["Trailhead"];
  }

  if (stepIndex === 9) {
    // Summary page uses Summit
    return stageVisuals["Summit"];
  }

  // Find the current step and return its stage's background
  const currentStep = pathwayData[stepIndex];
  if (currentStep && currentStep.stageName in stageVisuals) {
    return stageVisuals[currentStep.stageName as keyof typeof stageVisuals];
  }

  // Fallback to Trailhead if something goes wrong
  return stageVisuals["Trailhead"];
};
