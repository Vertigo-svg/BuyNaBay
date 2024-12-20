import React from 'react';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { View, StyleSheet, Dimensions } from 'react-native'; // Import View and StyleSheet

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF', // Active tab icon and label color (white for contrast)
        tabBarInactiveTintColor: '#000', // Inactive tab icon and label color
        tabBarActiveBackgroundColor: '#F2C14E', // Active background color for tab (BuyNaBay theme color)
        tabBarInactiveBackgroundColor: '#F2C14E', // Inactive background color for tab (BuyNaBay theme color)
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false, // Ensure the labels are hidden
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
              <Icon
                name="home"
                size={25}
                color={focused ? '#FDAD00' : '#000'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
              <Icon
                name="shopping-bag"
                size={19  }
                color={focused ? '#FDAD00' : '#000'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
              <Icon
                name="plus"
                size={25}
                color={focused ? '#FDAD00' : '#000'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
              <Icon
                name="comments"
                size={22}
                color={focused ? '#FDAD00' : '#000'}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
              <Icon
                name="user"
                size={22}
                color={focused ? '#FDAD00' : '#000'}
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
    display: 'none', // Hide the tab labels
  },
  tabBarStyle: {
    height: 75, // Adjust height for comfort
    backgroundColor: '#F2C14E', // Set the background color of the tab to white (editable)
    borderTopWidth: 0, // Add border outline
    borderColor: '#000', // Border color matching the theme
    width: '100%',
    flex: 0, // Ensures the tab bar occupies only its intended space
    justifyContent: 'flex-end', // Aligns the content to the bottom
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2C14E',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  tabIconFocused: {
    backgroundColor: '#1B1B41',
  },
});

export default DashboardLayout;
