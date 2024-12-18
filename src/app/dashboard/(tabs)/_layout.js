import React from 'react';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { View } from 'react-native'; // Import View to wrap icons

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF', // Active tab icon and label color (white for contrast)
        tabBarInactiveTintColor: '#000', // Inactive tab icon and label color
        tabBarActiveBackgroundColor: '#F2C14E', // Active background color for tab (BuyNaBay theme color)
        tabBarInactiveBackgroundColor: '#F2C14E', // Inactive background color for tab (BuyNaBay theme color)
        tabBarLabelStyle: {
          display: 'none', // Hide the tab labels
        },
        tabBarStyle: {
          height: 60, // Adjust height for comfort
          backgroundColor: '#FFFFFF', // Set the background color of the tab to white (editable)
          borderTopWidth: 1, // Add border outline
          borderColor: '#000', // Border color matching the theme
        },
        tabBarShowLabel: false, // Ensure the labels are hidden
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                backgroundColor: focused ? '#1B1B41' : '#F2C14E',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Icon
                name="home"
                size={20}
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
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                backgroundColor: focused ? '#1B1B41' : '#F2C14E',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Icon
                name="shopping-cart"
                size={20}
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
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                backgroundColor: focused ? '#1B1B41' : '#F2C14E',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Icon
                name="plus"
                size={20}
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
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                backgroundColor: focused ? '#1B1B41' : '#F2C14E',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Icon
                name="comments"
                size={20}
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
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                backgroundColor: focused ? '#1B1B41' : '#F2C14E',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <Icon
                name="user"
                size={20}
                color={focused ? '#FDAD00' : '#000'}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default DashboardLayout;