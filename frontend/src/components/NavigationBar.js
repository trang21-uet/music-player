import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

export default function NavigationBar() {
  const [selected, setSelected] = useState('Home');
  const props = {selected, setSelected};
  return (
    <View style={styles.container}>
      <Button {...props} title="Home" icon="home" />
      <Button {...props} title="Explore" icon="search" />
      <Button {...props} title="Ranking" icon="bar-chart" />
      <Button {...props} title="Profile" icon="person" />
    </View>
  );
}

const Button = ({title, icon, selected, setSelected}) => {
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(title);
        setSelected(title);
      }}>
      <View style={styles.button}>
        <Ionicons
          name={icon}
          size={25}
          color={selected === title ? '#2E8B57' : '#ccc'}
        />
        <Text
          style={{
            fontSize: 12,
            color: selected === title ? '#2E8B57' : '#ccc',
          }}>
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopColor: '#414141',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
