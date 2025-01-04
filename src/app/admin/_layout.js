import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { fetchCategories, fetchUsers, fetchItems, updateRecord, insertRecord } from './database';

const AdminLayout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [isViewingDatabase, setIsViewingDatabase] = useState(false);    
  const [editData, setEditData] = useState(null);
  const router = useRouter();

  // Load the Poppins font
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    }
  }, []);

  if (!fontsLoaded) {
    return null; // Return null until fonts are loaded
  }

  const handleViewDatabase = async () => {
    try {
      setIsViewingDatabase(true);
      const categoryData = await fetchCategories();
      const userData = await fetchUsers();
      const itemData = await fetchItems();
      setCategories(categoryData);
      setUsers(userData);
      setItems(itemData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (table, id, data) => {
    if (!data || !id) {
      console.error('Invalid data or ID for editing');
      return;
    }
    setEditData({ table, id, data });
  };

  const handleSaveEdit = async () => {
    const { table, id, data } = editData;
    const updatedData = {};
    Object.keys(data).forEach((key) => {
      updatedData[key] = data[key];
    });

    try {
      await updateRecord(table, id, updatedData);
      setEditData(null);
      handleViewDatabase();
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const renderTable = (title, data, columns, tableName) => (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>{title}</Text>
      <View style={styles.tableHeader}>
        {columns.map((col, index) => (
          <Text key={index} style={styles.tableHeaderText}>
            {col}
          </Text>
        ))}
      </View>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              {columns.map((col, index) => {
                const key = col.toLowerCase().replace(' ', '_');
                return (
                  <TextInput
                    key={index}
                    style={styles.tableRowText}
                    defaultValue={item[key] || ''}
                    onChangeText={(text) => {
                      const updatedItem = { ...item, [key]: text };
                      handleEdit(tableName, item.id, updatedItem);
                    }}
                  />
                );
              })}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No data available</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar */}
      <LinearGradient
        colors={['#FDAD00', '#F76D00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sidebar}
      >
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/BuyNaBay4.png')} style={styles.logo} />
          <Text style={styles.logoText}>BuyNaBay Admin</Text>
        </View>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/dashboard')}
        >
          <FontAwesome5 name="tachometer-alt" size={18} color="#FDAD00" style={styles.navIcon} />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/products')}
        >
          <FontAwesome5 name="box" size={18} color="#FDAD00" style={styles.navIcon} />
          <Text style={styles.navText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/reports')}
        >
          <FontAwesome5 name="chart-bar" size={18} color="#FDAD00" style={styles.navIcon} />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/users')}
        >
          <FontAwesome5 name="users" size={18} color="#FDAD00" style={styles.navIcon} />
          <Text style={styles.navText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={handleViewDatabase}
        >
          <FontAwesome5 name="database" size={18} color="#FDAD00" style={styles.navIcon} />
          <Text style={styles.navText}>Database</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        {isViewingDatabase ? (
          <ScrollView>
            {renderTable('Categories', categories, ['Category ID', 'Label'], 'category')}
            {renderTable('Users', users, ['ID', 'Phone Number', 'School ID', 'Email', 'Password', 'Profile Name'], 'users')}
            {renderTable('Items', items, ['ID', 'Item Name', 'Description', 'Price', 'Category', 'Address', 'Seller'], 'items')}
          </ScrollView>
        ) : (
          children
        )}
        {editData && (
          <View>
            <Text>Edit Data</Text>
            {Object.keys(editData.data).map((key) => (
              <TextInput
                key={key}
                style={styles.input}
                value={editData.data[key]}
                onChangeText={(text) => {
                  setEditData({
                    ...editData,
                    data: { ...editData.data, [key]: text },
                  });
                }}
              />
            ))}
            <Button title="Save Changes" onPress={handleSaveEdit} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 350,
    paddingVertical: 40,
    justifyContent: 'flex-start',
    elevation: 5,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    borderBottomRightRadius: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
  },
  logoText: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#1B1B41',
    alignSelf: 'stretch',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 4,
  },
  navText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
    marginLeft: 15,
  },
  navIcon: {
    marginLeft: 5,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFF',
    padding: 25,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  tableContainer: {
    marginBottom: 20,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#FDAD00',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',  // Bold font for consistency
    color: '#FDAD00',               // Match the yellow from sidebar
    backgroundColor: '#1B1B41',     // Dark background color from sidebar
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#FDAD00',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1B1B41', // Matching yellow color
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FDAD00', // Dark color for text for contrast
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#1B1B41',
    padding: 10,
    backgroundColor: '#FDAD00',
  },
  tableRowText: {
    flex: 1,
    textAlign: 'center',
    color: '#1B1B41',
  },
  noDataText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
  },
  input: {
    height: 40,
    borderColor: '#FDAD00',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default AdminLayout;
