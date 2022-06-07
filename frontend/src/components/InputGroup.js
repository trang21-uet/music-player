import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';

export default function InputGroup({title}) {
  const [value, setValue] = useState('');
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputTitle}>{title}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={value => setValue(value)}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginVertical: 12,
    marginHorizontal: 10,
  },
  inputTitle: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 8,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  input: {
    height: 45,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
