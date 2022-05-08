import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';
import {useAuth} from '../../../providers';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [region, setRegion] = useState('Unknown');
  const auth = useAuth();

  const uploadFile = async () => {
    if (file !== null) {
      const data = new FormData();
      data.append('ownerId', auth.user().id);
      data.append('file', file);
      data.append('region', region);

      try {
        const response = await fetch('http://localhost:8080/upload', {
          method: 'POST',
          body: data,
          headers: {
            Authorization: 'Bearer ' + auth.token(),
          },
        });
        const message = await response.text();
        console.info(message);
        ToastAndroid.show(message, 2000);
      } catch (error) {
        ToastAndroid.show(error.message, 2000);
      }
    } else {
      ToastAndroid.show('Please choose a song first!', 2000);
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
    } catch (error) {
      console.info(error.message);
      error.message === 'User canceled document picker' &&
        ToastAndroid.show('Canceled choosing file', 2000);
    }
  };

  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>Choose song</Text>
        <View style={[styles.input, {paddingStart: 0}]}>
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
            <Text style={{marginStart: 10, maxWidth: '60%'}} numberOfLines={1}>
              {file.name}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputTitle}>Region</Text>
        <Picker
          style={styles.input}
          selectedValue={region}
          onValueChange={value => setRegion(value)}
          mode="dropdown"
          dropdownIconRippleColor={'#2E8B57'}>
          <Picker.Item label="Unknown" value={null} />
          <Picker.Item label="Vietnam" value="vn" />
          <Picker.Item label="US-UK" value="us-uk" />
          <Picker.Item label="China" value="cn" />
          <Picker.Item label="Japan" value="jp" />
        </Picker>
      </View>

      <TouchableNativeFeedback onPress={uploadFile}>
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
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
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
