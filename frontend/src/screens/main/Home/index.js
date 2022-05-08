import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  FlatList,
} from 'react-native';
import React, {useEffect} from 'react';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Genre>Pop</Genre>
        <Genre>Jazz</Genre>
        <Genre>Rock</Genre>
      </View>
    </View>
  );
}

const Genre = ({children}) => {
  return (
    <TouchableNativeFeedback>
      <View style={styles.genre}>
        <Text style={styles.genreText}>{children}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    backgroundColor: '#000',
  },
  genre: {
    padding: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreText: {
    fontSize: 20,
    color: '#ccc',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});
