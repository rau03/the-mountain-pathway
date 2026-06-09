// src/lib/pathway-data.ts

export interface PathwayStep {
  stepIndex: number;
  stageName: string;
  title: string;
  subtitle: string;
  type: "landing" | "timer" | "reflection" | "input" | "summary";
  prompt: string;
  icon: string;
  content?: {
    instructions?: string;
    specialMessage?: string;
  };
  isInput: boolean;
  isTimer?: boolean;
  isSummary?: boolean;
  key: string;
  mobileAlignment?: string;
  desktopAlignment?: string;
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
    title: "Center Your Heart",
    subtitle: "A Moment of Stillness",
    type: "timer",
    prompt:
      "Let's begin with a few moments of quiet. Find a comfortable stillness, and for the next few moments, simply rest in God's care, allowing your heart to find its center in Him.",
    icon: "Heart",
    isInput: false,
    isTimer: true,
    key: "begin",
    mobileAlignment: "[background-position:center_30%]",
    desktopAlignment: "[background-position:center_80%]",
  },
  {
    stepIndex: 1,
    stageName: "Ascent",
    title: "Ground Yourself In Scripture",
    subtitle: "Listen to His Word",
    type: "reflection",
    prompt:
      "Let's ground this time in His Word. As you slowly read through Psalm 139, listen for any word or phrase that resonates with your heart today.",
    icon: "BookOpen",
    content: {
      instructions: "Take your time. Let the words settle in your heart.",
    },
    isInput: false,
    key: "reflect",
    mobileAlignment: "[background-position:center_50%]",
    desktopAlignment: "[background-position:center_40%]",
  },
  {
    stepIndex: 2,
    stageName: "Ascent",
    title: "Name the Issue",
    subtitle: "Define Your Focus",
    type: "input",
    prompt:
      "Now, let's gently name what you've brought to this time. What specific situation, relationship, or question would you like to walk through with God?",
    icon: "PenLine",
    isInput: true,
    key: "respond",
    mobileAlignment: "[background-position:center_50%]",
    desktopAlignment: "[background-position:center_40%]",
  },
  {
    stepIndex: 3,
    stageName: "Overlook",
    title: "Unpack Your Thoughts",
    subtitle: "Truths and Misperceptions",
    type: "input",
    prompt:
      "Let's explore the thoughts surrounding this issue. What stories are you telling yourself about it? What is undeniably true, and what might be a misperception you've held onto?",
    icon: "Lightbulb",
    isInput: true,
    key: "thoughts",
    mobileAlignment: "[background-position:center_50%]",
    desktopAlignment: "[background-position:center_70%]",
  },
  {
    stepIndex: 4,
    stageName: "Overlook",
    title: "Acknowledge Your Feelings",
    subtitle: "From Head to Heart",
    type: "input",
    prompt:
      "Now, let's turn our attention from the head to the heart. As you consider this situation, what emotions are present? Name them here without judgment.",
    icon: "Heart",
    isInput: true,
    key: "emotions",
    mobileAlignment: "[background-position:center_70%]",
    desktopAlignment: "[background-position:center_70%]",
  },
  {
    stepIndex: 5,
    stageName: "Summit Path",
    title: "Articulate Your Hope",
    subtitle: "Uncover the Deep Longing",
    type: "input",
    prompt:
      "Beneath the struggle, there is often a deep longing. What is it you truly hope for in this? How might this desire point to the way God has made you and the good things He has for you?",
    icon: "Star",
    isInput: true,
    key: "desire",
    mobileAlignment: "[background-position:center_70%]",
    desktopAlignment: "[background-position:center_50%]",
  },
  {
    stepIndex: 6,
    stageName: "Summit Path",
    title: "Pause and Invite",
    subtitle: "Welcome Jesus",
    type: "input",
    prompt:
      "Let's create a space and take a quiet moment to consciously invite Jesus into this very situation, just as it is.",
    icon: "DoorOpen",
    isInput: true,
    key: "pause",
    mobileAlignment: "[background-position:center_50%]",
    desktopAlignment: "[background-position:center_50%]",
  },
  {
    stepIndex: 7,
    stageName: "Summit Path",
    title: "Discern the Next Step",
    subtitle: "Choose Your Path Forward",
    type: "input",
    prompt:
      "Having sat with your thoughts, feelings, and hopes, what does a wise and loving next step look like? What is one small, faithful action you can take?",
    icon: "Compass",
    isInput: true,
    key: "choices",
    mobileAlignment: "[background-position:center_50%]",
    desktopAlignment: "[background-position:center_50%]",
  },
  {
    stepIndex: 8,
    stageName: "Summit",
    title: "Commit in Prayer",
    subtitle: "Offer It All to Him",
    type: "input",
    prompt:
      "Finally, let's bring everything you've discovered back to God. Use this space to write a prayer that gathers your thoughts, surrenders your feelings, and commits your next step to Him.",
    icon: "HandHeart",
    content: {
      specialMessage:
        "This is your final reflection. Take time to offer everything to God in prayer.",
    },
    isInput: true,
    isSummary: true,
    key: "prayer",
    mobileAlignment: "[background-position:center_50%]",
    desktopAlignment: "[background-position:center_50%]",
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
  Trailhead: "/stage-1-trailhead.jpg",
  Ascent: "/stage-2-ascent.jpg",
  Overlook: "/stage-3-overlook.v2.jpg",
  "Summit Path": "/stage-4-summit-path.v2.jpg",
  Summit: "/stage-5-summit.jpg",
} as const;

// Helper function to get background image for current step
export const getBackgroundForStep = (stepIndex: number): string => {
  if (stepIndex === -1) {
    // Landing page uses its own unique background
    return "/homepage-background.v3.jpg";
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
