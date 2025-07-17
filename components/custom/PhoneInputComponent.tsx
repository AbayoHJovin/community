import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface PhoneInputComponentProps {
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
  phoneNumber,
  setPhoneNumber,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Format the phone number to ensure it doesn't start with +250
  const handlePhoneChange = (text: string) => {
    // Remove any non-digit characters
    const digitsOnly = text.replace(/\D/g, "");

    // Ensure the user doesn't try to enter the country code
    if (digitsOnly.startsWith("250")) {
      setPhoneNumber(digitsOnly.substring(3));
    } else {
      setPhoneNumber(digitsOnly);
    }
  };

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
        onChangeText={handlePhoneChange}
        placeholder="7XXXXXXXX"
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
