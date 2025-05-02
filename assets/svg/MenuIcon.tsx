import { View, Text } from "react-native";
import React from "react";
import { Svg, Rect, Path } from "react-native-svg";

const MenuIcon = () => {
  return (
    <Svg width="45" height="45" viewBox="0 0 53 51" fill="none">
      <Rect width="53" height="51" rx="12" fill="#F8F8F8" />
      <Rect
        x="0.5"
        y="0.5"
        width="52"
        height="50"
        rx="11.5"
        stroke="#FFFEFE"
        stroke-opacity="0.07"
      />
      <Path
        d="M15 20H38.5"
        stroke="#95989A"
        stroke-width="3"
        stroke-linecap="round"
      />
      <Path
        d="M17.5 26H36"
        stroke="#95989A"
        stroke-width="3"
        stroke-linecap="round"
      />
      <Path
        d="M20.5 32H33"
        stroke="#95989A"
        stroke-width="3"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default MenuIcon;
