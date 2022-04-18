import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Pressable from '../../shared/Pressable';

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
        <Option icon="heart-outline" title="Add to favorite" />
        <Option icon="mic" title="Author" />
        <Option icon="musical-notes" title="Album" />
        <Option icon="download-outline" title="Download" />
        <Option icon="share-social-outline" title="Share" />
        <Option icon="moon-outline" title="Set timer" />
      </View>
    </>
  );
}

const Option = ({title, onPress, icon}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{paddingVertical: 15}}>
      <View style={{flexDirection: 'row'}}>
        <Icon name={icon} size={30} color="#ccc" style={{paddingEnd: 20}} />
        <Text style={{fontSize: 20}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingStart: 50,
    paddingBottom: 50,
  },
});
