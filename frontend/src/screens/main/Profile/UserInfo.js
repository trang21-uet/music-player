import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from '../../../providers';
import {Button, Pressable, RowOption} from '../../../components';
import {useNavigation} from '@react-navigation/native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');

const Row = ({title, value, onChange}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const submitRef = useRef();

  return (
    <View style={styles.row}>
      <Text style={{fontSize: 18, fontWeight: '600', color: '#fff'}}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 18, marginEnd: 10, color: '#ddd'}}>
          {value || null}
        </Text>
        <Pressable
          icon="pencil"
          size={16}
          disabled={!onChange}
          style={{
            padding: 10,
          }}
          onPress={() => setModalVisible(true)}
        />
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          style={{
            width,
            height,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity activeOpacity={1}>
            <View
              style={{
                flexDirection: 'column',
                margin: 20,
                padding: 15,
                minWidth: 250,
                backgroundColor: '#414151',
                borderRadius: 10,
                shadowColor: '#918181',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                {`Change your ${title.toLowerCase()}`}
              </Text>
              <TextInput
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  height: 45,
                  width: 250,
                  marginVertical: 20,
                  paddingHorizontal: 10,
                  color: '#000',
                }}
                selectionColor="#2E8B57"
                value={newValue}
                onChangeText={value => setNewValue(value)}
                placeholder={title}
                placeholderTextColor="#999"
                selectTextOnFocus
                onSubmitEditing={() => submitRef.current.props.onPress()}
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button
                  title="Cancel"
                  color="#777"
                  onPress={() => setModalVisible(false)}
                />
                <Button
                  title="Save"
                  color="#2E8B57"
                  ref={submitRef}
                  onPress={() => {
                    onChange(newValue);
                    setModalVisible(false);
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const Avatar = ({avatar, onChange}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
      });
      if (response.didCancel) {
        ToastAndroid.show('Canceled choosing file', 2000);
      } else {
        const {uri, fileName, type} = response.assets[0];
        setImage(uri);
        onChange({uri, type, name: `${new Date().getTime()}.png`});
        // console.info({uri, fileName, type});
      }
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const takePhoto = async () => {
    try {
      const response = await launchCamera({
        mediaType: 'photo',
        cameraType: 'front',
      });
      if (response.didCancel) {
        ToastAndroid.show('Canceled taking photo', 2000);
      } else {
        const {uri, fileName, type} = response.assets[0];
        setImage(uri);
        onChange({uri, type, name: `${new Date().getTime()}.png`});
        // console.info(response.assets[0]);
      }
      setModalVisible(false);
    } catch (error) {
      error.camera_unavailable && ToastAndroid.show('Camera unavailable', 2000);
      error.permission && ToastAndroid.show('Permission not allowed', 2000);
      console.error(error);
    }
  };

  return (
    <View style={[styles.profilePic, {marginVertical: 30}]}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <Image
          source={{uri: image || `http://localhost:8080/avatars/${avatar}`}}
          style={styles.profilePic}
        />
      </TouchableWithoutFeedback>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            width,
            height,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setModalVisible(false)}>
          <TouchableOpacity activeOpacity={1}>
            <View
              style={{
                flexDirection: 'column',
                margin: 20,
                padding: 15,
                minWidth: 250,
                backgroundColor: '#414151',
                borderRadius: 10,
                shadowColor: '#918181',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: '#fff',
                  textAlign: 'center',
                  marginBottom: 15,
                }}>
                Change your avatar
              </Text>
              <RowOption
                icon="camera-outline"
                title="Take a photo"
                fontSize={16}
                onPress={takePhoto}
              />
              <RowOption
                icon="image-outline"
                title="Choose from library"
                fontSize={16}
                onPress={pickImage}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                <Button
                  title="Cancel"
                  color="#777"
                  onPress={() => setModalVisible(false)}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function UserInfo() {
  const auth = useAuth();
  const navigation = useNavigation();
  const [user, setUser] = useState({});
  const [newInfo, setNewInfo] = useState({});

  useEffect(() => {
    const getUserInfo = async () => {
      const info = await auth.getUser();
      setUser(info);
      setNewInfo(info);
    };
    getUserInfo();
  }, []);

  const updateInfo = async () => {
    const {id, firstName, lastName, username, avatar} = newInfo;
    const form = new FormData();
    form.append('id', id);
    form.append('firstName', firstName || '');
    form.append('lastName', lastName || '');
    form.append('username', username);
    form.append('roleId', user.role[0] === 'admin' ? 2 : 1);
    avatar !== user.avatar && form.append('avatar', avatar);
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'PUT',
        body: form,
        headers: {
          Authorization: 'Bearer ' + user.token,
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = await response.json();
      let newUser = {...newInfo};
      if (avatar !== user.avatar) {
        newUser.avatar = avatar.name;
      }
      setUser(newUser);
      await auth.setUser(newUser);
      data && ToastAndroid.show('Update successfully', 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <Pressable
          icon="arrow-back"
          size={25}
          style={{padding: 15}}
          onPress={navigation.goBack}
        />
        <Text
          style={{
            color: '#ccc',
            fontWeight: '600',
            fontSize: 18,
          }}>
          User Infomation
        </Text>
        <Pressable
          icon="checkmark"
          size={25}
          disabled={newInfo === user}
          style={{padding: 15}}
          onPress={updateInfo}
        />
      </View>
      <Avatar
        avatar={user.avatar}
        onChange={avatar => setNewInfo({...newInfo, avatar: avatar})}
      />
      <Row title="Username" value={user.username} />
      <Row
        title="First name"
        value={newInfo.firstName}
        onChange={value => setNewInfo({...newInfo, firstName: value})}
      />
      <Row
        title="Last name"
        value={newInfo.lastName}
        onChange={value => setNewInfo({...newInfo, lastName: value})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#555',
    borderBottomWidth: 1,
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    paddingStart: 20,
  },
  profilePic: {
    backgroundColor: '#fff',
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
  },
});
