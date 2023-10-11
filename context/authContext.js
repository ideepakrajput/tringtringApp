import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_API_URL } from '../constants/baseApiUrl';
//context
const AuthContext = createContext();

//provider
const AuthProvider = ({ children }) => {
  //golbal state
  const [state, setState] = useState({
    user: null,
    token: "",
  });
  //notification
  const [isEnabled, setIsEnabled] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(false);

  // initial local storage data
  useEffect(() => {
    const loadLocalStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);

      setState({ ...state, user: loginData?.phoneNumber, token: loginData?.token });

      setAuthenticatedUser(loginData?.phoneNumber && loginData?.token);
    };
    loadLocalStorageData();
  }, [state, authenticatedUser]);

  return (
    <AuthContext.Provider value={{ authenticatedUser, setAuthenticatedUser, state, setState, isEnabled, setIsEnabled }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
