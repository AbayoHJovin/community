import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from "react-native";
import { deleteComplaint } from "../../services/complaintService";
import { useAppDispatch } from "../../store/hooks";
import { removeComplaint } from "../../store/slices/complaintsSlice";

interface PropsDef {
  toggleModal: () => void;
  isModalVisible: boolean;
  complaintId: number;
}

const ComplaintOptions = ({
  toggleModal,
  isModalVisible,
  complaintId,
}: PropsDef) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const isMobile = width < 380;
  const slideAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);
  const deleteModalAnim = useRef(new Animated.Value(0)).current;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (showDeleteConfirm) {
      Animated.timing(deleteModalAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      deleteModalAnim.setValue(0);
    }
  }, [showDeleteConfirm, deleteModalAnim]);

  const handleDeletePress = () => {
    toggleModal();
    setTimeout(() => {
      setShowDeleteConfirm(true);
    }, 300);
  };

  const cancelDelete = () => {
    Animated.timing(deleteModalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowDeleteConfirm(false);
      setDeleteError(null);
    });
  };

  const confirmDelete = async () => {
    if (!complaintId) {
      setDeleteError("Invalid complaint ID");
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      // First update UI immediately for better UX
      dispatch(removeComplaint(complaintId));

      // Call the service function to delete the complaint from AsyncStorage
      const success = await deleteComplaint(complaintId);

      if (!success) {
        throw new Error("Failed to delete complaint from storage");
      }

      setIsDeleting(false);
      setShowDeleteConfirm(false);

      // Show success message
      if (Platform.OS === "android") {
        ToastAndroid.show("Complaint deleted successfully", ToastAndroid.SHORT);
      } else {
        // For iOS
        Alert.alert("Success", "Complaint deleted successfully");
      }

      // Navigate back to the complaints list
      router.replace("/(tabs)");
    } catch (error) {
      setIsDeleting(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting the complaint";
      setDeleteError(errorMessage);
    }
  };

  const actions = [
    {
      name: "Share problem",
      icon: "share-2" as const,
      bgColor: "#EFE9E9",
      iconColor: "#7D7E93",
      onPress: () => {
        console.log("Share problem");
        toggleModal();
      },
    },
    {
      name: "Edit problem",
      icon: "edit" as const,
      bgColor: "#25B14C",
      iconColor: "#FFFFFF",
      onPress: () => {
        console.log("Edit problem");
        toggleModal();
      },
    },
    {
      name: "Delete problem",
      icon: "trash" as const,
      bgColor: "#F2583E",
      iconColor: "#FFFFFF",
      onPress: handleDeletePress,
    },
  ];

  return (
    <View>
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: opacityAnim }]}>
          <Pressable
            style={{ flex: 1, justifyContent: "flex-end" }}
            onPress={toggleModal}
          >
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContent,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [300, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.modalHandle} />

                <Text style={styles.modalTitle}>Choose an action</Text>

                <View style={styles.actionsContainer}>
                  {actions.map((action) => (
                    <Pressable
                      key={action.name}
                      onPress={action.onPress}
                      style={({ pressed }) => [
                        styles.actionButton,
                        pressed && styles.actionButtonPressed,
                      ]}
                      android_ripple={{
                        color: "rgba(0,0,0,0.1)",
                        borderless: true,
                      }}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          {
                            backgroundColor: action.bgColor,
                            width: isMobile ? 56 : 64,
                            height: isMobile ? 56 : 64,
                          },
                        ]}
                      >
                        <Feather
                          name={action.icon}
                          size={isMobile ? 22 : 24}
                          color={action.iconColor}
                        />
                      </View>
                      <Text style={styles.actionText}>{action.name}</Text>
                    </Pressable>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={toggleModal}
                  style={styles.cancelButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Animated.View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={cancelDelete}
      >
        <Animated.View
          style={[styles.confirmModalOverlay, { opacity: deleteModalAnim }]}
        >
          <Pressable style={styles.confirmBackdrop} onPress={cancelDelete}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.confirmModalContent,
                  {
                    transform: [
                      {
                        scale: deleteModalAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.warningIconContainer}>
                  <Feather name="alert-triangle" size={32} color="#F2583E" />
                </View>

                <Text style={styles.confirmTitle}>Delete Complaint</Text>
                <Text style={styles.confirmMessage}>
                  Are you sure you want to delete this complaint? This action
                  cannot be undone.
                </Text>

                {deleteError && (
                  <View style={styles.errorContainer}>
                    <Feather name="alert-circle" size={18} color="#F2583E" />
                    <Text style={styles.errorText}>{deleteError}</Text>
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.cancelBtn]}
                    onPress={cancelDelete}
                    disabled={isDeleting}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={confirmDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: "center",
    width: "30%",
    padding: 8,
    borderRadius: 12,
  },
  actionButtonPressed: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  actionText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: "#25B14C",
    borderRadius: 12,
    paddingVertical: 14,
    width: "90%",
    marginTop: 32,
    shadowColor: "#25B14C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  confirmModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
  },
  warningIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(242, 88, 62, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  confirmMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#F0F0F0",
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: "#F2583E",
    marginLeft: 8,
  },
  cancelBtnText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(242, 88, 62, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  errorText: {
    color: "#F2583E",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  confirmBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ComplaintOptions;
