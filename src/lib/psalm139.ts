export type BibleTranslation = "KJV" | "ESV" | "NLT" | "NASB" | "CSB";

export const DEFAULT_TRANSLATION: BibleTranslation = "ESV";

export const BIBLE_TRANSLATIONS: Record<BibleTranslation, string> = {
  ESV: `O Lord, you have searched me and known me!
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
Oh that you would slay the wicked, O God!
O men of blood, depart from me!
They speak against you with malicious intent;
your enemies take your name in vain.
Do I not hate those who hate you, O Lord?
And do I not loathe those who rise up against you?
I hate them with complete hatred;
I count them my enemies.
Search me, O God, and know my heart!
Try me and know my thoughts!
And see if there be any grievous way in me,
and lead me in the way everlasting!
— Psalm 139 (ESV)`,

  CSB: `Lord, You have searched me and known me.
You know when I sit down and when I stand up;
You understand my thoughts from far away.
You observe my travels and my rest;
You are aware of all my ways.
Before a word is on my tongue,
You know all about it, Lord.
You have encircled me;
You have placed Your hand on me.
This extraordinary knowledge is beyond me.
It is lofty; I am unable to reach it.
Where can I go to escape Your Spirit?
Where can I flee from Your presence?
If I go up to heaven, You are there;
if I make my bed in Sheol, You are there.
If I live at the eastern horizon
or settle at the western limits,
even there Your hand will lead me;
Your right hand will hold on to me.
If I say, "Surely the darkness will hide me,
and the light around me will be night" —
even the darkness is not dark to You.
The night shines like the day;
darkness and light are alike to You.
For it was You who created my inward parts;
You knit me together in my mother's womb.
I will praise You
because I have been remarkably and wonderfully made.
Your works are wonderful,
and I know this very well.
My bones were not hidden from You
when I was made in secret,
when I was formed in the depths of the earth.
Your eyes saw me when I was formless;
all my days were written in Your book and planned
before a single one of them began.
God, how difficult Your thoughts are
for me to comprehend;
how vast their sum is!
If I counted them,
they would outnumber the grains of sand;
when I wake up, I am still with You.
God, if only You would kill the wicked —
you bloodthirsty men, stay away from me —
who invoke You deceitfully.
Your enemies swear by You falsely.
Lord, don't I hate those who hate You,
and detest those who rebel against You?
I hate them with extreme hatred;
I consider them my enemies.
Search me, God, and know my heart;
test me and know my concerns.
See if there is any offensive way in me;
lead me in the everlasting way.
— Psalm 139 (CSB)`,

  KJV: `O LORD, thou hast searched me, and known me.
Thou knowest my downsitting and mine uprising,
thou understandest my thought afar off.
Thou compassest my path and my lying down,
and art acquainted with all my ways.
For there is not a word in my tongue,
but, lo, O LORD, thou knowest it altogether.
Thou hast beset me behind and before,
and laid thine hand upon me.
Such knowledge is too wonderful for me;
it is high, I cannot attain unto it.
Whither shall I go from thy spirit?
Or whither shall I flee from thy presence?
If I ascend up into heaven, thou art there:
if I make my bed in hell, behold, thou art there.
If I take the wings of the morning,
and dwell in the uttermost parts of the sea;
even there shall thy hand lead me,
and thy right hand shall hold me.
If I say, Surely the darkness shall cover me;
even the night shall be light about me.
Yea, the darkness hideth not from thee;
but the night shineth as the day:
the darkness and the light are both alike to thee.
For thou hast possessed my reins:
thou hast covered me in my mother's womb.
I will praise thee; for I am fearfully and wonderfully made:
marvellous are thy works;
and that my soul knoweth right well.
My substance was not hid from thee,
when I was made in secret,
and curiously wrought in the lowest parts of the earth.
Thine eyes did see my substance, yet being unperfect;
and in thy book all my members were written,
which in continuance were fashioned,
when as yet there was none of them.
How precious also are thy thoughts unto me, O God!
How great is the sum of them!
If I should count them, they are more in number than the sand:
when I awake, I am still with thee.
Surely thou wilt slay the wicked, O God:
depart from me therefore, ye bloody men.
For they speak against thee wickedly,
and thine enemies take thy name in vain.
Do not I hate them, O LORD, that hate thee?
And am not I grieved with those that rise up against thee?
I hate them with perfect hatred:
I count them mine enemies.
Search me, O God, and know my heart:
try me, and know my thoughts:
and see if there be any wicked way in me,
and lead me in the way everlasting.
— Psalm 139 (KJV)`,

  NASB: `O Lord, You have searched me and known me.
You know when I sit down and when I rise up;
You understand my thought from afar.
You scrutinize my path and my lying down,
and are intimately acquainted with all my ways.
Even before there is a word on my tongue,
behold, O Lord, You know it all.
You have enclosed me behind and before,
and laid Your hand upon me.
Such knowledge is too wonderful for me;
it is too high, I cannot attain to it.
Where can I go from Your Spirit?
Or where can I flee from Your presence?
If I ascend to heaven, You are there;
if I make my bed in Sheol, behold, You are there.
If I take the wings of the dawn,
if I dwell in the remotest part of the sea,
even there Your hand will lead me,
and Your right hand will lay hold of me.
If I say, "Surely the darkness will overwhelm me,
and the light around me will be night,"
even the darkness is not dark to You,
and the night is as bright as the day.
Darkness and light are alike to You.
For You formed my inward parts;
You wove me in my mother's womb.
I will give thanks to You, for I am fearfully and wonderfully made;
wonderful are Your works,
and my soul knows it very well.
My frame was not hidden from You,
when I was made in secret,
and skillfully wrought in the depths of the earth;
Your eyes have seen my unformed substance;
and in Your book were all written
the days that were ordained for me,
when as yet there was not one of them.
How precious also are Your thoughts to me, O God!
How vast is the sum of them!
If I should count them, they would outnumber the sand.
When I awake, I am still with You.
O that You would slay the wicked, O God;
depart from me, therefore, men of bloodshed.
For they speak against You wickedly,
and Your enemies take Your name in vain.
Do I not hate those who hate You, O Lord?
And do I not loathe those who rise up against You?
I hate them with the utmost hatred;
they have become my enemies.
Search me, O God, and know my heart;
try me and know my anxious thoughts;
and see if there be any hurtful way in me,
and lead me in the everlasting way.
— Psalm 139 (NASB)`,

  NLT: `O Lord, you have examined my heart
and know everything about me.
You know when I sit down or stand up.
You know my thoughts even when I'm far away.
You see me when I travel
and when I rest at home.
You know everything I do.
You know what I am going to say
even before I say it, Lord.
You go before me and follow me.
You place your hand of blessing on my head.
Such knowledge is too wonderful for me,
too great for me to understand!
I can never escape from your Spirit!
I can never get away from your presence!
If I go up to heaven, you are there;
if I go down to the grave, you are there.
If I ride the wings of the morning,
if I dwell by the farthest oceans,
even there your hand will guide me,
and your strength will support me.
I could ask the darkness to hide me
and the light around me to become night —
but even in darkness I cannot hide from you.
To you the night shines as bright as day.
Darkness and light are the same to you.
You made all the delicate, inner parts of my body
and knit me together in my mother's womb.
Thank you for making me so wonderfully complex!
Your workmanship is marvelous — how well I know it.
You watched me as I was being formed in utter seclusion,
as I was woven together in the dark of the womb.
You saw me before I was born.
Every day of my life was recorded in your book.
Every moment was laid out
before a single day had passed.
How precious are your thoughts about me, O God.
They cannot be numbered!
I can't even count them;
they outnumber the grains of sand!
And when I wake up,
you are still with me!
O God, if only you would destroy the wicked!
Get out of my life, you murderers!
They blaspheme you;
your enemies misuse your name.
O Lord, shouldn't I hate those who hate you?
Shouldn't I despise those who oppose you?
Yes, I hate them with total hatred,
for your enemies are my enemies.
Search me, O God, and know my heart;
test me and know my anxious thoughts.
Point out anything in me that offends you,
and lead me along the path of everlasting life.
— Psalm 139 (NLT)`,
};
