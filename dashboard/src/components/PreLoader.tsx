import React from "react";

interface PreLoaderProps {
  active: boolean;
  hideContent?: boolean;
}

export const Preloader: React.FC<PreLoaderProps> = ({ children, active, hideContent = false }) => {
  if (!active) return <>{children}</>;
  return (
    <>
      <div className="center z-50 fixed h-full w-full">
        {(() => {
          const out = [];
          for (let i = 0; i <= 9; i++) out.push(<div className="wave" key={`wave-!${i + 1}`} />);
          return out;
        })()}
      </div>
      {!hideContent ? children : ""}
    </>
  );
};
