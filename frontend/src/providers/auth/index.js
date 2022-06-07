import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Alert, ToastAndroid} from 'react-native';

const AuthContext = React.createContext(null);

const AuthProvider = ({children}) => {
  const navigation = useNavigation();

  const getUser = async () => {
    try {
      const data = await AsyncStorage.getItem('user');
      return data !== null ? JSON.parse(data) : null;
    } catch (error) {
      console.error(error);
    }
  };

  const setUser = async user => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  };

  const login = async info => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        body: info,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.error) {
        data.error =
          'Unauthorized' &&
          Alert.alert('Error', 'Username or password is incorrect!');
      } else {
        await AsyncStorage.setItem('user', JSON.stringify(data));
        ToastAndroid.show('Login successfully!', 2000);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const register = async info => {
    try {
      const response = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        body: info,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const message = await response.text();
      console.log(message);
      ToastAndroid.show('Sign up successfully!', 2000);
    } catch (error) {
      console.error(error);
    }
  };
  const logout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Home');
  };

  const value = {getUser, setUser, login, register, logout};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export {AuthProvider, useAuth};
