import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {width} = Dimensions.get('window');

const Tab = forwardRef(({title, onPress}, ref) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View ref={ref}>
        <Text
          style={{
            paddingVertical: 15,
            marginHorizontal: 20,
            fontWeight: '600',
            textTransform: 'uppercase',
          }}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const Tabs = ({data, scrollX, onTabPress, style}) => {
  const containerRef = useRef();
  const [measures, setMeasures] = useState([]);

  useEffect(() => {
    let m = [];
    data.forEach(item => {
      item.ref.current.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          m.push({x, y, width, height});
          if (m.length === data.length) {
            setMeasures(m);
          }
        },
      );
    });
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        ...style,
      }}
      ref={containerRef}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={{flex: 1}}>
        {data.map((item, index) => (
          <Tab
            key={item.key}
            title={item.title}
            ref={item.ref}
            onPress={() => onTabPress(index)}
          />
        ))}
        {measures.length > 0 && (
          <Indicator data={data} measures={measures} scrollX={scrollX} />
        )}
      </ScrollView>
    </View>
  );
};

const Indicator = ({measures, scrollX, data}) => {
  const inputRange = data.map((_, index) => index * width);
  const indicatorWidth = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(measure => measure.width),
  });

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measures.map(measure => measure.x),
  });

  return (
    <Animated.View
      style={{
        height: 3,
        width: indicatorWidth,
        backgroundColor: '#2E8B57',
        position: 'absolute',
        bottom: 0,
        left: 0,
        transform: [{translateX: translateX}],
      }}
    />
  );
};

export default Tabs;
