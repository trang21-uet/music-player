import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Error, Song} from '../../../components';
import {usePlayer} from '../../../providers';

const {width} = Dimensions.get('window');

const routes = {
  all: 'All',
  vn: 'Vietnam',
  'us-uk': 'US-UK',
  cn: 'China',
  jp: 'Japan',
  kr: 'Korea',
  null: 'Other',
};

const data = Object.keys(routes).map(key => ({
  key: key,
  title: routes[key],
  ref: createRef(),
}));

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

const Tabs = ({data, scrollX, onTabPress}) => {
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
    <View style={styles.tabs} ref={containerRef}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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
          <Indicator measures={measures} scrollX={scrollX} />
        )}
      </ScrollView>
    </View>
  );
};

const Indicator = ({measures, scrollX}) => {
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

const TabScreen = ({item}) => {
  const {tracks} = usePlayer();
  const selected =
    item.key === 'all'
      ? tracks
      : tracks.filter(track => track.region === item.key);

  return (
    <ScrollView>
      <View style={{flex: 1, width}}>
        {selected.length === 0 ? (
          <Error status="No songs" />
        ) : (
          selected.map((track, index) => (
            <Song track={track} key={index} queue={selected} index={index} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default function Home() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const ref = useRef();
  const onTabPress = useCallback(index => {
    ref?.current?.scrollToOffset({
      offset: index * width,
    });
  });

  return (
    <View style={styles.container}>
      <Tabs data={data} scrollX={scrollX} onTabPress={onTabPress} />
      <Animated.FlatList
        ref={ref}
        data={data}
        renderItem={({item}) => <TabScreen item={item} />}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
});
