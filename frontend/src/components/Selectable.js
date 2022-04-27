import {TouchableOpacity} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import React, {useState} from 'react';

export default function Selectable({style, icon, size, onPress}) {
  const [selected, setSelected] = useState(false);
  return (
    <TouchableOpacity
      onPress={() => {
        setSelected(!selected);
        onPress();
      }}
      style={style}>
      <Ionicon
        name={icon}
        size={size ? size : 30}
        color={selected ? '#2E8B57' : '#ccc'}
      />
    </TouchableOpacity>
  );
}
