import React, { useState, useEffect } from "react";
import { Text, TextInput, Button, View, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const SERVER_URL = "https://YOUR_RENDER_URL";

export default function App() {
  const [train, setTrain] = useState("");
  const [date, setDate] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    registerForPush();
  }, []);

  async function registerForPush() {
    if (!Device.isDevice) return;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    setToken(tokenData.data);
  }

  const startTracking = async () => {
    try {
      await fetch(`${SERVER_URL}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          train,
          date
        })
      });

      Alert.alert("Tracking started");
    } catch (e) {
      Alert.alert("Server error");
    }
  };

  return (
    <View style={{ padding: 40 }}>
      <Text>Train Number</Text>
      <TextInput
        value={train}
        onChangeText={setTrain}
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <Text>Date (DD-MM-YYYY)</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, marginBottom: 20 }}
      />

      <Button title="Start Tracking" onPress={startTracking} />
    </View>
  );
}
