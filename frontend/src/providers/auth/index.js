import React, {useState} from 'react';

const AuthContext = React.createContext(null);

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const login = () => {};

  const register = () => {};

  const logout = () => {};

  const value = {user, setUser, login, register, logout};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export {AuthProvider, useAuth};
