import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface LeaderWaveBgProps {
  style?: object;
}

const LeaderWaveBg = ({ style }: LeaderWaveBgProps) => {
  return (
    <View
      style={[
        { position: "absolute", bottom: 0, width: "100%", height: "70%" },
        style,
      ]}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 410 810"
        fill="none"
        preserveAspectRatio="xMinYMin slice"
      >
        <Path
          d="M-5 154.296C-5 110.113 30.8172 74.2963 75 74.2963H205.5H314H361.5C414.5 68.8333 425 0 425 0V531H-5V154.296Z"
          fill="#25B14C"
        />
      </Svg>
    </View>
  );
};

export default LeaderWaveBg;
