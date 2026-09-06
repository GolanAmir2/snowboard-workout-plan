// The program. Four phases across 20 weeks, three sessions a week, no equipment required.

// A small library of stretches, reused across cooldowns so they don't need
// to be redefined for every single day.
const STRETCHES = {
  quad: { name: "Standing quad stretch", detail: "30 sec per side", query: "standing quad stretch proper form" },
  hipFlexor: { name: "Kneeling hip flexor stretch", detail: "30 sec per side", query: "kneeling hip flexor stretch proper form" },
  calf: { name: "Calf stretch (wall or step)", detail: "30 sec per side", query: "calf stretch against wall proper form" },
  hamstring: { name: "Standing hamstring stretch", detail: "30 sec per side", query: "standing hamstring stretch proper form" },
  childsPose: { name: "Child's pose", detail: "45 sec", query: "child's pose stretch how to" },
  spinalTwist: { name: "Seated spinal twist", detail: "30 sec per side", query: "seated spinal twist stretch how to" },
  pigeon: { name: "Pigeon pose (hip stretch)", detail: "30 sec per side", query: "pigeon pose hip stretch how to" },
  ankle: { name: "Ankle mobility circles", detail: "10 each direction, per side", query: "ankle mobility circles exercise" },
  lowerBack: { name: "Knee-to-chest stretch", detail: "30 sec per side", query: "knee to chest stretch lower back" },
  fullFlow: { name: "Full-body stretch flow", detail: "5–10 min", query: "full body post workout stretch routine" },
};

