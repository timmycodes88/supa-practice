import {
  View,
  Text,
  Alert,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native"
import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supbase"
import useUser from "../useUser"

export default function AppTime() {
  const { user } = useUser()
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  useEffect(() => {
    ;(async () => {
      let { data, error } = await supabase.from("Messages").select("*")

      if (error) Alert.alert("error 88", error.message)

      setMessages(data)
    })()
  }, [])

  const sendMessage = async () => {
    console.log(user.name)
    const { data, error } = await supabase
      .from("Messages")
      .insert([{ message, sender_name: user.name }])
      .select()

    if (error) Alert.alert("error 69", error.message)
    setMessages([...messages, ...data])
    setMessage("")
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }
  return (
    <View style={styles.container}>
      {/* Chat Messages */}
      <View style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={message.id}
            style={[
              styles.message,
              {
                alignSelf: message.sender === "You" ? "flex-end" : "flex-start",
                marginLeft: message.sender === "You" ? 20 : 0,
                marginRight: message.sender === "You" ? 0 : 20,
              },
            ]}
          >
            <Text style={styles.senderName}>{message.sender_name}</Text>
            <Text style={styles.messageText}>{message.message}</Text>
          </View>
        ))}
      </View>

      {/* Message Input and Send Button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={text => setMessage(text)}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  message: {
    maxWidth: "70%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
})
