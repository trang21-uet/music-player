import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../providers';
import {Pressable, RowOption} from '../../../components';

export default function Profile() {
  const navigation = useNavigation();
  const auth = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.user().then(user => setUser(user));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.profilePic}>
          <TouchableNativeFeedback
            onPress={() => navigation.navigate('UserInfo')}>
            <Image
              source={require('../../../assets/images/user-male.png')}
              style={{height: 100, width: 100}}
            />
          </TouchableNativeFeedback>
          {user ? (
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 18, marginEnd: 5}}>
                {(user.firstName ? user.firstName : '') +
                  ' ' +
                  (user.lastName ? user.lastName : null)}
              </Text>
              {/* <Pressable icon="pencil" size={18} /> */}
            </View>
          ) : (
            <RowOption
              icon="log-in-outline"
              title="Login"
              onPress={() => navigation.navigate('AuthScreen')}></RowOption>
          )}
        </View>
      </View>
      {user && (
        <View style={styles.other}>
          <RowOption
            icon="cloud-upload-outline"
            title="Upload song"
            onPress={() => navigation.navigate('Upload')}
          />

          <RowOption
            icon="log-out-outline"
            title="Logout"
            onPress={auth.logout}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  profile: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  other: {
    width: '100%',
    flex: 2,
    paddingStart: 20,
    borderTopWidth: 1,
    borderTopColor: '#414141',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    paddingStart: 20,
  },
});

import ProfileHeader from './ProfileHeader';
import Setting from './Setting';
import Upload from './Upload';
import UserInfo from './UserInfo';
export {ProfileHeader, Setting, Upload, UserInfo};
