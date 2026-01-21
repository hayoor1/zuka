import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Navbar } from '../components/Navbar';

type Persona = 'grumpy' | 'rude' | 'nonchalant' | 'funny';

type Message = {
  role: 'user' | 'pet';
  text: string;
};

export default function PetPage() {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona>('funny');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'pet', text: "Hey! I'm your shopping buddy. Ask me for products, coupons, or help with anything!" },
  ]);
  const [inputText, setInputText] = useState('');

  const personaColors = {
    grumpy: { bg: '#fee2e2', text: '#dc2626', icon: '😤' },
    rude: { bg: '#fef3c7', text: '#d97706', icon: '😏' },
    nonchalant: { bg: '#e0e7ff', text: '#6366f1', icon: '😑' },
    funny: { bg: '#d1fae5', text: '#059669', icon: '😄' },
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { role: 'user', text: inputText };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<Persona, string[]> = {
        grumpy: [
          "Ugh, fine. Here are some tees under ₦10k...",
          "Really? That's what you want? Okay, here you go.",
          "I guess I can help with that. But don't expect me to be happy about it.",
        ],
        rude: [
          "Oh wow, another basic request. Here, take it.",
          "Sure, whatever. Here are your products.",
          "Fine. But you could've just searched yourself, you know?",
        ],
        nonchalant: [
          "Yeah, sure. Here's what I found.",
          "Okay. Here are some options.",
          "Mmhmm. Check these out.",
        ],
        funny: [
          "Ooh, shopping time! 🎉 Let me find the perfect stuff for you!",
          "Aha! I got you covered! Check out these amazing finds!",
          "Boom! 💥 Here's what I found - you're gonna love these!",
        ],
      };

      const randomResponse =
        responses[persona][Math.floor(Math.random() * responses[persona].length)];
      const petMessage: Message = { role: 'pet', text: randomResponse };
      setMessages((prev) => [...prev, petMessage]);
    }, 1000);

    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Navbar />
      <View style={styles.content}>
        {/* Persona Selector */}
        <View style={styles.personaContainer}>
          <Text style={styles.personaLabel}>Choose Your Shopping Buddy</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.personaScroll}>
            {(['grumpy', 'rude', 'nonchalant', 'funny'] as Persona[]).map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPersona(p)}
                style={[
                  styles.personaButton,
                  persona === p && styles.personaButtonActive,
                  { backgroundColor: personaColors[p].bg },
                ]}
              >
                <Text style={styles.personaEmoji}>{personaColors[p].icon}</Text>
                <Text
                  style={[
                    styles.personaText,
                    persona === p && { color: personaColors[p].text },
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
                {persona === p && (
                  <Ionicons name="checkmark-circle" size={20} color={personaColors[p].text} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Messages */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userBubble : styles.petBubble,
              ]}
            >
              {message.role === 'pet' && (
                <View
                  style={[
                    styles.petAvatar,
                    { backgroundColor: personaColors[persona].bg },
                  ]}
                >
                  <Text style={styles.petAvatarEmoji}>{personaColors[persona].icon}</Text>
                </View>
              )}
              <View
                style={[
                  styles.messageContent,
                  message.role === 'user' && styles.userMessageContent,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.role === 'user' && styles.userMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
              {message.role === 'user' && (
                <View style={styles.userAvatar}>
                  <Ionicons name="person" size={16} color="#570a70" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Ask for products, coupons, shipping..."
              value={inputText}
              onChangeText={setInputText}
              style={styles.input}
              placeholderTextColor="#999"
              multiline
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={styles.sendButton}
              disabled={!inputText.trim()}
            >
              <LinearGradient
                colors={['#3d074e', '#570a70']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Quick suggestions:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Tees under ₦10k', 'Best sellers', 'Free shipping', 'New arrivals'].map(
                (suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={styles.suggestionChip}
                    onPress={() => {
                      setInputText(suggestion);
                      sendMessage();
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf8ff',
  },
  content: {
    flex: 1,
  },
  personaContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6ff',
  },
  personaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#570a70',
    marginBottom: 12,
  },
  personaScroll: {
    flexDirection: 'row',
  },
  personaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  personaButtonActive: {
    borderColor: '#570a70',
  },
  personaEmoji: {
    fontSize: 20,
  },
  personaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
    gap: 8,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  petBubble: {
    justifyContent: 'flex-start',
  },
  petAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petAvatarEmoji: {
    fontSize: 20,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3e9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContent: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0e6ff',
  },
  userMessageContent: {
    backgroundColor: '#570a70',
    borderColor: '#570a70',
  },
  messageText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0e6ff',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestions: {
    marginTop: 8,
  },
  suggestionsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: '#f3e9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 12,
    color: '#570a70',
    fontWeight: '600',
  },
});

