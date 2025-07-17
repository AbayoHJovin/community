import { useState } from "react";
import { TextInput } from "react-native";

interface PropsValidation {
  placeholder: string;
  value: string | number;
  setValue: (newValue: string) => void;
  secureTextEntry?: boolean;
}

const InputField = ({
  placeholder,
  value,
  setValue,
  secureTextEntry,
}: PropsValidation) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      placeholder={placeholder}
      value={String(value)}
      onChangeText={(text) => setValue(text)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      secureTextEntry={secureTextEntry}
      style={{
        height: 60,
        width: "100%",
        backgroundColor: "#F8F8F8",
        borderRadius: 50,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 16,
        marginTop: 15,
        borderWidth: isFocused ? 2 : 0,
        outlineColor: isFocused ? "#16a34a" : "transparent",
      }}
    />
  );
};

export default InputField;
