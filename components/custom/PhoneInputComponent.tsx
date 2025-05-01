import { View, TextInput, Text } from "react-native";
import React, { useState } from "react";

interface PhoneInputComponentProps {
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
  phoneNumber,
  setPhoneNumber,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        borderRadius: 50,
        paddingHorizontal: 16,
        height: 60,
        borderWidth: isFocused ? 2 : 0,
        borderColor: isFocused ? "#16a34a" : "transparent",
      }}
    >
      <Text style={{ color: "#6B7280", marginRight: 8, fontSize: 16 }}>
        +250
      </Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone number"
        keyboardType="phone-pad"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          flex: 1,
          fontSize: 16,
          outlineColor: "transparent",
        }}
      />
    </View>
  );
};

export default PhoneInputComponent;
