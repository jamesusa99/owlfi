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
        className="drop-shadow-[0_0_12px_rgba(212,168,75,0.5)]"
      >
        <defs>
          <linearGradient id="owlGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="owlGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4a84b" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
      </defs>
        {/* 外圈科技感圆环 */}
        <circle cx="32" cy="32" r="30" stroke="url(#owlGrad1)" strokeWidth="2" fill="none" opacity="0.8" />
        <circle cx="32" cy="32" r="26" stroke="url(#owlGrad1)" strokeWidth="1" fill="none" opacity="0.4" />
        {/* 六边形背景 */}
        <polygon
          points="32,8 52,20 52,44 32,56 12,44 12,20"
          fill="url(#owlGrad1)"
          fillOpacity="0.15"
          stroke="url(#owlGrad1)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        {/* 猫头鹰头部 - 几何化 */}
        <ellipse cx="32" cy="28" rx="14" ry="12" fill="url(#owlGrad1)" fillOpacity="0.3" />
        {/* 眼睛 - 科技感圆环 */}
        <circle cx="26" cy="25" r="6" fill="#0f172a" stroke="url(#owlGrad2)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="38" cy="25" r="6" fill="#0f172a" stroke="url(#owlGrad2)" strokeWidth="2" filter="url(#glow)" />
        <circle cx="26" cy="25" r="2" fill="url(#owlGrad2)" />
        <circle cx="38" cy="25" r="2" fill="url(#owlGrad2)" />
        {/* 眉毛 - 锐利线条 */}
        <path d="M20 20 L26 22 L32 20" stroke="url(#owlGrad2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M44 20 L38 22 L32 20" stroke="url(#owlGrad2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* 嘴巴 */}
        <path d="M28 34 Q32 38 36 34" stroke="url(#owlGrad2)" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* 耳朵 - 尖角 */}
        <path d="M18 16 L22 8 L26 16" stroke="url(#owlGrad2)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <path d="M46 16 L42 8 L38 16" stroke="url(#owlGrad2)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        {/* 数据线条装饰 */}
        <path d="M8 32 L4 32" stroke="url(#owlGrad1)" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
        <path d="M60 32 L56 32" stroke="url(#owlGrad1)" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className="text-white font-bold text-sm tracking-wider">
          猫头鹰基金研究院
        </span>
      )}
    </div>
  )
}
