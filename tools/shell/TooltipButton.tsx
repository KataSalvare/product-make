import type React from 'react'

interface TooltipButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip: React.ReactNode
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({ tooltip, children, ...props }) => {
  return (
    <div className="relative group inline-flex">
      <button {...props}>{children}</button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-[1100] pointer-events-none">
        {tooltip}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  )
}
