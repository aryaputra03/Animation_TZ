import { P } from "@/core/palette";
import { Bird, Cloud, Flower, Hill, Land, RoundTree } from "./parts";

/** Bukit di sore hari: matahari rendah, langit jingga-pink, bukit bertingkat dengan jalan setapak. */
export function HillsScene() {
  return (
    <>
      <div className="sun is-low" style={{ left: "56%", top: "42%" }} />
      <Cloud
        top="12%"
        width={140}
        duration={110}
        delay={-30}
        tint={P.cream200}
      />
      <Cloud
        top="26%"
        width={100}
        duration={140}
        delay={-90}
        tint={P.cream200}
      />
      <Bird top="17%" width={28} duration={60} delay={-5} />
      <Bird top="23%" width={22} duration={80} delay={-35} />
      <Bird top="29%" width={18} duration={100} delay={-70} />
      <Land>
        <Hill
          d="M0 270 C80 230 160 245 240 262 S350 235 400 250 V520 H0Z"
          fill={P.sage300}
        />
        <Hill
          d="M0 310 C100 270 190 300 270 285 S370 275 400 290 V520 H0Z"
          fill={P.matcha300}
        />
        <RoundTree x={96} y={282} s={0.7} fill={P.matcha700} />
        <RoundTree x={330} y={280} s={0.6} fill={P.matcha700} />
        <Hill
          d="M0 350 C110 320 210 352 300 334 S380 330 400 340 V520 H0Z"
          fill={P.matcha500}
        />
        <path
          d="M168 520 C180 450 250 420 232 380 C220 356 262 346 270 336"
          stroke={P.cream200}
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
        <Hill d="M0 404 C120 380 250 408 400 388 V520 H0Z" fill={P.matcha700} />
        <Flower x={44} y={392} color={P.blush300} />
        <Flower x={84} y={410} color={P.sun400} />
        <Flower x={338} y={398} color={P.blush300} />
        <Flower x={372} y={412} color={P.cream50} />
      </Land>
    </>
  );
}
