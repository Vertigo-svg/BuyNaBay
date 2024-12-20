import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { View, Image, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function DrawerLayout() {
  const router = useRouter();
  const year = new Date().getFullYear();  
  const { top, bottom } = useSafeAreaInsets();

  // Handle logout action
  const handleLogout = async () => {
    router.replace('/');
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <View style={{ flex: 1 }}>
            <DrawerContentScrollView
              {...props}
              scrollEnabled={true}
              contentContainerStyle={{ paddingTop: top }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 50 + top,
                  paddingBottom: 20
                }}
              >
                {/* New BuyNaBay Logo */}
                <View style={styles.avatarContainer}>
                  <Image source={require('../../assets/OfficialBuyNaBay.png')} style={styles.avatar} />
                </View>
              </View>
              <DrawerItemList {...props} />

              {/* Profile Drawer Item */}
              <DrawerItem
                label="Logout"
                icon={() => (
                  <Icon name='sign-out' color='#1B1B41' size={25} /> // Inlined icon size and color for logout
                )}
                labelStyle={{ fontSize: 18 }} // Inlined font size for label
                onPress={handleLogout}
              />
            </DrawerContentScrollView>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 20 + bottom
              }}
            >
              <Text style={styles.footerText}>
                © {year} BuyNaBay. All rights reserved.
              </Text>
            </View> 
          </View>
        )}
      >
        <Drawer.Screen
          name="(tabs)" // This is the name of the page and must match the URL from the root
          options={{
            drawerLabel: 'Home',
            drawerIcon: () => (
              <Icon name='home' size={25} color='#FDAD00' /> // Adjusted icon color for "BuyNaBay" theme
            ),
            drawerLabelStyle: { fontSize: 18 }, // Inlined font size for label
            headerShown: false, // Remove the header
          }}
        />
        <Drawer.Screen
          name="settings" // This is the name of the page and must match the URL from the root
          options={{
            drawerLabel: 'Settings',
            headerShown: false, // Remove the header
            drawerIcon: () => (
              <Icon name='cogs' size={25} color='#FDAD00' /> // Adjusted icon color for Settings
            ),
            drawerLabelStyle: { fontSize: 18 }, // Inlined font size for label
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// Avatar and theme styling for BuyNaBay
const styles = StyleSheet.create({
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B41', // BuyNaBay theme color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ensure logo is properly resized
  },
  footerText: {
    color: '#1B1B41', // Adjusted footer text color for BuyNaBay theme
    fontSize: 14,
    fontWeight: '300',
  },
});
