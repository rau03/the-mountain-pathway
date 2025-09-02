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

export const psalm139 = `O Lord, you have searched me and known me!
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

— Psalm 139 (ESV)`;
