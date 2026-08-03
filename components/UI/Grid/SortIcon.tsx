import type React from "react";
import { cx } from "./utils";

interface SortIconProps {
  active: boolean;
  dir: "asc" | "desc";
}

export const SortIcon: React.FC<SortIconProps> = ({ active, dir }) => (
  <span className="inline-flex flex-col ml-1 leading-none" aria-hidden="true">
    <span
      className={cx(
        "text-[10px] leading-none",
        !(active && dir === "asc") && "opacity-30",
      )}
    >
      ▲
    </span>
    <span
      className={cx(
        "text-[10px] leading-none",
        !(active && dir === "desc") && "opacity-30",
      )}
    >
      ▼
    </span>
  </span>
);
