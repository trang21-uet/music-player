import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAuth} from '../../../providers';
import {Pressable} from '../../../components';

const Row = ({title, value, editable}) => {
  return (
    <View style={styles.row}>
      <Text style={{fontSize: 16, fontWeight: '600', color: '#eee'}}>
        {title}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
        <Text
          style={{fontSize: 16, marginBottom: 8, marginEnd: 10, color: '#ccc'}}>
          {value ? value : null}
        </Text>
        {editable && (
          <Pressable
            icon="pencil"
            size={16}
            style={{
              padding: 10,
              marginEnd: 10,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default function UserInfo() {
  const auth = useAuth();
  const [user, setUser] = useState({});
  useEffect(() => {
    auth.user().then(user => setUser(user));
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      <View
        style={{backgroundColor: '#fff', borderRadius: 50, marginVertical: 20}}>
        <TouchableWithoutFeedback>
          <Image
            source={require('../../../assets/images/user-male.png')}
            style={{width: 100, height: 100}}
          />
        </TouchableWithoutFeedback>
      </View>
      <Row title="Username" value={user.username}></Row>
      <Row title="First name" value={user.firstName} editable></Row>
      <Row title="Last name" value={user.lastName} editable></Row>
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
