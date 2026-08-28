import React from "react";
import { MUTED, TD_STYLE } from "../../shared";

/**
 * Shared table empty-state row. Presentation only; callers own the exact
 * text required by each SRS screen.
 */
export function TableEmptyState({
  colSpan,
  text,
  style,
}: {
  colSpan: number;
  text: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          ...TD_STYLE,
          textAlign: "center",
          padding: 32,
          color: MUTED,
          ...style,
        }}
      >
        {text}
      </td>
    </tr>
  );
}
