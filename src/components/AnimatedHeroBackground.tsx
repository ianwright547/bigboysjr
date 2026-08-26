import { useEffect, useRef, useState } from "react";

interface Props {
  className?: string;
  speed?: number; // 1 = normal, 2 = fast
  opacity?: number;
}

// Pure SVG + CSS animation: zero dependencies, ~4KB
const AnimatedHeroBackground = ({ className = "", speed = 1, opacity = 0.18 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Intersection observer: pause when offscreen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const dur = 16 / speed; // base loop ~16s
  const animState = !visible || paused ? "paused": "running";
  const truckSpeed = hovered ? dur * 0.7: dur;

  return (
    <div
      ref={ref}
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      onClick={() => setPaused((p) => !p)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* ── Map background grid ── */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(152 30% 80%)" strokeWidth="0.5" />
          </pattern>
          {/* Road dash */}
          <pattern id="roadDash" width="12" height="4" patternUnits="userSpaceOnUse">
            <rect width="6" height="2" y="1" fill="hsl(220 10% 70%)" rx="1" />
          </pattern>
        </defs>

        {/* Green map fill */}
        <rect width="800" height="500" fill="hsl(152 40% 94%)" />
        <rect width="800" height="500" fill="url(#grid)" />

        {/* ── Roads ── */}
        {/* Horizontal main road */}
        <rect x="0" y="220" width="800" height="60" rx="4" fill="hsl(220 10% 88%)" />
        <rect x="0" y="248" width="800" height="4" fill="url(#roadDash)" />

        {/* Vertical road to house */}
        <rect x="540" y="100" width="50" height="180" rx="4" fill="hsl(220 10% 88%)" />
        <rect x="563" y="100" width="4" height="180" fill="url(#roadDash)" />

        {/* ── Dispatch Base (left) ── */}
        <g>
          {/* Building */}
          <rect x="60" y="180" width="80" height="50" rx="6" fill="hsl(220 15% 75%)" />
          <rect x="70" y="190" width="20" height="18" rx="2" fill="hsl(220 15% 85%)" />
          <rect x="100" y="190" width="20" height="18" rx="2" fill="hsl(220 15% 85%)" />
          {/* Garage door */}
          <rect x="80" y="215" width="30" height="15" rx="3" fill="hsl(152 40% 65%)" />
          {/* Label */}
          <text x="100" y="175" textAnchor="middle" fontSize="9" fontWeight="600" fill="hsl(220 15% 55%)" fontFamily="system-ui">
            DISPATCH
          </text>
        </g>

        {/* ── House (right-top) ── */}
        <g>
          {/* House body */}
          <rect x="535" y="80" width="60" height="40" rx="4" fill="hsl(30 30% 92%)" stroke="hsl(30 20% 80%)" strokeWidth="1.5" />
          {/* Roof */}
          <polygon points="530,82 565,55 600,82" fill="hsl(0 40% 70%)" />
          {/* Door */}
          <rect x="558" y="100" width="14" height="20" rx="2" fill="hsl(30 40% 60%)" />
          {/* Window */}
          <rect x="542" y="90" width="10" height="10" rx="1.5" fill="hsl(200 60% 85%)" />

          {/* ── Junk items near house ── */}
          <g style={{ animationPlayState: animState }}>
            {/* Couch */}
            <rect x="610" y="75" width="22" height="10" rx="3" fill="hsl(30 50% 65%)">
              <animate
                attributeName="opacity"
                values="1;1;1;0;0;0;0;1"
                dur={`${truckSpeed}s`}
                repeatCount="indefinite"
              />
            </rect>
            {/* Mattress */}
            <rect x="615" y="92" width="18" height="8" rx="2" fill="hsl(220 30% 75%)">
              <animate
                attributeName="opacity"
                values="1;1;1;0;0;0;0;1"
                dur={`${truckSpeed}s`}
                repeatCount="indefinite"
              />
            </rect>
            {/* Fridge */}
            <rect x="608" y="105" width="12" height="18" rx="2" fill="hsl(200 10% 82%)">
              <animate
                attributeName="opacity"
                values="1;1;1;0;0;0;0;1"
                dur={`${truckSpeed}s`}
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </g>

        {/* ── Trees (decorative) ── */}
        {[
          [180, 150], [320, 140], [450, 160], [700, 130],
          [250, 320], [400, 340], [650, 320], [150, 350],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="12" fill="hsl(152 45% 72%)" />
            <circle cx={(x as number) - 5} cy={(y as number) + 3} r="8" fill="hsl(152 40% 65%)" />
            <circle cx={(x as number) + 6} cy={(y as number) + 2} r="9" fill="hsl(152 50% 70%)" />
          </g>
        ))}

        {/* ── Small buildings (background) ── */}
        {[
          [300, 170, 30, 25], [380, 175, 25, 20], [480, 170, 35, 22],
        ].map(([x, y, w, h], i) => (
          <rect key={`b${i}`} x={x} y={y} width={w} height={h} rx="3" fill="hsl(220 12% 83%)" />
        ))}

        {/* ── Animated Truck ── */}
        <g style={{ animationPlayState: animState }}>
          {/* Truck follows path: base → road → turn up → house → back */}
          <g>
            <animateMotion
              dur={`${truckSpeed}s`}
              repeatCount="indefinite"
              path="M 140,250 L 565,250 L 565,130 L 565,130 L 565,250 L 140,250"
              keyPoints="0;0.35;0.5;0.65;0.8;1"
              keyTimes="0;0.3;0.45;0.55;0.75;1"
              rotate="auto"
            />
            {/* Truck body */}
            <rect x="-20" y="-8" width="40" height="16" rx="4" fill="hsl(152 60% 42%)" />
            {/* Cab */}
            <rect x="14" y="-6" width="12" height="12" rx="3" fill="hsl(152 50% 35%)" />
            {/* Wheels */}
            <circle cx="-10" cy="8" r="4" fill="hsl(220 10% 30%)" />
            <circle cx="10" cy="8" r="4" fill="hsl(220 10% 30%)" />
            {/* BB text */}
            <text x="-2" y="3" textAnchor="middle" fontSize="6" fontWeight="700" fill="white" fontFamily="system-ui">
              BB
            </text>
          </g>
        </g>

        {/* ── Route highlight (faint) ── */}
        <path
          d="M 140,250 L 565,250 L 565,130"
          stroke="hsl(152 60% 42%)"
          strokeWidth="3"
          strokeDasharray="8 6"
          fill="none"
          opacity="0.3"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-28"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* ── Pickup flash effect ── */}
        <circle cx="565" cy="120" r="0" fill="hsl(152 60% 42%)" opacity="0">
          <animate
            attributeName="r"
            values="0;0;0;25;0;0;0;0"
            dur={`${truckSpeed}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0;0;0.3;0;0;0;0"
            dur={`${truckSpeed}s`}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default AnimatedHeroBackground;
