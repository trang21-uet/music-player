import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Ranking from './Ranking';

export const Explore = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 30}}>Explore</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {Ranking};
