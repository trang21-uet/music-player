import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const Input = props => {
  const [value, setValue] = useState();
  const [focus, setFocus] = useState(false);
  return (
    <View style={{width: '100%'}}>
      <Text style={{fontSize: 20, paddingVertical: 10}}>{props.title}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={setValue}
        autoComplete={props.type}
        autoCorrect={false}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[
          styles.input,
          {
            borderColor: focus ? '#1d8' : '#888',
            backgroundColor: focus ? '#eee' : '#999',
          },
        ]}
      />
    </View>
  );
};

export default function AuthScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        resizeMode="contain"
        style={{width: '100%'}}></Image>
      <View style={styles.inputContainer}>
        <Input
          title="Username"
          placeholder="Enter username"
          type="username"
          returnKeyType="next"
        />
        <Input
          title="Password"
          placeholder="Enter password"
          type="password"
          onSubmitEditing={() => navigation.goBack()}
          secureTextEntry={true}
        />
        <TouchableNativeFeedback onPress={() => navigation.goBack()}>
          <View style={styles.button}>
            <Text
              style={{
                color: '#000',
                fontSize: 18,
              }}>
              GO BACK
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#313141',
  },
  input: {
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    color: '#333',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5eb',
    marginTop: 20,
    borderRadius: 5,
  },
  inputContainer: {
    position: 'absolute',
    top: 250,
    left: 20,
    right: 20,
    flex: 1,
    alignItems: 'center',
  },
});
