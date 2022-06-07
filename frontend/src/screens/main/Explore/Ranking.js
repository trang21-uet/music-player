import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function Ranking() {
  return (
    <View style={styles.container}>
      <Text style={{color: '#ccc'}}>Ranking</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
