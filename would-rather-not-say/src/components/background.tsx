import React, { ReactNode } from "react";

const Background = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Children content (placed above the background) */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {children}
      </div>

      {/* Background Waves (behind the content) */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0">
        <img src="/Layer 5.svg" alt="Layer 5" className="absolute bottom-0 w-full " />
        <img src="/Layer 4.svg" alt="Layer 4" className="absolute bottom-0 w-full " />
        <img src="/Layer 3.svg" alt="Layer 3" className="absolute bottom-0 w-full " />
        <img src="/Layer 2.svg" alt="Layer 2" className="absolute bottom-0 w-full " />
        <img src="/layer 1.svg" alt="Layer 1" className="absolute bottom-0 w-full " />
      </div>
    </div>
  );
};

export default Background;
