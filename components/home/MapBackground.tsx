export function MapBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #E8D5B7 0%, #F0E6D3 35%, #D4C4A8 70%, #8B9E6B 100%)'
        }}
      />

      {/* SVG hand-drawn landscape */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Distant mountains */}
        <path
          d="M0,280 Q50,240 100,260 T200,250 T300,265 T400,255 L400,800 L0,800 Z"
          fill="#A89B7A"
          opacity="0.6"
        />

        {/* Mid hills */}
        <path
          d="M0,320 Q80,290 150,310 T280,300 T400,315 L400,800 L0,800 Z"
          fill="#8B9E6B"
          opacity="0.7"
        />

        {/* Rice terraces - left */}
        <path
          d="M-20,380 Q60,370 120,390 T200,385 L200,800 L-20,800 Z"
          fill="#7A9E7E"
          opacity="0.5"
        />
        <path
          d="M-20,420 Q60,410 120,430 T200,425 L200,800 L-20,800 Z"
          fill="#6A8E6E"
          opacity="0.4"
        />

        {/* Rice terraces - right */}
        <path
          d="M200,390 Q280,380 340,400 T420,395 L420,800 L200,800 Z"
          fill="#7A9E7E"
          opacity="0.5"
        />
        <path
          d="M200,430 Q280,420 340,440 T420,435 L420,800 L200,800 Z"
          fill="#6A8E6E"
          opacity="0.4"
        />

        {/* River */}
        <path
          d="M180,350 Q200,450 190,550 T200,700 T180,800 L220,800 Q240,700 230,550 T220,450 T220,350 Z"
          fill="#9BB5C7"
          opacity="0.4"
        />

        {/* Near ground */}
        <path
          d="M0,500 Q100,480 200,495 T400,485 L400,800 L0,800 Z"
          fill="#8B6F47"
          opacity="0.3"
        />

        {/* Trees - scattered */}
        <g opacity="0.5">
          <circle cx="50" cy="460" r="12" fill="#5A7E5E" />
          <circle cx="45" cy="455" r="8" fill="#6A8E6E" />
          <rect x="48" y="465" width="4" height="15" fill="#8B6F47" rx="1" />

          <circle cx="350" cy="470" r="10" fill="#5A7E5E" />
          <circle cx="346" cy="466" r="7" fill="#6A8E6E" />
          <rect x="348" y="475" width="3" height="12" fill="#8B6F47" rx="1" />

          <circle cx="120" cy="510" r="14" fill="#5A7E5E" />
          <circle cx="115" cy="505" r="9" fill="#6A8E6E" />
          <rect x="118" y="518" width="4" height="16" fill="#8B6F47" rx="1" />

          <circle cx="280" cy="520" r="11" fill="#5A7E5E" />
          <circle cx="276" cy="516" r="7" fill="#6A8E6E" />
          <rect x="278" y="525" width="3" height="13" fill="#8B6F47" rx="1" />
        </g>

        {/* Small village hint */}
        <g opacity="0.35">
          <rect x="160" y="440" width="8" height="6" fill="#C4A882" rx="1" />
          <rect x="170" y="438" width="10" height="8" fill="#B89A72" rx="1" />
          <rect x="182" y="442" width="7" height="5" fill="#C4A882" rx="1" />
          <polygon points="160,440 164,435 168,440" fill="#A08060" />
          <polygon points="170,438 175,432 180,438" fill="#A08060" />
        </g>

        {/* Path */}
        <path
          d="M80,550 Q120,580 160,570 T240,590 T320,580"
          fill="none"
          stroke="#C4A882"
          strokeWidth="2"
          strokeDasharray="8,4"
          opacity="0.5"
        />

        {/* Decorative dots / stars */}
        <g fill="#E8D5B7" opacity="0.6">
          <circle cx="30" cy="200" r="1.5" />
          <circle cx="80" cy="150" r="1" />
          <circle cx="150" cy="180" r="1.5" />
          <circle cx="250" cy="140" r="1" />
          <circle cx="320" cy="190" r="1.5" />
          <circle cx="370" cy="160" r="1" />
          <circle cx="60" cy="220" r="1" />
          <circle cx="200" cy="130" r="1.5" />
          <circle cx="290" cy="210" r="1" />
        </g>
      </svg>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
