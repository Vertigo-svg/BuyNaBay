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
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZXpjbG9oaXRzaWVnemhoaGdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwMjkxNDIsImV4cCI6MjA0ODYwNTE0Mn0.iAMC6qmEzBO-ybtLj9lQLxkrWMddippN6vsGYfmMAjQ';
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
      user.profile_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      messages.some(
        (msg) =>
          (msg.sender_email === user.email || msg.receiver_email === user.email) &&
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
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
    const formattedTimestamp = new Date(item.created_at).toLocaleString(); // Format timestamp

    return (
      <View
        style={[
          styles.messageBubble,
          isSender ? styles.messageBubbleSender : styles.messageBubbleReceiver,
        ]}
      >
        <Text style={styles.messageText}>{item.content}</Text>
        <View style={styles.timestampContainer}>
          <Text style={styles.timestampText}>{formattedTimestamp}</Text>
          <Ionicons
            name="checkmark-outline"
            size={14}
            color="#888"
            style={styles.checkIcon}
          />
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
              color="#007BFF"
              style={styles.addButton}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
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
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  list: { paddingVertical: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f3f3f3',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userDetailsContainer: { flex: 1 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  lastMessageText: { fontSize: 14, color: '#666', marginTop: 2 },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: { fontSize: 18, color: '#007BFF', marginRight: 10 },
  chatHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  messagesList: { paddingVertical: 12 },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
    maxWidth: '80%',
  },
  messageBubbleSender: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
  },
  messageBubbleReceiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: { color: '#fff', fontSize: 16 },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timestampText: { fontSize: 12, color: '#888', marginRight: 5 },
  checkIcon: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    backgroundColor: '#f3f3f3',
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 30,
  },
  addButton: { marginRight: 10 },
});

export default UserListScreen;
