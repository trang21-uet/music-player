import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

export default function NavigationBar() {
  const [selected, setSelected] = useState('Home');
  return (
    <View style={styles.container}>
      <Button
        selected={selected}
        setSelected={setSelected}
        title="Home"
        icon="home"
      />
      <Button
        selected={selected}
        setSelected={setSelected}
        title="Explore"
        icon="search"
      />
      <Button
        selected={selected}
        setSelected={setSelected}
        title="Ranking"
        icon="bar-chart"
      />
      <Button
        selected={selected}
        setSelected={setSelected}
        title="Profile"
        icon="person"
      />
    </View>
  );
}

const Button = ({title, icon, selected, setSelected}) => {
  const navigation = useNavigation();
  return (
    <TouchableNativeFeedback
      onPress={() => {
        navigation.navigate(title);
        setSelected(title);
      }}>
      <View style={styles.button}>
        <Ionicons
          name={icon}
          size={20}
          color={selected === title ? '#2E8B57' : '#ccc'}
        />
        <View>
          <Text style={{color: selected === title ? '#2E8B57' : '#ccc'}}>
            {title}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopColor: '#414141',
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
