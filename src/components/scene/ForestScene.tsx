import { P } from "@/core/palette";
import { Hill, Land, Mushroom, Pine, RoundTree } from "./parts";

const FAR_PINES = [10, 52, 96, 138, 182, 226, 270, 314, 358, 396];
const MID_ROUND = [60, 150, 250, 340];
const MID_PINES = [20, 105, 205, 295, 380];
const BUSHES = [
  { x: 110, y: 394, r: 22 },
  { x: 150, y: 400, r: 18 },
  { x: 262, y: 398, r: 20 },
  { x: 302, y: 392, r: 24 },
];
const RAYS = [
  { left: "38%", rotate: 14 },
  { left: "56%", rotate: 19 },
  { left: "72%", rotate: 24 },
];

/** Hutan di siang hari: pohon berlapis, berkas cahaya, semak, jamur. */
export function ForestScene() {
  return (
    <>
      {RAYS.map((r) => (
        <div
          key={r.left}
          className="ray"
          style={{ left: r.left, transform: `rotate(${r.rotate}deg)` }}
        />
      ))}
      <Land>
        <g opacity="0.5">
          {FAR_PINES.map((x) => (
            <Pine key={x} x={x} y={262} s={0.75} fill={P.sage600} />
          ))}
        </g>
        <Hill d="M0 268 C100 250 200 272 400 256 V520 H0Z" fill={P.sage300} />
        {MID_PINES.map((x) => (
          <Pine key={x} x={x} y={312} fill={P.matcha700} />
        ))}
        {MID_ROUND.map((x) => (
          <RoundTree key={x} x={x} y={300} s={0.9} fill={P.matcha500} />
        ))}
        <Hill d="M0 330 C120 308 240 338 400 316 V520 H0Z" fill={P.matcha300} />
        <Pine x={22} y={372} s={1.9} fill={P.forest900} />
        <Pine x={384} y={366} s={1.7} fill={P.forest900} />
        {BUSHES.map((b) => (
          <circle key={b.x} cx={b.x} cy={b.y} r={b.r} fill={P.matcha700} />
        ))}
        <Hill d="M0 396 C120 380 260 402 400 384 V520 H0Z" fill={P.matcha700} />
        <Mushroom x={200} y={410} />
        <Mushroom x={70} y={414} />
      </Land>
    </>
  );
}
