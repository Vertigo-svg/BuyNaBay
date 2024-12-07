import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Modal, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons

export default function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState(null); // State to manage selected message
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  const notifications = [
    { id: '1', name: 'Allyn Kyle Cambaya', username: 'allyn_cambaya', message: 'I really want us to work together on the BuyNaBay project. Do you have time?', image: require('../../../../assets/seller1.jpeg') },
    { id: '2', name: 'Joevel Berana', username: 'joevel_berana', message: 'I want to join the BuyNaBay project. How do we start?', image: require('../../../../assets/seller2.png') },
    { id: '3', name: 'Emmanuel Redoble', username: 'emmanuel_redoble', message: 'Emmanuel, the BuyNaBay project is really interesting. Do you have time to join me?', image: require('../../../../assets/seller3.png') },
    { id: '4', name: 'John Lloyd Morden', username: 'john_lloyd', message: 'I’m interested in working on the BuyNaBay project. Can we discuss it?', image: require('../../../../assets/seller4.png') },
    { id: '5', name: 'Alaiza Rose Olores', username: 'alaiza_olores', message: 'I’m excited to join the BuyNaBay project. What’s your schedule like now?', image: require('../../../../assets/seller5.png') },
    { id: '6', name: 'Evegen Dela Cruz', username: 'evegen_dela_cruz', message: 'I’m preparing for the BuyNaBay project. Where do we start?', image: require('../../../../assets/seller6.png') },
    { id: '7', name: 'John Kenneth Pang-an', username: 'john_kenneth', message: 'Kenneth, andam naba ka maka palit sa imong paborito nga baligya? Visit our store now!', image: require('../../../../assets/seller7.png') },
  ];

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter(notification =>
    notification.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePress = (item) => {
    setSelectedMessage(item); // Set selected message
    setModalVisible(true); // Show modal
  };

  const closeModal = () => {
    setModalVisible(false); // Hide modal
    setSelectedMessage(null); // Clear selected message
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { /* Add navigation logic here */ }}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.username}>Lloyd_Nedrom</Text>
        <View style={styles.iconContainer}>
          <Icon name="create" size={30} color="#000" style={styles.icon} />
          <Icon name="camera-alt" size={30} color="#000" style={styles.icon} />
        </View>
      </View>

      {/* Stories Section */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesSection}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.storyContainer}>
            <Image source={notification.image} style={styles.storyImage} />
            <Text style={styles.storyCaption}>{notification.username}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Tab Selector Section */}
      <View style={styles.tabSelector}>
        <Text style={[styles.tabText, styles.activeTab]}>Messages</Text>
        <Text style={styles.tabText}>Channels</Text>
        <Text style={styles.tabText}>Requests</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        placeholder="Search messages..."
        value={searchQuery}
        onChangeText={setSearchQuery} // Update search query state
        style={styles.searchBar}
      />

      {/* FlatList for Notifications */}
      <FlatList
        data={filteredNotifications} // Use filtered notifications
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.notificationCard}
            onPress={() => handlePress(item)} // Handle press to open modal
          >
            <Image source={item.image} style={styles.profileImage} />
            <View style={styles.messageContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Full-Screen Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <TouchableOpacity onPress={closeModal}>
              <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalUsername}>{selectedMessage?.username}</Text>
            <Icon name="info-outline" size={30} color="#000" />
          </View>

          {/* Profile Overview */}
          {selectedMessage && (
            <>
              <View style={styles.profileHeader}>
                <Image source={selectedMessage.image} style={styles.expandedProfileImage} />
                <View style={styles.profileInfo}>
                  <Text style={styles.expandedName}>{selectedMessage.name}</Text>
                  <Text style={styles.expandedUsername}>{selectedMessage.username}</Text>
                  <Text style={styles.followInfo}>1.8M followers · 250 posts</Text>
                  <Text style={styles.followNote}>You don’t follow each other on BuyNaBay</Text>
                </View>
              </View>

              {/* Spacing between profile and message bubble */}
              <View style={{ paddingVertical: 15 }} />

              {/* Message Area */}
              <View style={[styles.messageArea]}>
                {/* Message Bubble with Profile Picture */}
                <View style={[styles.bubbleContainer]}>
                  <Image source={selectedMessage.image} style={[styles.bubbleProfileImage]} />
                  <View style={[styles.bubble]}>
                    <Text>{selectedMessage.message}</Text>
                  </View>
                </View>
                <Text style={[styles.timestamp]}>4:27 PM</Text>
              </View>

              {/* Bottom Section */}
              <View style={[styles.footer]}>
                <Icon name="photo-camera" size={30} color="#000" />
                <TextInput placeholder="Message..." style={[styles.input]} />
                {/* Add more icons for voice recording or stickers if needed */}
                <Icon name="mic" size={30} color="#000" />
              </View>

              {/* Supportive Message */}
              <Text style={[styles.supportiveMessage]}>
                Help keep BuyNaBay a supportive place.
              </Text>
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingTop: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
    flexGrow :1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon:{
     marginLeft :15
   },
   storiesSection:{
     marginVertical :15,
   },
   storyContainer:{
     alignItems:'center',
     marginRight :10,
     marginBottom:50,
   },
   storyImage:{
     width :60,
     height :60,
     borderRadius :30,
     borderWidth :2,
     borderColor :'#FFFFFF',
   },
   storyCaption:{
     marginTop :5,
     fontSize :12,
     textAlign:'center'
   },
   tabSelector:{
     flexDirection:'row',
     justifyContent:'space-around',
     marginBottom :1,
     marginTop :0, // Adjusted margin to ensure visibility of story names
   },
   tabText:{
     fontSize :16,
     color :'#000'
   },
   activeTab:{
     fontWeight :'bold',
     color :'#007AFF' // Highlighted color for active tab
   },
   searchBar:{
     height :40,
     borderColor:'#CCCCCC',
     borderWidth :1,
     borderRadius :20,
     paddingHorizontal :15,
     marginBottom :20
   },
   notificationCard:{
     flexDirection:'row',
     alignItems:'center',
     backgroundColor:'#F8F8F8',
     borderRadius :10,
     paddingVertical :15,
     paddingHorizontal :10,
     marginBottom :15,
     shadowColor:'#000',
     shadowOpacity :0.1,
     shadowRadius :5,
     elevation :3
   },
   profileImage:{
     width :50,
     height :50,
     borderRadius :25
   },
   messageContainer:{
      flexGrow :1
   },
   name:{
      fontSize :16,
      fontWeight:'600',
      color:'#000'
   },
   message:{
      fontSize :14,
      color:'#666'
   },
   modalContainer:{
       flexGrow :1,
       backgroundColor:'#FFFFFF',
       paddingTop :50 // Space for status bar and close button
   },
   topSection:{
       flexDirection:'row',
       alignItems:'center',
       justifyContent:'space-between',
       paddingHorizontal :20,
       height :50,
       backgroundColor :'#FFFFFF'
   },
   modalUsername:{
       fontSize :18,
       fontWeight :'bold',
       textAlign:'center'
   },
   profileHeader:{
       flexDirection:'row',
       alignItems:'center',
       marginBottom :10,
       paddingHorizontal :20,
       paddingTop:15 // Padding above profile section
   },
   expandedProfileImage:{
       width :80,
       height :80,
       borderRadius :40,
       borderWidth :2,
       borderColor :'#FFFFFF' // White border around profile picture
   },
   profileInfo:{
       marginLeft :10
   },
   expandedName:{
       fontSize :22,
       fontWeight :'bold'
   },
   expandedUsername:{
       fontSize :16,
       color :'#666'
   },
   followInfo:{
       fontSize :14,
       color :'#999'
   },
   followNote:{
       fontSize :14,
       color :'#999'
   },
   messageArea:{
       paddingVertical :160,
       paddingHorizontal :15,
       marginRight: 20,
   },
   bubbleContainer:{
       flexDirection:'row',
       alignItems:'flex-start', // Align items at the start of the container
       marginVertical: 25, // Space between messages and profile section
       paddingHorizontal: 10, // Padding around the bubble container
   },
   bubbleProfileImage:{
       width :40, 
       height :40, 
       borderRadius :20, 
       marginRight :5 // Space between image and bubble
   },
   bubble:{
       backgroundColor:'#E0F7FA',
       borderRadius :15,
       paddingHorizontal :10,
       paddingVertical :10,
       alignSelf:'flex-start' // Align bubble in the view
   },
   timestamp:{
       fontSize :12,
       color :'#999',
       alignSelf:'flex-start' // Align timestamp under the bubble in center
   },
   footer:{
       flexDirection:'row',
       alignItems:'center',
       borderTopWidth :1,
       borderTopColor :'#CCCCCC',
       paddingTop :10,
       paddingHorizontal :20
   },
   input:{
       flexGrow :1,
       height :40,
       borderColor:'#CCCCCC',
       borderWidth :1,
       borderRadius :20,
       paddingHorizontal :15,
       marginLeft :10
   },
   supportiveMessage:{
      textAlign:'center',
      marginTop :10,
      color:'#666'
   }
});