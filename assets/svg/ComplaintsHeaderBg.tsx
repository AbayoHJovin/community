import React from "react";
import { Dimensions, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width, height: screenHeight } = Dimensions.get("window");

interface ComplaintsHeaderBgProps {
  style?: object;
  height?: number;
}

const ComplaintsHeaderBg: React.FC<ComplaintsHeaderBgProps> = ({
  style,
  height = 300, // Default height close to original design
}) => {
  const originalWidth = 430;
  const originalHeight = 300;
  const svgWidth = width;
  const svgHeight = height;

  return (
    <View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          width: width,
          height: svgHeight,
          zIndex: -1,
          overflow: "hidden",
          
        },
        style,
      ]}
    >
      <Svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${originalWidth} ${originalHeight}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <Path
          d="M429.349 160.381C429.111 204.563 393.102 240.188 348.92 239.95L218.422 239.249L109.923 238.666L62.4241 238.411C9.40946 240.998 -1.28481 277.124 -1.28481 277.124L0.215033 -1.99999L430.209 0.310545L429.349 160.381Z"
          fill="#25B14C"
        />
      </Svg>
    </View>
  );
};

export default ComplaintsHeaderBg;
