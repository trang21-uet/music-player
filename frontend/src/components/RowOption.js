import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RowOption({
  title,
  onPress,
  icon,
  iconSize,
  fontSize,
  style,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{paddingVertical: 15}}>
      <View style={{flexDirection: 'row', alignItems: 'center', ...style}}>
        <Icon
          name={icon}
          size={iconSize || 30}
          color="#ccc"
          style={{paddingEnd: 20}}
        />
        <Text style={{fontSize: fontSize || 20, color: '#ccc'}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
