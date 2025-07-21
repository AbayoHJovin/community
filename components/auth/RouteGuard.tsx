import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuthStatus } from '@/store/slices/authSlice';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'citizen' | 'leader' | null; // null means any authenticated user
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredRole = null 
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      await dispatch(checkAuthStatus());
      setIsChecking(false);
    };

    verifyAuth();
  }, [dispatch]);

  if (isChecking) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#25B14C" />
        <Text className="mt-2 text-gray-600">Verifying authentication...</Text>
      </View>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Redirect href="/OnboardingFlow" />;
  }

  // If role check is required and user doesn't have the required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user role
    if (user.role === 'leader') {
      return <Redirect href="/leader/welcome" />;
    } else {
      return <Redirect href="/(tabs)" />;
    }
  }

  // If authenticated and has required role (or no specific role required)
  return <>{children}</>;
};

export default RouteGuard; 