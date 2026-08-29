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

svg = svg.replace(
  "</style>",
  '.weekday-label{fill:#8b949e;font:10px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-anchor:end}</style>' +
    labels,
);

await writeFile(svgPath, svg);
