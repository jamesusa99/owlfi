interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export default function Logo({ size = 48, showText = false, className = '' }: LogoProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#2c5282" />
          </linearGradient>
          <linearGradient id="logo-gold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f6e05e" />
            <stop offset="100%" stopColor="#d69e2e" />
          </linearGradient>
        </defs>
        {/* 圆角方形底 */}
        <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#logo-base)" />
        {/* 猫头鹰脸 - 简洁对称 */}
        <path
          d="M32 18 C42 18 50 26 50 36 C50 42 46 46 32 50 C18 46 14 42 14 36 C14 26 22 18 32 18 Z"
          fill="#fff"
          fillOpacity="0.12"
        />
        {/* 左眼 */}
        <circle cx="26" cy="32" r="9" fill="#fff" />
        <circle cx="26" cy="32" r="6" fill="url(#logo-base)" />
        <circle cx="27" cy="31" r="2" fill="url(#logo-gold)" />
        {/* 右眼 */}
        <circle cx="38" cy="32" r="9" fill="#fff" />
        <circle cx="38" cy="32" r="6" fill="url(#logo-base)" />
        <circle cx="39" cy="31" r="2" fill="url(#logo-gold)" />
        {/* 喙 */}
        <path
          d="M28 42 L32 46 L36 42"
          stroke="url(#logo-gold)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="text-white font-semibold text-sm tracking-wide">
          猫头鹰基金研究院
        </span>
      )}
    </div>
  )
}
