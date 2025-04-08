import React from 'react';
import { SafeAreaView ,View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Diary() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> 
      <Text>Diary</Text>
      <TouchableOpacity style={styles.button}>
        <Text>{"+"}</Text>
      </TouchableOpacity>
    </SafeAreaView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
})