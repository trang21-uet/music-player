import {View, Dimensions, Animated, ScrollView} from 'react-native';
import React, {createRef, useCallback, useRef} from 'react';
import {Error, Song, Tabs} from '../../../components';
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
    <View style={{flex: 1}}>
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
