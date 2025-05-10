import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
AI
export default function AI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);
  const apikey = 'AIzaSyD5KKUKHGBAIsBTgUVCuJ4wPonX4eec1GU';
  const flatListRef = useRef(null); // Reference for FlatList

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, 'Product');
        const snapshot = await getDocs(productsRef);
        const productsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Fetched products:', productsData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    const lastMessages = updatedMessages.slice(-10);

    setMessages(updatedMessages);
    setInput('');

    // Auto-scroll to the bottom
    flatListRef.current?.scrollToEnd({ animated: true });

    const productList = products
      .map((p) => `${p.name || 'Unnamed Product'} - ${p.description || 'No description available'}`)
      .join(', ');

    const chatHistory = lastMessages
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
      .join('\n');

    const content = {
      contents: [
        {
          parts: [
            {
              text: `You are a helpful chatbot that knows the products of our site; it's name is freshPath. We offer a good amount of healthy food. Here is the product list:\n${productList}\n\nChat history:\n${chatHistory}\n\nUser: ${input}\nBot:`,
            },
          ],
        },
      ],
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(content),
        }
      );

      const data = await response.json();
      console.log('Gemini API response:', data);

      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
      ) {
        const botMessageText = data.candidates[0].content.parts.map((part) => part.text).join(' ');
        const botMessage = { sender: 'bot', text: botMessageText };
        setMessages((prev) => [...prev, botMessage]);

        // Auto-scroll to the bottom after bot response
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      } else {
        console.error('Invalid response from Gemini API:', data);
        const errorMessage = { sender: 'bot', text: 'Sorry, I could not process your request.' };
        setMessages((prev) => [...prev, errorMessage]);

        // Auto-scroll to the bottom after error
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (error) {
      console.error('Error communicating with Gemini API:', error);
      const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' };
      setMessages((prev) => [...prev, errorMessage]);

      // Auto-scroll to the bottom after error
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef} // Attach the FlatList reference
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // Auto-scroll on content change
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })} // Auto-scroll on layout
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4a90e2',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
  },
  messageText: {
    color: '#000', // Ensure text is readable on both backgrounds
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    color: '#000', // Ensure text is readable in input
  },
  sendButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});