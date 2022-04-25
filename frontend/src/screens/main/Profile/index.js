import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import ProfileHeader from './ProfileHeader';
import Setting from './Setting';

export default function Profile() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View></View>
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

export {ProfileHeader, Setting};
