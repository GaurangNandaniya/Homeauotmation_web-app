// src/constants/deviceTypes.js
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CycloneRoundedIcon from "@mui/icons-material/CycloneRounded";
import ElectricalServicesRoundedIcon from "@mui/icons-material/ElectricalServicesRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

export const DEVICE_TYPES = [
  { value: "light", label: "Light", iconOn: LightbulbRoundedIcon, iconOff: LightbulbOutlinedIcon },
  { value: "fan", label: "Fan", iconOn: CycloneRoundedIcon, iconOff: CycloneRoundedIcon },
  { value: "plug", label: "Plug", iconOn: ElectricalServicesRoundedIcon, iconOff: ElectricalServicesRoundedIcon },
  { value: "ac", label: "AC", iconOn: AcUnitRoundedIcon, iconOff: AcUnitRoundedIcon },
  { value: "generic", label: "Generic", iconOn: BoltRoundedIcon, iconOff: BoltRoundedIcon },
];

export const DEFAULT_DEVICE_TYPE = "light";

export const getDeviceType = (value) =>
  DEVICE_TYPES.find((t) => t.value === value) ||
  DEVICE_TYPES.find((t) => t.value === DEFAULT_DEVICE_TYPE);
