import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

interface ComplaintListCardProps {
  id?: number;
  date: string;
  day: string;
  time: string;
  title: string;
  imageUri: ImageSourcePropType;
}

const ComplaintListCard: React.FC<ComplaintListCardProps> = ({
  id,
  date,
  day,
  time,
  title,
  imageUri,
}) => {
  const [hasError, setHasError] = useState(false);

  // Navigate to complaint details when clicked
  const handlePress = () => {
    if (id) {
      router.push(`/screens/complaint-explanation?complaintId=${id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        {hasError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>!</Text>
          </View>
        )}
        <Image
          source={imageUri}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            setHasError(true);
          }}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.dateText}>
          {date} - {day} - {time}
        </Text>
        <Text style={styles.titleText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 8,
    overflow: "hidden",
    padding: 16,
    marginVertical: 8,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  dateText: {
    color: "#25B14C",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  titleText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  errorContainer: {
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ComplaintListCard;