const PLAN = {
  phases: [
    {
      id: "foundation",
      name: "Foundation",
      range: [1, 6],
      blurb: "Building the base — leg strength, core control, and a cardio floor to build on.",
      days: {
        A: {
          title: "Lower Body Foundation",
          warmup: "5 min brisk march in place, 10 leg swings each leg, 10 ankle circles per side",
          exercises: [
            { name: "Bodyweight squats", detail: "3 × 15" },
            { name: "Walking lunges", detail: "3 × 10 per leg" },
            { name: "Glute bridges", detail: "3 × 15" },
            { name: "Calf raises", detail: "3 × 20" },
            { name: "Wall sit", detail: "3 × 30 sec" },
          ],
          cooldown: ["quad", "hipFlexor", "calf"],
        },
        B: {
          title: "Core & Balance",
          warmup: "10 cat-cows, 10 torso twists",
          exercises: [
            { name: "Plank", detail: "3 × 30 sec" },
            { name: "Side plank", detail: "2 × 20 sec per side" },
            { name: "Bird dog", detail: "3 × 10 per side" },
            { name: "Single-leg balance", detail: "3 × 30 sec per leg" },
            { name: "Dead bug", detail: "3 × 12" },
          ],
          cooldown: ["childsPose", "spinalTwist"],
        },
        C: {
          title: "Cardio & Conditioning",
          warmup: "30 jumping jacks, 20 high knees",
          exercises: [
            { name: "Step-ups (stair or sturdy step)", detail: "3 × 12 per leg" },
            { name: "Mountain climbers", detail: "3 × 20 per side" },
            { name: "Squat to reach", detail: "3 × 12" },
            { name: "Burpees (modify as needed)", detail: "3 × 8" },
            { name: "High knees", detail: "3 × 30 sec" },
          ],
          cooldown: ["fullFlow"],
        },
      },
    },
    {
      id: "strength",
      name: "Strength & Power",
      range: [7, 14],
      blurb: "Heavier leg loading, single-leg work, and the first plyometrics for real quad and glute strength.",
      days: {
        A: {
          title: "Lower Body Strength+",
          warmup: "5 min march + 10 bodyweight squats to open up",
          exercises: [
            { name: "Bulgarian split squats (rear foot elevated)", detail: "3 × 10 per leg" },
            { name: "Jump squats", detail: "3 × 10" },
            { name: "Curtsy lunges", detail: "3 × 10 per leg" },
            { name: "Single-leg glute bridge", detail: "3 × 12 per leg" },
            { name: "Wall sit with calf raise", detail: "3 × 45 sec" },
          ],
          cooldown: ["quad", "hamstring", "hipFlexor"],
        },
        B: {
          title: "Core & Stability+",
          warmup: "10 cat-cows, 10 hip circles per side",
          exercises: [
            { name: "Plank with shoulder taps", detail: "3 × 20 taps" },
            { name: "Side plank with leg lift", detail: "2 × 12 per side" },
            { name: "Single-leg deadlift (bodyweight)", detail: "3 × 10 per leg" },
            { name: "Russian twists", detail: "3 × 20" },
            { name: "Single-leg balance, eyes closed", detail: "3 × 30 sec per leg" },
          ],
          cooldown: ["hipFlexor", "lowerBack"],
        },
        C: {
          title: "Cardio & Power",
          warmup: "30 jumping jacks, 10 bodyweight squats",
          exercises: [
            { name: "Lateral bounds (skater jumps)", detail: "3 × 10 per side" },
            { name: "Step-up with knee drive", detail: "3 × 12 per leg" },
            { name: "Burpees", detail: "3 × 10" },
            { name: "Broad jumps", detail: "3 × 8" },
            { name: "Mountain climbers", detail: "3 × 30 sec" },
          ],
          cooldown: ["calf", "ankle"],
        },
      },
    },
    {
      id: "board-specific",
      name: "Board-Specific",
      range: [15, 19],
      blurb: "Athletic-stance strength, ankle control, and rotational power — the movement patterns your stance actually uses on a board.",
      days: {
        A: {
          title: "Stance & Edge Legs",
          warmup: "5 min march, 10 ankle circles per side, 10 walking lunges",
          exercises: [
            { name: "Athletic-stance squat hold (feet wide, slight sideways turn)", detail: "3 × 45 sec" },
            { name: "Jump squats with soft landing (ollie pop pattern)", detail: "4 × 10" },
            { name: "Single-leg calf raises (edge-pressure control)", detail: "3 × 15 per leg" },
            { name: "Lateral bounds, toe-to-heel emphasis", detail: "4 × 12 per side" },
            { name: "Single-leg squat (assisted, to a box or chair)", detail: "3 × 8 per leg" },
          ],
          cooldown: ["ankle", "calf", "pigeon"],
        },
        B: {
          title: "Rotational Core & Balance",
          warmup: "10 cat-cows, 10 standing trunk rotations per side",
          exercises: [
            { name: "Plank", detail: "3 × 60 sec" },
            { name: "Side plank with rotation (reach under body)", detail: "3 × 12 per side" },
            { name: "Standing wood chops (twist through the core)", detail: "3 × 12 per side" },
            { name: "Single-leg balance, athletic stance, eyes closed", detail: "3 × 30 sec per leg" },
            { name: "Bicycle crunches", detail: "3 × 20" },
          ],
          cooldown: ["spinalTwist", "childsPose"],
        },
        C: {
          title: "Power-Endurance Circuit",
          warmup: "5 min easy cardio to raise heart rate",
          exercises: [
            { name: "Circuit × 3 rounds, minimal rest between exercises", detail: "" },
            { name: "Jump squats", detail: "15 reps" },
            { name: "Mountain climbers", detail: "30 sec" },
            { name: "Skater jumps (edge-to-edge)", detail: "12 per side" },
            { name: "Burpees", detail: "10 reps" },
            { name: "Athletic-stance squat hold", detail: "45 sec" },
          ],
          cooldown: ["fullFlow", "lowerBack"],
        },
      },
    },
    {
      id: "taper",
      name: "Taper",
      range: [20, 20],
      blurb: "Volume down, movement quality up. Arrive at the mountain fresh, not fried.",
      days: {
        A: {
          title: "Easy Lower Body",
          warmup: "5 min easy walk",
          exercises: [
            { name: "Bodyweight squats", detail: "2 × 12" },
            { name: "Walking lunges", detail: "2 × 8 per leg" },
            { name: "Glute bridges", detail: "2 × 12" },
            { name: "Wall sit", detail: "2 × 30 sec" },
          ],
          cooldown: ["fullFlow"],
        },
        B: {
          title: "Mobility & Light Core",
          warmup: "5 min easy walk or light cycling",
          exercises: [
            { name: "Plank", detail: "2 × 30 sec" },
            { name: "Bird dog", detail: "2 × 10 per side" },
            { name: "Single-leg balance", detail: "2 × 30 sec per leg" },
          ],
          cooldown: ["ankle", "pigeon", "fullFlow"],
        },
        C: {
          title: "Rest / Optional Light Walk",
          warmup: "",
          exercises: [
            { name: "Easy 20–30 min walk, or full rest", detail: "" },
            { name: "Light stretching in the evening", detail: "" },
          ],
          cooldown: ["fullFlow"],
        },
      },
    },
  ],
};

function getPhaseForWeek(week) {
  return PLAN.phases.find((p) => week >= p.range[0] && week <= p.range[1]);
}

// Build a YouTube search URL. Exact video links go stale or get taken down,
// so we point at a live search instead of a single hardcoded video.
function ytSearchUrl(query) {
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
}

function exerciseVideoUrl(name) {
  const clean = name.replace(/\(.*?\)/g, "").replace(/,.*$/, "").trim();
  return ytSearchUrl(clean + " proper form tutorial");
}

function stretchVideoUrl(stretchId) {
  return ytSearchUrl(STRETCHES[stretchId].query);
}
