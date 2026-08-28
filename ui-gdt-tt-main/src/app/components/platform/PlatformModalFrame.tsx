import React from "react";

/**
 * Pure presentation primitive shared by Lane A + Lane B.
 *
 * IMPORTANT:
 * - No business rules.
 * - No SRS labels, statuses, validation or workflow decisions.
 * - Callers keep all content and behavior; this component only owns the
 *   repeated backdrop + centered card structure.
 */
export function PlatformModalFrame({
  children,
  zIndex = 1500,
  overlayStyle,
  cardStyle,
}: {
  children: React.ReactNode;
  zIndex?: number;
  overlayStyle?: React.CSSProperties;
  cardStyle?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...overlayStyle,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          overflow: "hidden",
          ...cardStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
