import React from 'react';
import { View, Text } from 'react-native';

const AdminLayout = ({ children }) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar */}
      <View style={{ width: 250, backgroundColor: '#1B1B41' }}>
        <Text style={{ color: '#FFF', padding: 20 }}>Admin Menu</Text>
        {/* Add navigation links here */}
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, padding: 20 }}>
        {children}
      </View>
    </View>
  );
};

export default AdminLayout;
