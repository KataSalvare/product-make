import type React from 'react'

interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: React.ReactNode
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({ tooltip, children, ...props }) => {
  return (
    <div className="relative group inline-flex">
      <button {...props}>{children}</button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 rounded-lg text-white text-[11px] font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1100] pointer-events-none bg-[#1c1c1c]/90 dark:bg-[#f5f2ed]/90 dark:text-[#121212] shadow-lg backdrop-blur-sm animate-tool-fade-in">
        {tooltip}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1c1c1c]/90 dark:bg-[#f5f2ed]/90 rotate-45" />
      </div>
    </div>
  )
}
