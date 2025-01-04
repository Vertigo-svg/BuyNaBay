import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ktezclohitsiegzhhhgo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ'; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentChat) fetchMessages(currentChat.email);
  }, [currentChat]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('profile_name, profile_avatar, email');

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  const fetchMessages = async (email) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_email.eq.${email},receiver_email.eq.${email}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const { error } = await supabase.from('messages').insert([
      {
        content: newMessage,
        sender_email: 'berana.joevel44@gmail.com', // Replace with the sender's email
        receiver_email: currentChat.email, // Ensure this exists in your users table
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          content: newMessage,
          sender_email: 'berana.joevel44@gmail.com',
          receiver_email: currentChat.email,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.profile_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      messages.some(
        (msg) =>
          (msg.sender_email === user.email || msg.receiver_email === user.email) &&
          (msg.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
      )
  );

  const renderUser = ({ item }) => {
    const lastMessage = messages
      .filter(
        (msg) =>
          msg.sender_email === item.email || msg.receiver_email === item.email
      )
      .slice(-1)[0];

    return (
      <TouchableOpacity
        style={styles.userContainer}
        onPress={() => setCurrentChat(item)}
      >
        <Image source={{ uri: item.profile_avatar }} style={styles.avatar} />
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userName}>{item.profile_name}</Text>
          {lastMessage && (
            <Text style={styles.lastMessageText} numberOfLines={1}>
              {lastMessage.sender_email === 'berana.joevel44@gmail.com'
                ? `You: ${lastMessage.content}`
                : lastMessage.content}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessage = ({ item }) => {
    const isSender = item.sender_email === 'berana.joevel44@gmail.com';
    const formattedTimestamp = new Date(item.created_at).toLocaleString();

    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.messageBubbleSender : styles.messageBubbleReceiver,
        ]}
      >
        <Text
          style={
            isSender
              ? styles.senderMessageText
              : styles.receiverMessageText
          }
        >
          {item.content}
        </Text>
        <View style={styles.timestampContainer}>
          <Text
            style={
              isSender
                ? styles.senderTimestampText
                : styles.receiverTimestampText
            }
          >
            {formattedTimestamp}
            <Ionicons
            name="checkmark-outline"
            size={10}
            color={isSender ? '#000' : '#FDAD00'} 
            style={styles.checkIcon}
          />
          </Text>
         
        </View>
      </View>
    );
  };

  if (currentChat) {
    return (
      <View style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setCurrentChat(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.chatHeaderTitle}>{currentChat.profile_name}</Text>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <Ionicons
              name="add-circle-outline"
              size={30}
              color="#FDAD00"
              style={styles.addButton}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#AAA"
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#1B1B41" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/BuyNaBay2.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>BuyNaBay</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#FDAD00" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#AAA"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.email}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B41',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    color: '#FFFF',
    fontFamily: 'Poppins_700Bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#FFF' },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#2E2E5E',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userDetailsContainer: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#FDAD00' },
  lastMessageText: { fontSize: 14, color: '#FFF', marginTop: 2 },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#2E2E5E',
    borderBottomColor: '#FDAD00',
    marginTop: 50,
  },
  backButton: { fontSize: 18, color: '#FDAD00', marginRight: 10 },
  chatHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  messagesList: { paddingVertical: 12 },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
    maxWidth: '80%',
  },
  messageBubbleSender: {
    alignSelf: 'flex-end',
    backgroundColor: '#FDAD00',
  },
  messageBubbleReceiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#2E2E5E',
  },
  senderMessageText: {
    color: '#FFF',
    fontSize: 16,
  },
  receiverMessageText: {
    color: '#FFF',
    fontSize: 16,
  },
  senderTimestampText: {
    fontSize: 11,
    color: '#000',
    marginRight: 5,
  },
  receiverTimestampText: {
    fontSize: 11,
    color: '#FDAD00',
    marginRight: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopColor: '#FDAD00',
    backgroundColor: '#2E2E5E',
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 30,
    backgroundColor: '#FFF',
    color: '#2E2E5E',
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#FDAD00',
    padding: 12,
    borderRadius: 30,
  },
  addButton: { marginRight: 10 },
});

export default UserListScreen;
