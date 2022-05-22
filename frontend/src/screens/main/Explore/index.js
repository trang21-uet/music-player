import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import React, {useRef, useState} from 'react';
import Ranking from './Ranking';
import {Pressable, Loading, Song} from '../../../components';

const SearchBar = ({innerRef, text, onChange}) => {
  const [focus, setFocus] = useState(false);
  return (
    <View style={styles.searchBox}>
      <Pressable
        icon={focus ? 'arrow-back' : 'search'}
        size={25}
        color="#000"
        onPress={() => innerRef.current.blur()}
      />
      <TextInput
        value={text}
        onChangeText={value => onChange(value)}
        ref={innerRef}
        style={styles.searchInput}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        numberOfLines={1}
        autoCapitalize="none"
        placeholder={focus ? '' : 'Enter song, artist, album ...'}
        placeholderTextColor="#888"
        selectionColor="#50C878"
      />
      <Pressable
        icon="close"
        size={25}
        color="#000"
        style={{
          display: text ? 'flex' : 'none',
          position: 'absolute',
          right: 10,
        }}
        onPress={() => onChange('')}
      />
    </View>
  );
};

const SearchResult = ({data}) => {
  return (
    <ScrollView
      style={{display: data ? 'flex' : 'none'}}
      contentContainerStyle={{width: '100%'}}>
      {data.map((item, index) => (
        <Song
          key={index}
          title={item.title}
          artist={item.artist}
          cover={`http://localhost:8080/images/${item.coverImage}`}
        />
      ))}
    </ScrollView>
  );
};

export const Explore = () => {
  const inputRef = useRef(null);
  const [value, setValue] = useState('');
  const [searchMode, setSearchMode] = useState('all');
  const [result, setResult] = useState([]);

  const search = async () => {
    const url = {
      all: `getTopSongsByParam?param=${value}&offset=0&limit=10`,
      name: `getSongsByName?name=${value}&offset=0&limit=10`,
      artist: `getSongsByArtist?artist=${value}&offset=0&limit=10`,
      album: `getSongsByAlbum?album=${value}&offset=0&limit=10`,
    };
    try {
      const response = await fetch(
        'http://localhost:8080/songs/' + url[searchMode],
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar
        innerRef={inputRef}
        text={value}
        onChange={async value => {
          setValue(value);
          value !== '' ? await search() : setResult([]);
        }}
      />
      <SearchResult data={result} />
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
