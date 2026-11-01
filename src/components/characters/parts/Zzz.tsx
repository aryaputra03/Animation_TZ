import { P } from "@/core/palette";

interface Props {
  /** Geser posisi Zzz (satuan viewBox). Bawaan cocok untuk kucing. */
  dx?: number;
  dy?: number;
}

/** Tulisan "Zzz" saat hewan tidur. */
export function Zzz({ dx = 0, dy = 0 }: Props) {
  return (
    <g
      className="zzz"
      transform={`translate(${dx} ${dy})`}
      fill={P.cream50}
      stroke={P.coffee800}
      strokeWidth="1.2"
      fontWeight="800"
      style={{ paintOrder: "stroke" }}
    >
      <text x="214" y="70" fontSize="30">
        Z
      </text>
      <text x="238" y="46" fontSize="23">
        Z
      </text>
      <text x="256" y="26" fontSize="16">
        Z
      </text>
    </g>
  );
}
