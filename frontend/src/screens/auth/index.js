import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ToastAndroid,
} from 'react-native';
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../providers';
import {Pressable} from '../../components';
import {
  LoginManager,
  AccessToken,
  Profile,
  ShareDialog,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import Ionicon from 'react-native-vector-icons/Ionicons';

const Input = forwardRef((props, ref) => {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{width: '100%'}}>
      <Text
        style={{fontSize: 20, marginTop: 20, marginBottom: 10, color: '#eee'}}>
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
            color: focus ? '#fff' : '#000',
            borderColor: focus ? '#1d8' : '#888',
            backgroundColor: focus ? '#111' : '#ddd',
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login</Text>

        <Pressable icon="close" onPress={navigation.goBack} />
      </View>
      <Input
        ref={usernameRef}
        title="Username"
        placeholder="Username"
        autoComplete="username"
        returnKeyType="next"
        value={data.username}
        onChangeText={value => setData({...data, username: value})}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        ref={passwordRef}
        title="Password"
        placeholder="Password"
        autoComplete="password"
        secureTextEntry
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
    </View>
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sign up</Text>
        <Pressable icon="close" onPress={navigation.goBack} />
      </View>
      <Input
        ref={usernameRef}
        title="Username"
        placeholder="Username"
        autoComplete="username"
        returnKeyType="next"
        value={data.username}
        onChangeText={value => setData({...data, username: value})}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        ref={passwordRef}
        title="Password"
        placeholder="Password"
        autoComplete="password"
        secureTextEntry
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
    </View>
  );
};

const SocialLogin = () => {
  useEffect(() => {
    GoogleSignin.configure();
  }, []);
  const facebookLogin = async () => {
    try {
      const response = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);
      ToastAndroid.show(
        response.isCancelled ? 'Canceled Facebook login' : 'Login successfully',
        2000,
      );
      const profile = await Profile.getCurrentProfile();
      console.info({profile});
      const token = await AccessToken.getCurrentAccessToken();
      console.info({token});
    } catch (error) {
      console.error(error);
    }
  };
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const response = await GoogleSignin.signIn();
      console.info({response});
      ToastAndroid.show('Login successfully', 2000);
    } catch (error) {
      error.code === statusCodes.SIGN_IN_CANCELLED &&
        ToastAndroid.show('Canceled Google login', 2000);
      error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE &&
        ToastAndroid.show('Play services not available', 2000);
      console.info({error});
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Text
        style={{
          textAlign: 'center',
          color: '#ccc',
          fontSize: 20,
          marginTop: 20,
        }}>
        OR
      </Text>
      <View style={styles.container}>
        <TouchableNativeFeedback onPress={facebookLogin}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#4267B2',
              padding: 11,
              borderRadius: 5,
              marginTop: 20,
              alignItems: 'center',
            }}>
            <Ionicon name="logo-facebook" size={25} color="#fff" />
            <Text style={{fontSize: 16, marginStart: 20, color: '#fff'}}>
              Continue with Facebook
            </Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          onPress={googleLogin}
          background={TouchableNativeFeedback.Ripple('#999')}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              padding: 11,
              borderRadius: 5,
              marginTop: 20,
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/images/logo-google.png')}
              style={{width: 25, height: 25}}
            />
            <Text style={{fontSize: 16, marginStart: 20, color: '#555'}}>
              Continue with Google
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
};

const TipText = ({isLoginScreen, onPress}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        bottom: 30,
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.container,
          {
            paddingVertical: 20,
          },
        ]}>
        {isLoginScreen ? <LoginForm /> : <SignupForm />}
        <SocialLogin />
        <TipText
          isLoginScreen={isLoginScreen}
          onPress={() => setIsLoginScreen(!isLoginScreen)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    paddingHorizontal: 15,
    width: '100%',
    height: 50,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#2E8B57',
    marginTop: 20,
    borderRadius: 5,
  },
});
