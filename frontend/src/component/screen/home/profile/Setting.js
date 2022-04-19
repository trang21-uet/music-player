import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function Setting() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#ccc',
  },
});
