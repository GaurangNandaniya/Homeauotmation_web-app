import React from "react";
import { Skeleton, Box } from "@mui/material";
import tokens from "../../theme/tokens";

const SkeletonTile = ({ height = tokens.skeleton.height, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ minHeight: height }}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={height}
            sx={{ borderRadius: tokens.card.borderRadius }}
          />
        </Box>
      ))}
    </>
  );
};

export const SkeletonTileGrid = ({ count = 6 }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: `repeat(auto-fill, minmax(${tokens.grid.minColWidth}px, 1fr))`,
      gap: tokens.grid.gap,
    }}
  >
    <SkeletonTile count={count} />
  </Box>
);

export default SkeletonTile;
