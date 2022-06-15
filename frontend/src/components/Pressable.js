import {TouchableNativeFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';

export default function Pressable({
  style,
  icon,
  size,
  onPress,
  color,
  disabled,
}) {
  return (
    <View style={{...style, overflow: 'hidden'}}>
      <TouchableNativeFeedback
        disabled={disabled}
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          'rgba(255,255,255,0.3)',
          true,
        )}>
        <View>
          <Icon
            name={icon}
            size={size ? size : 30}
            color={disabled ? 'transparent' : color || '#ccc'}
          />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}
