import React from "react";

export function Button({ children, className = "", variant = "default", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variantStyles = {
    default: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    ghost: "bg-transparent underline hover:text-gray-300",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
