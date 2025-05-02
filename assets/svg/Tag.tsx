import React from "react";
import { Svg, Rect, G, Path } from "react-native-svg";

const Tag = () => {
  return (
    <Svg width="35" height="39" viewBox="0 0 35 39" fill="none">
      <G>
        <Rect
          x="0.172363"
          y="0.46666"
          width="34.7893"
          height="37.8824"
          rx="7"
          fill="white"
        />
      </G>
      <Rect
        width="16.3473"
        height="17.6784"
        transform="translate(9.44971 10.5686)"
        fill="white"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.3229 24.4315L12.6301 27.0464C12.2555 27.2445 11.7939 27.1043 11.5873 26.7297C11.5275 26.6136 11.4953 26.485 11.4932 26.354V14.7673C11.4932 12.5575 12.9778 11.6735 15.1141 11.6735H20.1327C22.2039 11.6735 23.7537 12.4985 23.7537 14.6199V26.354C23.7537 26.563 23.672 26.7635 23.5267 26.9113C23.3814 27.0591 23.1843 27.1422 22.9788 27.1422C22.8477 27.1401 22.7189 27.1073 22.6022 27.0464L17.8805 24.4315C17.7065 24.3359 17.4969 24.3359 17.3229 24.4315Z"
        fill="#25B14C"
        stroke="#25B14C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Tag;