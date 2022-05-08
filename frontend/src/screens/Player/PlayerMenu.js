import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {RowOption} from '../../components';
import {Pressable} from '../../components';

export default function PlayerMenu() {
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingEnd: 20,
          paddingTop: 20,
        }}>
        <Pressable icon="close" onPress={navigation.goBack} />
      </View>
      <View style={styles.container}>
        <RowOption icon="heart-outline" title="Add to favorite" />
        <RowOption icon="mic" title="Author" />
        <RowOption icon="musical-notes" title="Album" />
        <RowOption icon="download-outline" title="Download" />
        <RowOption icon="share-social-outline" title="Share" />
        <RowOption icon="moon-outline" title="Set timer" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingStart: 50,
    paddingBottom: 50,
  },
});
