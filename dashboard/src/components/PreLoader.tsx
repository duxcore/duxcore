import React from "react";

interface PreLoaderProps {
  active: boolean;
}

export const Preloader: React.FC<PreLoaderProps> = ({ children, active }) => {
  if (!active) return <>{children}</>;
  return (
    <div className="center">
      {(() => {
        const out = [];
        for (let i = 0; i <= 9; i++) out.push(<div className="wave" key={`wave-!${i + 1}`} />);
        return out;
      })()}
    </div>
  );
};
