// src/theme/tokens.js
// Shared sizing/spacing tokens. Every card/tile/grid in the app pulls from
// here — no component should pick its own minHeight, padding, icon size,
// or gap. Edit values here to retune the entire system.
//
// Numeric values are MUI sx multipliers unless otherwise noted (1 = 8px for
// spacing/gap/padding; 1 = 4px for borderRadius — matches theme.shape.borderRadius=4).

const tokens = {
  // Cards & tiles (HomeCard, RoomCard, SwitchTile, SkeletonTile)
  card: {
    minHeight: 110, // px
    padding: 1.5, // sx → 12px
    borderRadius: 4, // sx → 16px
    gap: 0.75, // internal vertical gap between icon row and content
  },

  // Icons
  icon: {
    tile: 24, // px — main tile icon (SwitchTile)
    card: 22, // px — secondary card icon (HomeCard, RoomCard)
    chip: 20, // px — DeviceTypePicker chip
    small: 18, // px — favourite star, menu dots
  },

  // Grid layouts (auto-fill responsive)
  grid: {
    minColWidth: 160, // px — feeds repeat(auto-fill, minmax(160px, 1fr))
    homeColWidth: 180, // px — Home cards a bit wider
    gap: 1, // sx → 8px
    sectionGap: 3, // sx → 24px — between favorites/homes sections
  },

  // TopBar
  topBar: {
    iconButtonSize: 36, // px — back + settings circular buttons
    paddingX: 1.5, // sx → 12px
    paddingY: 1, // sx → 8px
    titleSize: 18, // px — h3 override
  },

  // ON/OFF state pill on SwitchTile
  pill: {
    fontSize: 10, // px
    fontWeight: 700,
    letterSpacing: "0.05em",
    paddingX: 1, // sx → 8px
    paddingY: 0.25, // sx → 2px
  },

  // DeviceTypePicker chip
  chip: {
    minHeight: 70, // px
    minColWidth: 74, // px
    padding: 1, // sx → 8px
    borderRadius: 3, // sx → 12px (slightly tighter than card)
  },

  // Modal / drawer
  surface: {
    borderRadius: 4, // sx → 16px (consistent with cards)
    paddingX: 2.5, // sx → 20px
    paddingY: 2.5,
  },

  // Skeleton (matches card height)
  skeleton: {
    height: 110, // px — same as card.minHeight
  },
};

export default tokens;
