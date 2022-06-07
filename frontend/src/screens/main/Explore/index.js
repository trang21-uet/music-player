import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Ranking from './Ranking';
import {Pressable, Loading, Song, Error, Tabs} from '../../../components';

const {width} = Dimensions.get('window');

const SearchBar = forwardRef(({onChange}, ref) => {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState('');
  return (
    <View style={styles.searchBox}>
      <Pressable
        icon={focus ? 'arrow-back' : 'search'}
        size={25}
        color="#000"
        onPress={() => ref.current.blur()}
      />
      <TextInput
        value={value}
        onChangeText={value => {
          setValue(value);
          onChange(value);
        }}
        ref={ref}
        style={styles.searchInput}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        numberOfLines={1}
        autoCapitalize="none"
        placeholder="Enter song, artist, album ..."
        placeholderTextColor="#888"
        selectionColor="#50C878"
      />
      <Pressable
        icon="close"
        size={25}
        color="#000"
        style={{
          display: value ? 'flex' : 'none',
          position: 'absolute',
          right: 10,
        }}
        onPress={() => {
          setValue('');
          onChange('');
        }}
      />
    </View>
  );
});

const modes = {
  all: 'All',
  name: 'Songs',
  artist: 'Artist',
  album: 'Album',
};

const tabs = Object.keys(modes).map(key => ({
  key: key,
  title: modes[key],
  ref: createRef(),
}));

const TabScreen = ({query, mode}) => {
  const [result, setResult] = useState([]);

  const search = async (query, mode) => {
    const url = {
      all: `getTopSongsByParam?param=${query}&offset=0&limit=10`,
      name: `getSongsByName?name=${query}&offset=0&limit=10`,
      artist: `getSongsByArtist?artist=${query}&offset=0&limit=10`,
      album: `getSongsByAlbum?album=${query}&offset=0&limit=10`,
    };
    try {
      console.log(url[mode]);
      const response = await fetch('http://localhost:8080/songs/' + url[mode]);
      const data = await response.json();
      data.forEach(
        track => (track.url = `http://localhost:8080/songs/${track.url}`),
      );
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    search(query, mode);
  }, []);

  return (
    <ScrollView>
      <View style={{flex: 1, width}}>
        {result.length === 0 ? (
          <Error status="No songs found" />
        ) : (
          result.map((track, index) => (
            <Song track={track} key={index} queue={result} index={index} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const SearchResult = ({query}) => {
  if (query === '') {
    return null;
  }
  const scrollX = useRef(new Animated.Value(0)).current;
  const ref = useRef();

  const onTabPress = useCallback(index => {
    ref?.current?.scrollToOffset({
      offset: index * width,
    });
  });

  return (
    <>
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          fontWeight: '600',
          marginVertical: 10,
        }}>
        Search Result
      </Text>
      <Tabs
        data={tabs}
        scrollX={scrollX}
        onTabPress={onTabPress}
        style={{paddingHorizontal: 5}}
      />
      <Animated.FlatList
        ref={ref}
        data={tabs}
        renderItem={item => <TabScreen query={query} mode={item.item.key} />}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
      />
    </>
  );
};

export const Explore = () => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <SearchBar ref={inputRef} onChange={value => setQuery(value)} />
      <SearchResult query={query} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  searchBox: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  searchInput: {
    width: '80%',
    color: '#000',
    alignSelf: 'flex-end',
    fontSize: 16,
  },
});

export {Ranking};
