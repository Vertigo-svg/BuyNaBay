import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Admin authentication key
const ADMIN_AUTH_KEY = 'isAdminAuthenticated';

// Local database functions
import { fetchCategories, fetchUsers, fetchItems, updateRecord, insertRecord } from './database';

// Dashboard component
import Dashboard from './dashboard';

// Products screen component
import AdminProductsScreen from './products';

// Reports screen component
import ReportsScreen from './reports';

// Users screen component
import UsersScreen from './users';

// Define column flex ratios for the database view
const COLUMN_FLEX_MAP = {
  'category': {
    'Category ID': 1,
    'Label': 2,
    'Actions': 0.7,
  },
  'users': {
    'ID': 0.8,
    'Phone Number': 1.2,
    'School ID': 1.2,
    'Email': 2,
    'Password': 1.5,
    'Profile Name': 1.5,
    'Actions': 0.7,
  },
  'items': {
    'ID': 0.8,
    'Item Name': 1.5,
    'Description': 2.5,
    'Price': 0.8,
    'Category': 1,
    'Address': 1.2,
    'Seller': 1,
    'Actions': 0.7,
  },
};

const AdminLayout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [isViewingDatabase, setIsViewingDatabase] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
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
    return null;
  }

  const handleViewDatabase = async () => {
    try {
      setIsViewingDatabase(true);
      setActiveTab('database');
      const categoryData = await fetchCategories();
      const userData = await fetchUsers();
      const itemData = await fetchItems();
      setCategories(categoryData);
      setUsers(userData);
      setItems(itemData);
    } catch (error) {
      console.error('Error fetching data for database view:', error);
      Alert.alert('Error', 'Failed to fetch database data.');
    }
  };

  const handleNavigation = (route) => {
    setIsViewingDatabase(false);
    setActiveTab(route);
  };

  const handleEdit = (table, id, data) => {
    if (!data || id === undefined || id === null) {
      console.error('Invalid data or ID for editing', {table, id, data});
      Alert.alert('Error', 'Cannot edit record without a valid ID.');
      return;
    }
    setEditData({ table, id, data });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    const { table, id, data } = editData;
    const updatedData = { ...data };
    delete updatedData.id;

    try {
      const result = await updateRecord(table, id, updatedData);
      if (result && result.error) {
        throw new Error(typeof result.error === 'string' ? result.error : result.error.message || 'Unknown error during update');
      }
      setEditData(null);
      setIsEditing(false);
      Alert.alert('Success', 'Record updated successfully!');
      
      if (activeTab === 'database') {
        handleViewDatabase();
      }
    } catch (error) {
      console.error('Error saving edit:', error);
      Alert.alert('Error', `Failed to update record: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Clear admin authentication
              await AsyncStorage.removeItem(ADMIN_AUTH_KEY);
              
              // Log the navigation attempt for debugging
              console.log('Navigating to /logIn after logout');
              
              // Navigate to login screen
              router.replace('/logIn');
            } catch (error) {
              console.error('Error during admin logout:', error);
              Alert.alert('Logout Error', 'Failed to log out. Please try again.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderTable = (title, data, dataColumns, tableName) => {
    const tableColumnFlex = COLUMN_FLEX_MAP[tableName] || {};
    const allColumns = [...dataColumns, 'Actions'];

    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderContainer}>
          <Text style={styles.tableTitle}>{title}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={handleViewDatabase}>
            <FontAwesome5 name="sync-alt" size={16} color="#FDAD00" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableHeader}>
          {allColumns.map((col, index) => (
            <Text
              key={index}
              style={[
                styles.tableHeaderText,
                { flex: tableColumnFlex[col] || 1, textAlign: 'left', paddingHorizontal: 5, flexShrink: 0 }
              ]}
            >
              {col}
            </Text>
          ))}
        </View>
        {data.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) => item.id ? String(item.id) : index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                {dataColumns.map((col) => {
                  const key = col.toLowerCase().replace(/\s+/g, '_');
                  const value = item[key] !== undefined && item[key] !== null ? String(item[key]) : '';
                  return (
                    <TextInput
                      key={`${tableName}-${item.id}-${key}`}
                      style={[
                        styles.tableRowText,
                        { flex: tableColumnFlex[col] || 1, textAlign: 'left', paddingHorizontal: 5, minWidth: 0, flexShrink: 0 }
                      ]}
                      value={value}
                      editable={false}
                    />
                  );
                })}
                <TouchableOpacity
                  style={[styles.editButton, { flex: tableColumnFlex['Actions'] || 0.7 }]}
                  onPress={() => handleEdit(tableName, item.id, item)}
                >
                  <FontAwesome5 name="edit" size={16} color="#1B1B41" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <FontAwesome5 name="database" size={32} color="#FDAD00" />
            <Text style={styles.noDataText}>No data available for {title}</Text>
          </View>
        )}
      </View>
    );
  };

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

        <View style={styles.navContainer}>
          <TouchableOpacity
            style={[styles.navItem, activeTab === 'dashboard' && styles.activeNavItem]}
            onPress={() => handleNavigation('dashboard')}
          >
            <FontAwesome5 name="tachometer-alt" size={18} color={activeTab === 'dashboard' ? '#FDAD00' : '#1B1B41'} style={styles.navIcon} />
            <Text style={[styles.navText, activeTab === 'dashboard' && styles.activeNavText]}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'products' && styles.activeNavItem]}
            onPress={() => handleNavigation('products')}
          >
            <FontAwesome5 name="box" size={18} color={activeTab === 'products' ? '#FDAD00' : '#1B1B41'} style={styles.navIcon} />
            <Text style={[styles.navText, activeTab === 'products' && styles.activeNavText]}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'reports' && styles.activeNavItem]}
            onPress={() => handleNavigation('reports')}
          >
            <FontAwesome5 name="chart-bar" size={18} color={activeTab === 'reports' ? '#FDAD00' : '#1B1B41'} style={styles.navIcon} />
            <Text style={[styles.navText, activeTab === 'reports' && styles.activeNavText]}>Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'users' && styles.activeNavItem]}
            onPress={() => handleNavigation('users')}
          >
            <FontAwesome5 name="users" size={18} color={activeTab === 'users' ? '#FDAD00' : '#1B1B41'} style={styles.navIcon} />
            <Text style={[styles.navText, activeTab === 'users' && styles.activeNavText]}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, activeTab === 'database' && styles.activeNavItem]}
            onPress={handleViewDatabase}
          >
            <FontAwesome5 name="database" size={18} color={activeTab === 'database' ? '#FDAD00' : '#1B1B41'} style={styles.navIcon} />
            <Text style={[styles.navText, activeTab === 'database' && styles.activeNavText]}>Database</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={18} color="#1B1B41" style={styles.navIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'products' && 'Products Management'}
              {activeTab === 'reports' && 'Reports & Analytics'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'database' && 'Database Administration'}
            </Text>
            <Text style={styles.pageSubtitle}>
              {activeTab === 'dashboard' && 'Welcome to BuyNaBay Admin Panel'}
              {activeTab === 'products' && 'Manage your marketplace products'}
              {activeTab === 'reports' && 'View analytics and reports'}
              {activeTab === 'users' && 'Manage user accounts and permissions'}
              {activeTab === 'database' && 'View and modify database records'}
            </Text>
          </View>
          <View style={styles.adminInfo}>
            <View style={styles.adminTextContainer}>
              <Text style={styles.adminName}>Admin User</Text>
              <Text style={styles.adminRole}>Admin</Text>
            </View>
            <View style={styles.adminAvatar}>
              <FontAwesome5 name="user-circle" size={32} color="#1B1B41" />
            </View>
          </View>
        </View>

        {/* Conditional Rendering of Content */}
        {activeTab === 'dashboard' ? (
          <Dashboard />
        ) : activeTab === 'database' && isViewingDatabase ? (
          <ScrollView style={styles.databaseContent}>
            {renderTable('Categories', categories, ['Category ID', 'Label'], 'category')}
            {renderTable('Users', users, ['ID', 'Phone Number', 'School ID', 'Email', 'Password', 'Profile Name'], 'users')}
            {renderTable('Items', items, ['ID', 'Item Name', 'Description', 'Price', 'Category', 'Address', 'Seller'], 'items')}
          </ScrollView>
        ) : activeTab === 'products' ? (
          <AdminProductsScreen />
        ) : activeTab === 'reports' ? (
          <ReportsScreen />
        ) : activeTab === 'users' ? (
          <UsersScreen />
        ) : (
          children
        )}

        {/* Edit Modal for the 'Database' tab */}
        {isEditing && editData && activeTab === 'database' && (
          <View style={styles.editModal}>
            <View style={styles.editModalContent}>
              <View style={styles.editModalHeader}>
                <Text style={styles.editModalTitle}>Edit Record (Table: {editData.table}, ID: {editData.id})</Text>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <FontAwesome5 name="times" size={20} color="#FDAD00" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.editModalForm}>
                {Object.keys(editData.data).map((key) => (
                  key !== 'id' && <View key={key} style={styles.formGroup}>
                    <Text style={styles.formLabel}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}</Text>
                    <TextInput
                      style={styles.formInput}
                      value={editData.data[key] === null || editData.data[key] === undefined ? '' : String(editData.data[key])}
                      onChangeText={(text) => {
                        setEditData(prevEditData => ({
                          ...prevEditData,
                          data: { ...prevEditData.data, [key]: text },
                        }));
                      }}
                    />
                  </View>
                ))}
              </ScrollView>
              <View style={styles.editModalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 300,
    paddingVertical: 40,
    justifyContent: 'space-between',
    elevation: 5,
    borderTopRightRadius: 20,
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
  navContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignSelf: 'stretch',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeNavItem: {
    backgroundColor: '#1B1B41',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  navText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1B1B41',
    marginLeft: 15,
  },
  activeNavText: {
    color: '#FDAD00',
    fontFamily: 'Poppins_700Bold',
  },
  navIcon: {
    marginLeft: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1B1B41',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 25,
    position: 'relative',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
  },
  pageSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 5,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminTextContainer: {
    marginRight: 15,
    alignItems: 'flex-end',
  },
  adminName: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1B1B41',
  },
  adminRole: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDAD00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  databaseContent: {
    flex: 1,
  },
  tableContainer: {
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tableHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1B1B41',
    padding: 15,
  },
  tableTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#FDAD00',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 173, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#FDAD00',
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    marginLeft: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    padding: 12,
  },
  tableHeaderText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#1B1B41',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  tableRowText: {
    color: '#555',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  editButton: {
    backgroundColor: '#FDAD00',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  editModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  editModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '70%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  editModalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#1B1B41',
  },
  editModalForm: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#555',
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    padding: 10,
    fontFamily: 'Poppins_400Regular',
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  editModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#FDAD00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
});

export default AdminLayout;