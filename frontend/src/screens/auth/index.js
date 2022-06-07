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
  TouchableOpacity,
} from 'react-native';
import React, {forwardRef, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../providers';

const Input = forwardRef((props, ref) => {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{width: '100%'}}>
      <Text
        style={{fontSize: 20, marginTop: 20, marginBottom: 10, color: '#ccc'}}>
        {props.title}
      </Text>
      <TextInput
        {...props}
        ref={ref}
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
            backgroundColor: focus ? '#222' : '#212131',
          },
        ]}
      />
    </View>
  );
});

const LoginForm = () => {
  const [data, setData] = useState({
    username: '',
    password: '',
  });
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const submitRef = useRef(null);
  const auth = useAuth();
  const navigation = useNavigation();

  const submit = async () => {
    await auth.login(JSON.stringify(data));
    navigation.navigate('Profile');
  };

  return (
    <>
      <Text style={{fontSize: 20}}>LOG IN</Text>
      <Input
        ref={usernameRef}
        title="Username"
        placeholder="Enter username"
        autoComplete="username"
        returnKeyType="next"
        value={data.username}
        onChangeText={value => setData({...data, username: value})}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        ref={passwordRef}
        title="Password"
        placeholder="Enter password"
        autoComplete="password"
        secureTextEntry={true}
        value={data.password}
        onChangeText={value => setData({...data, password: value})}
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

const SignupForm = () => {
  const [data, setData] = useState({
    username: '',
    password: '',
  });
  const usernameRef = useRef();
  const passwordRef = useRef();
  const submitRef = useRef();
  const auth = useAuth();
  const navigation = useNavigation();

  const submit = async () => {
    await auth.register(JSON.stringify(data));
    navigation.navigate('AuthScreen');
  };

  return (
    <>
      <Text style={{fontSize: 20}}>SIGN UP</Text>
      <Input
        ref={usernameRef}
        title="Username"
        placeholder="Enter username"
        autoComplete="username"
        returnKeyType="next"
        value={data.username}
        onChangeText={value => setData({...data, username: value})}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        ref={passwordRef}
        title="Password"
        placeholder="Enter password"
        autoComplete="password"
        secureTextEntry={true}
        value={data.password}
        onChangeText={value => setData({...data, password: value})}
        onSubmitEditing={() => submitRef.current.props.onPress()}
      />
      <TouchableNativeFeedback ref={submitRef} onPress={submit}>
        <View style={styles.button}>
          <Text
            style={{
              color: '#000',
              fontSize: 18,
            }}>
            SIGN UP
          </Text>
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

const TipText = ({isLoginScreen, onPress}) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
      }}>
      <Text style={{color: '#999', fontSize: 16}}>
        {isLoginScreen
          ? "Don't have an account? "
          : 'Already have an account? '}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={{textDecorationLine: 'underline', fontSize: 16}}>
          {isLoginScreen ? 'Sign up' : 'Log in'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function AuthScreen() {
  const [isLoginScreen, setIsLoginScreen] = useState(true);

  return (
    <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag">
        {isLoginScreen ? <LoginForm /> : <SignupForm />}
        <TipText
          isLoginScreen={isLoginScreen}
          onPress={() => setIsLoginScreen(!isLoginScreen)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 20,
    alignItems: 'center',
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
