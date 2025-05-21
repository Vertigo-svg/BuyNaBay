import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { FontAwesome5 } from '@expo/vector-icons';
import { fetchUsers, updateRecord } from './database';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Load the Poppins font
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

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users. Please try again.');
    }
  };

  const filterUsers = () => {
    const filtered = users.filter(user => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (user.profile_name && user.profile_name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.phone_number && user.phone_number.toLowerCase().includes(searchLower))
      );
    });
    setFilteredUsers(filtered);
  };

  const handleEdit = (id, data) => {
    if (!data || id === undefined || id === null) {
      console.error('Invalid data or ID for editing', { id, data });
      Alert.alert('Error', 'Cannot edit user without a valid ID.');
      return;
    }
    setEditData({ id, data });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;

    const { id, data } = editData;
    const updatedData = { ...data };

    delete updatedData.id;

    try {
      const result = await updateRecord('users', id, updatedData);

      if (result && result.error) {
        throw new Error(result.error);
      }

      setEditData(null);
      setIsEditing(false);
      Alert.alert('Success', 'User updated successfully!');
      loadUsers();
    } catch (error) {
      console.error('Error saving edit:', error);
      Alert.alert('Error', `Failed to update user: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const handleToggleStatus = (user) => {
    // Assuming status is stored as is_active field (boolean)
    const updatedUser = {
      ...user,
      is_active: user.is_active ? false : true
    };
    
    handleEdit(user.id, updatedUser);
    // Auto-save the status change
    setEditData({ id: user.id, data: updatedUser });
    handleSaveEdit();
  };

  if (!fontsLoaded) {
    return null; // Return null until fonts are loaded
  }

  const renderUserItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { flex: 1 }]}>
        <Text style={styles.tableCellText}>{item.id}</Text>
      </View>
      <View style={[styles.tableCell, { flex: 2 }]}>
        <Text style={styles.tableCellText}>{item.profile_name || 'N/A'}</Text>
      </View>
      <View style={[styles.tableCell, { flex: 2 }]}>
        <Text style={styles.tableCellText}>{item.email || 'N/A'}</Text>
      </View>
      <View style={[styles.tableCell, { flex: 1.5 }]}>
        <Text style={styles.tableCellText}>{item.phone_number || 'N/A'}</Text>
      </View>
      <View style={[styles.tableCell, { flex: 1.2 }]}>
        <Text 
          style={[
            styles.statusText, 
            { color: item.is_active ? '#4CAF50' : '#F44336' }
          ]}
        >
          {item.is_active ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', justifyContent: 'space-between' }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item.id, item)}
        >
          <FontAwesome5 name="edit" size={16} color="#1B1B41" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: item.is_active ? '#F44336' : '#4CAF50' }
          ]}
          onPress={() => handleToggleStatus(item)}
        >
          <FontAwesome5 
            name={item.is_active ? "user-slash" : "user-check"} 
            size={16} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Page Header - Already provided by _layout.js */}

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.headerActionsContainer}>
          <View style={styles.searchContainer}>
            <FontAwesome5 name="search" size={16} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadUsers}
          >
            <FontAwesome5 name="sync-alt" size={16} color="#FDAD00" />
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={[styles.tableHeaderCell, { flex: 1 }]}>
              <Text style={styles.tableHeaderText}>ID</Text>
            </View>
            <View style={[styles.tableHeaderCell, { flex: 2 }]}>
              <Text style={styles.tableHeaderText}>Name</Text>
            </View>
            <View style={[styles.tableHeaderCell, { flex: 2 }]}>
              <Text style={styles.tableHeaderText}>Email</Text>
            </View>
            <View style={[styles.tableHeaderCell, { flex: 1.5 }]}>
              <Text style={styles.tableHeaderText}>Phone</Text>
            </View>
            <View style={[styles.tableHeaderCell, { flex: 1.2 }]}>
              <Text style={styles.tableHeaderText}>Status</Text>
            </View>
            <View style={[styles.tableHeaderCell, { flex: 1 }]}>
              <Text style={styles.tableHeaderText}>Actions</Text>
            </View>
          </View>

          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id ? String(item.id) : Math.random().toString()}
            renderItem={renderUserItem}
            ListEmptyComponent={
              <View style={styles.noDataContainer}>
                <FontAwesome5 name="users" size={32} color="#FDAD00" />
                <Text style={styles.noDataText}>No users found</Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Edit Modal */}
      {isEditing && editData && (
        <View style={styles.editModal}>
          <View style={styles.editModalContent}>
            <View style={styles.editModalHeader}>
              <Text style={styles.editModalTitle}>Edit User (ID: {editData.id})</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <FontAwesome5 name="times" size={20} color="#FDAD00" />
              </TouchableOpacity>
            </View>

            <View style={styles.editModalForm}>
              {Object.keys(editData.data).map((key) => {
                // Skip rendering ID field or other non-editable fields
                if (key === 'id' || key === 'created_at' || key === 'updated_at') {
                  return null;
                }
                
                // Special handling for boolean values like is_active
                if (typeof editData.data[key] === 'boolean') {
                  return (
                    <View key={key} style={styles.formGroup}>
                      <Text style={styles.formLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                      </Text>
                      <View style={styles.toggleContainer}>
                        <TouchableOpacity
                          style={[
                            styles.toggleButton,
                            editData.data[key] ? styles.toggleActive : styles.toggleInactive
                          ]}
                          onPress={() => {
                            setEditData(prevEditData => ({
                              ...prevEditData,
                              data: { ...prevEditData.data, [key]: !prevEditData.data[key] },
                            }));
                          }}
                        >
                          <Text style={styles.toggleText}>
                            {editData.data[key] ? 'Active' : 'Inactive'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }
                
                return (
                  <View key={key} style={styles.formGroup}>
                    <Text style={styles.formLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                    </Text>
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
                );
              })}
            </View>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  headerActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 173, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FDAD00',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1B1B41',
    padding: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeaderCell: {
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#FDAD00',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  tableCell: {
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tableCellText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#333',
  },
  statusText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#FDAD00',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
    width: 32,
    height: 32,
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
    elevation: 5,
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
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleInactive: {
    backgroundColor: '#F44336',
  },
  toggleText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
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

export default AdminUsers;