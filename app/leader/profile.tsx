import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet,
  Switch,
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../../store/slices/authSlice';
import ComplaintsHeaderBg from '../../assets/svg/ComplaintsHeaderBg';

const { width } = Dimensions.get('window');

export default function LeaderProfile() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Ensure user is authenticated and is a leader
  useEffect(() => {
    if (!user || user.role !== "leader") {
      // Redirect to login if not a leader
      router.replace("/OnboardingFlow");
    }
  }, [user]);

  const navigateToComplaints = () => {
    router.push('/leader/complaints');
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.replace('/OnboardingFlow');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleLocationSwitch = () => {
    setLocationEnabled(previousState => !previousState);
  };

  if (loading || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="text-gray-500 mt-4">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#25B14C" />
      
      <ComplaintsHeaderBg />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-8 pb-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-white text-3xl font-bold">Profile</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('Open settings')}>
            <Feather name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tabs Container */}
        <View style={styles.tabsWrapper}>
          <View
            className="rounded-md p-1 flex-row"
            style={styles.tabContainer}
          >
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${
                activeTab === 'complaints' ? 'bg-[#25B14C]' : 'bg-white'
              }`}
              style={activeTab === 'complaints' ? styles.activeTab : styles.inactiveTab}
              onPress={navigateToComplaints}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'complaints' ? 'text-white' : 'text-[#25B14C]'
                }`}
              >
                Complaints
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-md ${
                activeTab === 'profile' ? 'bg-[#25B14C]' : 'bg-white'
              }`}
              style={activeTab === 'profile' ? styles.activeTab : styles.inactiveTab}
              onPress={() => setActiveTab('profile')}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'profile' ? 'text-white' : 'text-[#25B14C]'
                }`}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View className="flex-1 bg-[#F9F9F9]" style={styles.mainContent}>
          {/* Profile Content */}
          <View className="items-center mt-4">
            <Image 
              source={user.profileImage ? { uri: user.profileImage } : require('../../assets/images/userImage.png')} 
              className="w-28 h-28 rounded-full"
            />
            <Text className="text-2xl font-bold mt-4 text-gray-800">{user.name}</Text>
            <Text className="text-gray-600 text-lg">{user.title || 'Community Leader'}</Text>
          </View>

          {/* Settings */}
          <View className="mt-8 mx-4">
            {/* Account Details */}
            <TouchableOpacity 
              className="flex-row items-center justify-between py-4 border-b border-gray-200"
              onPress={() => console.log('Navigate to account details')}
            >
              <View className="flex-row items-center">
                <Ionicons name="eye-outline" size={24} color="#666" />
                <Text className="text-lg text-gray-800 ml-6">Account Details</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>

            {/* Location */}
            <View className="flex-row items-center justify-between py-4 border-b border-gray-200">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={24} color="#666" />
                <View className="ml-6">
                  <Text className="text-lg text-gray-800">Turn your location</Text>
                  <Text className="text-gray-500">This will improve lot of things</Text>
                </View>
              </View>
              <Switch
                trackColor={{ false: '#E0E0E0', true: '#25B14C' }}
                thumbColor={locationEnabled ? '#FFFFFF' : '#FFFFFF'}
                ios_backgroundColor="#E0E0E0"
                onValueChange={toggleLocationSwitch}
                value={locationEnabled}
              />
            </View>

            {/* Language */}
            <TouchableOpacity 
              className="flex-row items-center justify-between py-4 border-b border-gray-200"
              onPress={() => console.log('Navigate to language settings')}
            >
              <View className="flex-row items-center">
                <Ionicons name="language" size={24} color="#666" />
                <Text className="text-lg text-gray-800 ml-6">Language</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            className="bg-[#FF6347] rounded-full py-4 mt-8 mx-8"
            onPress={handleLogout}
          >
            <Text className="text-white text-center font-bold text-lg">LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
    width: '100%',
    marginBottom: 20,
    zIndex: 1,
  },
  tabContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  activeTab: {
    backgroundColor: "#25B14C",
  },
  inactiveTab: {
    backgroundColor: "white",
  },
  mainContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    marginTop: -10,
  }
});
