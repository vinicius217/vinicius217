import { readFile, writeFile } from "node:fs/promises";

const svgPath = process.argv[2];

if (!svgPath) {
  throw new Error("Usage: node scripts/add-snake-weekdays.mjs <snake.svg>");
}

let svg = await readFile(svgPath, "utf8");

if (svg.includes('class="weekday-label"')) {
  process.exit(0);
}

svg = svg.replace(
  /viewBox="-16 -32 880 192" width="880"/,
  'viewBox="-56 -32 920 192" width="920"',
);

const labels = [
  '<g class="weekday-labels" aria-label="Weekdays">',
  '  <text class="weekday-label" x="-8" y="27">Mon</text>',
  '  <text class="weekday-label" x="-8" y="59">Wed</text>',
  '  <text class="weekday-label" x="-8" y="91">Fri</text>',
  '</g>',
].join("");

const today = new Date();
const currentSunday = new Date(
  Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() - today.getUTCDay(),
  ),
);
const firstSunday = new Date(currentSunday);
firstSunday.setUTCDate(firstSunday.getUTCDate() - 52 * 7);

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthLabels = [];
let previousMonth = -1;

for (let column = 0; column < 53; column += 1) {
  const week = new Date(firstSunday);
  week.setUTCDate(week.getUTCDate() + column * 7);
  const month = week.getUTCMonth();

  if (month !== previousMonth) {
    monthLabels.push(
      `<text class="month-label" x="${column * 16 + 2}" y="-10">${monthNames[month]}</text>`,
    );
    previousMonth = month;
  }
}

const months =
  '<g class="month-labels" aria-label="Months">' +
  monthLabels.join("") +
  "</g>";

svg = svg.replace(
  "</style>",
  '.weekday-label,.month-label{fill:#8b949e;font:10px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.weekday-label{text-anchor:end}</style>' +
    labels +
    months,
);

await writeFile(svgPath, svg);
