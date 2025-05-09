import React from "react";
import { View } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

const CommunityIcon = ({
  size = 40,
  color = "#25B14C",
  nameVisible = false,
}: {
  size?: number;
  color?: string;
  nameVisible: boolean;
}) => {
  return (
    <View>
      <Svg width={size} height={size} viewBox="0 0 430 438">
        <Path
          d="M198.386 176.77L199.219 177.325L201.164 186.771L203.387 193.995L205.332 199.274L207.276 203.719L210.333 208.72L212.833 212.054L213.944 213.166V213.721L215.056 214.277L217.278 216.222L221.168 218.444L224.78 219.556H232.003L237.004 218.167L240.894 216.222L243.672 214.555V215.388L240.894 217.611L236.449 220.667L233.393 223.167L230.614 225.668L226.725 229.558L224.502 233.169L223.391 236.503L223.113 238.448V245.394L224.224 251.784L226.725 259.841L229.503 267.343L233.115 275.678L232.837 276.233L226.169 269.565L223.668 266.509L220.89 263.175L217.556 258.452L213.944 252.618L210.333 245.95L207.832 240.393L204.776 232.336L202.553 224.834L200.608 216.5L198.941 205.664L198.386 200.663L198.108 196.218V181.215L198.386 176.77Z"
          fill="#FAD201"
        />

        {nameVisible && (
          <SvgText fill={color} fontSize="24" x="150" y="380">
            Community
          </SvgText>
        )}
      </Svg>
    </View>
  );
};

export default CommunityIcon;
