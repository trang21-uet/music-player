import {
  View,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import React, {forwardRef} from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

const Button = forwardRef(({title, onPress, color}, ref) => {
  return (
    <View style={{overflow: 'hidden', borderRadius: 5}}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(
          'rgba(200,200,200,0.3)',
          false,
        )}
        onPress={onPress}
        ref={ref}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: color,
          }}>
          <Text style={{color: '#000'}}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
});

export const CornerButton = ({icon, style, onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          position: 'absolute',
          right: 20,
          bottom: 20,
          backgroundColor: '#2E8B57',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        }}>
        <Ionicon name={icon} color="#ccc" size={30} />
      </View>
    </TouchableOpacity>
  );
};

export default Button;
