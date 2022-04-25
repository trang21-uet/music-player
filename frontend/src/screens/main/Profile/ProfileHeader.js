import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text} from 'react-native';
import {Pressable} from '../../../components';

export default function ProfileHeader() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 18}}>Thông tin tài khoản</Text>
      <Pressable
        size={25}
        style={{position: 'absolute', right: 90}}
        icon="settings-outline"
        onPress={() => navigation.navigate('Setting')}
      />
    </View>
  );
}
