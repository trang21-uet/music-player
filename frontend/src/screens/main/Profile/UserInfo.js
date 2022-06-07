import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  TouchableNativeFeedback,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from '../../../providers';
import {Pressable} from '../../../components';
import {useNavigation} from '@react-navigation/native';

const Row = ({title, value, onChange}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const submitRef = useRef();

  return (
    <View style={styles.row}>
      <Text style={{fontSize: 16, fontWeight: '600', color: '#eee'}}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
        <Text
          style={{fontSize: 16, marginBottom: 8, marginEnd: 10, color: '#ccc'}}>
          {value || null}
        </Text>
        {onChange ? (
          <Pressable
            icon="pencil"
            size={16}
            style={{
              padding: 10,
            }}
            onPress={() => setModalVisible(true)}
          />
        ) : (
          <View style={{marginEnd: 36}}></View>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'column',
              margin: 20,
              padding: 15,
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
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#ccc', fontSize: 16}}>
                {`Change your ${title.toLowerCase()}`}
              </Text>
              <Pressable icon="close" onPress={() => setModalVisible(false)} />
            </View>
            <TextInput
              style={{
                backgroundColor: '#ccc',
                borderRadius: 10,
                height: 45,
                width: 250,
                marginVertical: 15,
                paddingHorizontal: 10,
                color: '#333',
              }}
              selectionColor="#2E8B57"
              value={newValue}
              onChangeText={value => setNewValue(value)}
              selectTextOnFocus
              onSubmitEditing={() => submitRef.current.props.onPress()}
            />
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <TouchableNativeFeedback
                ref={submitRef}
                onPress={() => {
                  onChange(newValue);
                  setModalVisible(false);
                }}>
                <View
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#2E8B57',
                    borderRadius: 5,
                  }}>
                  <Text style={{color: '#000', fontWeight: '600'}}>Save</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
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
    auth.user().then(user => {
      setUser(user);
      setNewInfo(user);
    });
  }, []);

  const updateInfo = async () => {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'PUT',
        body: JSON.stringify(newInfo),
        headers: {
          Authorization: 'Bearer ' + user.token,
        },
      });
      const message = await response.text();
      console.info({message});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Pressable
          icon="arrow-back"
          style={{padding: 20}}
          onPress={navigation.goBack}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: 20,
          }}>
          User Infomation
        </Text>
        <Pressable
          icon="checkmark"
          style={{padding: 20}}
          onPress={() => newInfo !== user && updateInfo()}
        />
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 50,
          marginVertical: 20,
          alignSelf: 'center',
        }}>
        <TouchableWithoutFeedback>
          <Image
            source={{uri: `http://localhost:8080/avatars/${user.avatar}`}}
            style={{width: 100, height: 100}}
          />
        </TouchableWithoutFeedback>
      </View>
      <Row title="Username" value={newInfo.username} />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
