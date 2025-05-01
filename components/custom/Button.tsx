import { TouchableOpacity, Text } from "react-native";
import React from "react";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "outline";
  className?: string;
};

export const Button = ({
  title,
  onPress,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseStyles = "py-3 px-6 rounded-lg items-center justify-center";
  const variantStyles =
    variant === "primary"
      ? "bg-[#25B14C]"
      : "border border-blue-600 bg-transparent";

  const textStyles = variant === "primary" ? "text-white" : "text-blue-600";

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles} ${className}`}
      onPress={onPress}
    >
      <Text className={`text-lg font-semibold ${textStyles}`}>{title}</Text>
    </TouchableOpacity>
  );
};
