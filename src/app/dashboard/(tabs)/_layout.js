import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, StyleSheet, Dimensions, Platform, useWindowDimensions } from 'react-native';

// Function to calculate responsive sizes based on screen dimensions
const getResponsiveSize = (size, width, height) => {
  // Base the calculation on the smaller dimension for consistent sizing across orientations
  const baseSize = Math.min(width, height);
  return (size / 375) * baseSize; // 375 is used as a base width reference (iPhone X)
};

// Detect if the application is running on web
const isWeb = Platform.OS === 'web';

const DashboardLayout = () => {
  // Use the useWindowDimensions hook to get reactive measurements
  const { width, height } = useWindowDimensions();

  // Calculate responsive values based on current dimensions
  const tabBarHeight = isWeb ? 70 : getResponsiveSize(75, width, height);
  const iconContainerSize = isWeb ? 36 : getResponsiveSize(40, width, height);

  // Custom sizes for different icons to ensure visual balance
  // Scale down icon sizes on web to prevent them from being too large
  const iconSizes = {
    home: isWeb ? 20 : getResponsiveSize(25, width, height),
    shoppingBag: isWeb ? 16 : getResponsiveSize(19, width, height),
    plus: isWeb ? 20 : getResponsiveSize(25, width, height),
    comments: isWeb ? 18 : getResponsiveSize(22, width, height),
    user: isWeb ? 18 : getResponsiveSize(22, width, height)
  };

  // Add an effect to handle web-specific adjustments for body padding
  useEffect(() => {
    if (isWeb && typeof document !== 'undefined' && typeof window !== 'undefined') {
      // Add padding to the body to prevent content from being hidden behind the fixed tab bar
      const addPaddingToBody = () => {
        document.body.style.paddingBottom = `${tabBarHeight}px`;
      };

      addPaddingToBody();

      // Set up listener for window resize events
      window.addEventListener('resize', addPaddingToBody);

      // Clean up
      return () => {
        window.removeEventListener('resize', addPaddingToBody);
        document.body.style.paddingBottom = '0px';
      };
    }
  }, [tabBarHeight]);

  // Add media query handling for responsive web sizing
  useEffect(() => {
    if (isWeb && typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Function to adjust icon sizes based on viewport width
      const adjustIconSizesForWeb = () => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

        // Get all icon elements (this is a simplified approach - you may need to adjust selector)
        const icons = document.querySelectorAll('.tab-icon');

        // Apply different sizes based on viewport width
        if (vw > 1200) {
          // Large screens - keep icons smaller
          icons.forEach(icon => {
            icon.style.transform = 'scale(0.8)';
          });
        } else if (vw > 768) {
          // Medium screens
          icons.forEach(icon => {
            icon.style.transform = 'scale(0.9)';
          });
        } else {
          // Small screens - closer to mobile size
          icons.forEach(icon => {
            icon.style.transform = 'scale(1)';
          });
        }
      };

      // Initial adjustment
      adjustIconSizesForWeb();

      // Add listener for window resize
      window.addEventListener('resize', adjustIconSizesForWeb);

      return () => {
        window.removeEventListener('resize', adjustIconSizesForWeb);
      };
    }
  }, []);

  const tabIconContainerStyle = (focused) => ([
    styles.tabIconContainer,
    {
      width: iconContainerSize,
      height: iconContainerSize,
      borderRadius: iconContainerSize / 2,
      // Adjust marginTop for web to ensure tab bar icons are visible
      marginTop: isWeb ? 5 : getResponsiveSize(30, width, height)
    },
    focused && styles.tabIconFocused
  ]);

  const tabBarStyle = [
    styles.tabBarStyle,
    {
      height: tabBarHeight,
      // For web, ensure the tab bar is always at the bottom of the viewport
      ...(isWeb && {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      })
    },
    // Add safe area padding for notched devices
    Platform.OS === 'ios' && !isWeb && { paddingBottom: getResponsiveSize(10, width, height) }
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#000',
        tabBarActiveBackgroundColor: '#F2C14E',
        tabBarInactiveBackgroundColor: '#F2C14E',
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: tabBarStyle,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconContainerStyle(focused)}>
              <Icon
                name="home"
                size={iconSizes.home}
                color={focused ? '#FDAD00' : '#000'}
                style={isWeb ? { className: 'tab-icon' } : {}}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconContainerStyle(focused)}>
              <Icon
                name="shopping-bag"
                size={iconSizes.shoppingBag}
                color={focused ? '#FDAD00' : '#000'}
                style={isWeb ? { className: 'tab-icon' } : {}}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconContainerStyle(focused)}>
              <Icon
                name="plus"
                size={iconSizes.plus}
                color={focused ? '#FDAD00' : '#000'}
                style={isWeb ? { className: 'tab-icon' } : {}}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconContainerStyle(focused)}>
              <Icon
                name="comments"
                size={iconSizes.comments}
                color={focused ? '#FDAD00' : '#000'}
                style={isWeb ? { className: 'tab-icon' } : {}}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={tabIconContainerStyle(focused)}>
              <Icon
                name="user"
                size={iconSizes.user}
                color={focused ? '#FDAD00' : '#000'}
                style={isWeb ? { className: 'tab-icon' } : {}}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    display: 'none',
  },
  tabBarStyle: {
    backgroundColor: '#F2C14E',
    borderTopWidth: 0,
    borderColor: '#000',
    width: '100%',
    flex: 0,
    justifyContent: 'flex-end',
    // Add a shadow for better visibility on web
    ...(Platform.OS === 'web' && {
      boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      maxHeight: '70px', // Ensure the tab bar doesn't get too tall on large screens
    }),
  },
  tabIconContainer: {
    backgroundColor: '#F2C14E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconFocused: {
    backgroundColor: '#1B1B41',
  },
});

export default DashboardLayout;