import {View, Text, StyleSheet, TouchableNativeFeedback} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

export default function NavigationBar({route}) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Button
        onPress={() => navigation.navigate('Home')}
        title="Home"
        icon="home"
      />
      <Button
        onPress={() => navigation.navigate('Explore')}
        title="Explore"
        icon="search"
      />
      <Button
        onPress={() => navigation.navigate('Player')}
        title="Player"
        icon="musical-note"
      />
      <Button
        onPress={() => navigation.navigate('Profile')}
        title="Profile"
        icon="person"
      />
    </View>
  );
}

const Button = ({onPress, title, icon}) => {
  return (
    <TouchableNativeFeedback
      onPress={onPress}
      background={TouchableNativeFeedback.Ripple('#333', false)}>
      <View style={styles.button}>
        <Ionicons name={icon} size={20} color="#ccc" />
        <View>
          <Text>{title}</Text>
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
