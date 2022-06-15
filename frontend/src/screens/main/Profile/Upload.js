import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ToastAndroid,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {forwardRef, useRef, useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';
import {useAuth} from '../../../providers';
import {Pressable} from '../../../components';
import {useNavigation} from '@react-navigation/native';

const Input = forwardRef((props, ref) => {
  const [focus, setFocus] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputTitle}>{props.title}</Text>
      <TextInput
        {...props}
        ref={ref}
        placeholderTextColor="#999"
        value={props.value}
        onChangeText={value => props.onChangeText(value)}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[
          styles.input,
          {
            color: focus ? '#fff' : '#000',
            borderColor: focus ? '#1d8' : '#888',
            borderWidth: 1,
            backgroundColor: focus ? '#111' : '#ddd',
          },
        ]}
      />
    </View>
  );
});

export default function Upload() {
  const [file, setFile] = useState(null);
  const [region, setRegion] = useState('Unknown');
  const [expand, setExpand] = useState(false);
  const auth = useAuth();
  const artistRef = useRef();
  const albumRef = useRef();
  const submitRef = useRef();
  const navigation = useNavigation();
  const [info, setInfo] = useState({title: '', artist: '', album: ''});

  const uploadFile = async () => {
    if (file === null) {
      Alert.alert('Error', 'File is required!');
    } else {
      const {id, token} = await auth.getUser();
      const {title, artist, album} = info;
      const data = new FormData();
      data.append('ownerId', id);
      data.append('file', file);
      data.append('region', region);
      title && data.append('title', title);
      artist && data.append('artist', artist);
      album && data.append('album', album);

      try {
        const response = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const message = await response.text();
        console.info(message);
        ToastAndroid.show(message, 2000);
      } catch (error) {
        ToastAndroid.show(error.message, 2000);
      }
    }
  };

  const pickFile = async () => {
    try {
      const response = await DocumentPicker.pick({
        allowMultiSelection: false,
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.audio],
      });
      setFile(response[0]);
      // console.info(response[0]);
    } catch (error) {
      console.info(error);
      error.message === 'User canceled document picker' &&
        ToastAndroid.show('Canceled choosing file', 2000);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Pressable
          icon="arrow-back"
          size={25}
          style={{padding: 15}}
          onPress={navigation.goBack}
        />
        <Text style={{fontSize: 18, color: '#eee'}}>Upload Song</Text>
      </View>
      <ScrollView>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Choose song</Text>
          <View
            style={{flexDirection: 'row', height: 45, alignItems: 'center'}}>
            <TouchableNativeFeedback onPress={pickFile}>
              <View
                style={{
                  backgroundColor: '#2E8B57',
                  height: '100%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: 5,
                }}>
                <Text style={{color: '#000', marginHorizontal: 10}}>
                  Choose file
                </Text>
              </View>
            </TouchableNativeFeedback>
            {file !== null && (
              <Text
                style={{marginStart: 10, maxWidth: '50%', color: '#ccc'}}
                numberOfLines={1}>
                {file.name}
              </Text>
            )}
            <Pressable
              icon="close"
              disabled={!file}
              size={25}
              onPress={() => setFile(null)}
              style={{position: 'absolute', right: 10}}
            />
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputTitle}>Region</Text>
          <View
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            <Picker
              style={styles.input}
              selectedValue={region}
              onValueChange={value => setRegion(value)}
              dropdownIconColor={'#fff'}
              mode="dropdown"
              dropdownIconRippleColor={'#fff'}>
              <Picker.Item label="Unknown" value={null} />
              <Picker.Item label="Vietnam" value="vn" />
              <Picker.Item label="US-UK" value="us-uk" />
              <Picker.Item label="China" value="cn" />
              <Picker.Item label="Japan" value="jp" />
              <Picker.Item label="Korea" value="kr" />
            </Picker>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={styles.inputTitle}>Additional Information</Text>
            <Pressable
              icon={expand ? 'caret-up' : 'caret-down'}
              size={15}
              style={{marginEnd: 15}}
              onPress={() => setExpand(!expand)}
            />
          </View>
        </View>
        {expand && (
          <View>
            <Input
              title="Song title"
              placeholder="Title"
              returnKeyType="next"
              value={info.title}
              onChangeText={value => setInfo({...info, title: value})}
              onSubmitEditing={() => artistRef.current.focus()}
            />
            <Input
              ref={artistRef}
              title="Song author"
              placeholder="Artist"
              returnKeyType="next"
              value={info.artist}
              onChangeText={value => setInfo({...info, artist: value})}
              onSubmitEditing={() => albumRef.current.focus()}
            />
            <Input
              ref={albumRef}
              title="Song album"
              placeholder="Album"
              value={info.album}
              onChangeText={value => setInfo({...info, album: value})}
              onSubmitEditing={() => submitRef.current.props.onPress()}
            />
          </View>
        )}

        <TouchableNativeFeedback onPress={uploadFile} ref={submitRef}>
          <View
            style={[
              styles.inputGroup,
              {backgroundColor: '#2E8B57', borderRadius: 5},
            ]}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                paddingVertical: 10,
                color: '#000',
                fontWeight: '600',
              }}>
              Submit
            </Text>
          </View>
        </TouchableNativeFeedback>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  inputGroup: {
    marginVertical: 12,
    marginHorizontal: 10,
  },
  inputTitle: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 8,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  input: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingEnd: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
