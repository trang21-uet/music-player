import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Image,
  ImageBackground,
  Dimensions,
  Share,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useAuth} from '../../../providers';
import {RowOption} from '../../../components';

const {width} = Dimensions.get('window');

export default function Profile() {
  const navigation = useNavigation();
  const auth = useAuth();
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);

  const share = async () => {
    try {
      const response = await Share.share({
        message: {abc: '123'},
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const info = await auth.getUser();
      setUser(info);
    };
    getUserInfo();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.upper}>
        <View style={styles.profilePic}>
          <TouchableNativeFeedback
            disabled={!user}
            onPress={() => navigation.navigate('UserInfo')}>
            <Image
              source={
                user
                  ? {uri: `http://localhost:8080/avatars/${user.avatar}`}
                  : require('../../../assets/images/default.png')
              }
              style={styles.profilePic}
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
            <Text style={styles.name}>
              {(user.firstName || '') + ' ' + (user.lastName || null)}
            </Text>
          ) : (
            <Text style={styles.name}>You are not logged in</Text>
          )}
        </View>
      </View>
      <View style={styles.lower}>
        {user ? (
          <>
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
                  icon="musical-notes-outline"
                  title="Your playlists"
                  onPress={() => {
                    navigation.navigate('Playlists');
                  }}
                />
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
  upper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginVertical: 10,
    borderBottomColor: '#414141',
    borderBottomWidth: 1,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 20,
    color: '#eee',
    marginTop: 10,
  },
  lower: {
    flex: 1,
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

import Upload from './Upload';
import UserInfo from './UserInfo';
import ManageSong from './ManageSong';
import Playlists from './Playlists';
import PlaylistSong from './PlaylistSong';
import AddSongToPlaylist from './AddSongToPlaylist';
export {
  Upload,
  UserInfo,
  ManageSong,
  Playlists,
  PlaylistSong,
  AddSongToPlaylist,
};
