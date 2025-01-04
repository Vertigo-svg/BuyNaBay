import React, { useState } from 'react';
import { View, Text, Button, FlatList, ScrollView, StyleSheet, TextInput } from 'react-native';
import { fetchCategories, fetchUsers, fetchItems, updateRecord, insertRecord } from './database';

const AdminLayout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [isViewingDatabase, setIsViewingDatabase] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleViewDatabase = async () => {
    setIsViewingDatabase(true);
    const categoryData = await fetchCategories();
    const userData = await fetchUsers();
    const itemData = await fetchItems();
    setCategories(categoryData);
    setUsers(userData);
    setItems(itemData);
  };

  const handleEdit = (table, id, data) => {
    setEditData({ table, id, data });
  };

  const handleSaveEdit = async () => {
    const { table, id, data } = editData;
    const updatedData = {};

    Object.keys(data).forEach((key) => {
      updatedData[key] = data[key];
    });

    await updateRecord(table, id, updatedData);
    setEditData(null);
    handleViewDatabase();
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
      <View style={{ width: 250, backgroundColor: '#1B1B41' }}>
        <Text style={{ color: '#FFF', padding: 20 }}>Admin Menu</Text>
        <Button title="View Database" onPress={handleViewDatabase} color="#FFF" />
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, padding: 20 }}>
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
  tableContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    padding: 10,
  },
  tableRowText: {
    flex: 1,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    padding: 10,
    color: '#888',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default AdminLayout;
