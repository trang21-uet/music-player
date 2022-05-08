import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../providers';

const Input = props => {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{width: '100%'}}>
      <Text style={{fontSize: 20, marginTop: 20, marginBottom: 10}}>
        {props.title}
      </Text>
      <TextInput
        {...props}
        ref={props.innerRef}
        placeholderTextColor="#999"
        value={props.value}
        onChangeText={value => props.onChangeText(value)}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={[
          styles.input,
          {
            borderColor: focus ? '#1d8' : '#888',
            backgroundColor: focus ? '#222' : '#313141',
          },
        ]}
      />
    </View>
  );
};

const Form = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const submitRef = useRef(null);
  const auth = useAuth();

  const submit = async () => {
    const data = {
      username: username,
      password: password,
    };
    auth.login(JSON.stringify(data));
  };

  return (
    <>
      <Input
        innerRef={usernameRef}
        title="Username"
        placeholder="Enter username"
        autoComplete="username"
        returnKeyType="next"
        value={username}
        onChangeText={value => setUsername(value)}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        innerRef={passwordRef}
        title="Password"
        placeholder="Enter password"
        autoComplete="password"
        secureTextEntry={true}
        value={password}
        onChangeText={value => setPassword(value)}
        onSubmitEditing={() => submitRef.current.props.onPress()}
      />
      <TouchableNativeFeedback ref={submitRef} onPress={submit}>
        <View style={styles.button}>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
            }}>
            LOG IN
          </Text>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

export default function AuthScreen() {
  return (
    <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Form />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    color: '#ccc',
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E8B57',
    marginTop: 20,
    borderRadius: 5,
  },
});
