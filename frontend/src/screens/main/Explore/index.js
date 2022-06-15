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
import {Pressable, Song, Error, Tabs, Artist, Album} from '../../../components';

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
        disabled={!value}
        color="#000"
        style={{
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
      all: `getMapTopSongsByParam?param=${query}&offset=0&limit=5`,
      name: `getSongsByName?name=${query}&offset=0&limit=20`,
      artist: `getSongsByArtist?artist=${query}&offset=0&limit=20`,
      album: `getSongsByAlbum?album=${query}&offset=0&limit=20`,
    };
    try {
      // console.log(url[mode]);
      const response = await fetch('http://localhost:8080/songs/' + url[mode]);
      const data = await response.json();
      mode !== 'all'
        ? data.forEach(
            track => (track.url = `http://localhost:8080/songs/${track.url}`),
          )
        : data.name.forEach(
            track => (track.url = `http://localhost:8080/songs/${track.url}`),
          );
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    search(query, mode);
  }, [query]);

  return (
    <ScrollView>
      <View style={{flex: 1, width}}>
        {result.length === 0 ? (
          <Error status="Nothing found" />
        ) : mode === 'all' ? (
          <All data={result} />
        ) : (
          result.map((track, index) => {
            if (mode === 'name') {
              return (
                <Song track={track} key={index} queue={[track]} index={0} />
              );
            } else if (mode === 'artist') {
              return <Artist key={index} title={track.artist} />;
            } else if (mode === 'album') {
              return <Album key={index} title={track.album} />;
            }
          })
        )}
      </View>
    </ScrollView>
  );
};

const All = data => {
  // console.info(data.data);
  const {name, artist, album} = data.data;
  // console.info({name}, {artist}, {album});
  // name.forEach(song => console.info(song));
  return (
    data && (
      <View style={{flex: 1}}>
        {name.length > 0 && (
          <View style={{marginBottom: 15}}>
            <Text style={{fontSize: 20, color: '#eee', marginStart: 20}}>
              Songs
            </Text>
            <View>
              {name.map((song, index) => (
                <Song track={song} key={index} queue={[song]} index={0} />
              ))}
            </View>
          </View>
        )}
        {artist.length > 0 && (
          <View style={{marginBottom: 15}}>
            <Text style={{fontSize: 20, color: '#eee', marginStart: 20}}>
              Artists
            </Text>
            {artist.map(({artist}, index) => (
              <Artist key={index} title={artist} />
            ))}
          </View>
        )}
        {album.length > 0 && (
          <View style={{marginBottom: 15}}>
            <Text style={{fontSize: 20, color: '#eee', marginStart: 20}}>
              Album
            </Text>
            {album.map(({album}, index) => (
              <Album key={index} title={album} />
            ))}
          </View>
        )}
      </View>
    )
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
      <Tabs data={tabs} scrollX={scrollX} onTabPress={onTabPress} />
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
