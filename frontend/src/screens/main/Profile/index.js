import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../providers';
import {RowOption} from '../../../components';

const {width} = Dimensions.get('window');

export default function Profile() {
  const navigation = useNavigation();
  const auth = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.getUser().then(user => setUser(user));
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/default_wallpaper.png')}
        resizeMode="cover"
        style={styles.profile}
        imageStyle={{opacity: 0.2, width}}>
        <View style={styles.profilePic}>
          <TouchableNativeFeedback
            onPress={() => user && navigation.navigate('UserInfo')}>
            <Image
              source={
                user
                  ? {uri: `http://localhost:8080/avatars/${user.avatar}`}
                  : require('../../../assets/images/default.png')
              }
              style={{height: 80, width: 80, borderRadius: 40}}
            />
          </TouchableNativeFeedback>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {user ? (
            <Text style={{fontSize: 18, marginEnd: 5, color: '#ccc'}}>
              {(user.firstName ? user.firstName : '') +
                ' ' +
                (user.lastName ? user.lastName : null)}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 18,
                marginStart: 10,
              }}>
              You are not logged in
            </Text>
          )}
        </View>
      </ImageBackground>
      <View style={styles.other}>
        <RowOption
          icon="settings-outline"
          title="Setting"
          onPress={() => console.info(user)}
        />
        {user ? (
          <>
            <RowOption
              icon="musical-notes-outline"
              title="Your playlists"
              onPress={() => {
                navigation.navigate('Playlists');
              }}
            />
            <RowOption
              icon="person-outline"
              title="Your infomations"
              onPress={() => navigation.navigate('UserInfo')}
            />
            {user.role[0] === 'admin' ? (
              <RowOption
                icon="musical-notes-outline"
                title="Manage songs"
                onPress={() => navigation.navigate('ManageSong')}
              />
            ) : (
              <>
                <RowOption
                  icon="cloud-upload-outline"
                  title="Upload song"
                  onPress={() => navigation.navigate('Upload')}
                />
              </>
            )}
            <RowOption
              icon="log-out-outline"
              title="Log out"
              onPress={auth.logout}
            />
          </>
        ) : (
          <RowOption
            icon="log-in-outline"
            title="Login"
            onPress={() => navigation.navigate('AuthScreen')}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  profilePic: {
    width: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
  },
  other: {
    flex: 4,
    width: width,
    paddingStart: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: width,
    justifyContent: 'space-between',
    paddingStart: 20,
  },
});

import Setting from './Setting';
import Upload from './Upload';
import UserInfo from './UserInfo';
import ManageSong from './ManageSong';
import Playlists from './Playlists';
export {Setting, Upload, UserInfo, ManageSong, Playlists};
