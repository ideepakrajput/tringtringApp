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
  //predicted for today
  const [isPredicted, setisPredicted] = useState(false);
  //notification
  const [isEnabled, setIsEnabled] = useState(null);
  const [editCount, setEditCount] = useState(Number);

  // initial local storage data
  useEffect(() => {
    const loadLocalStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);

      setState({ ...state, user: loginData?.phoneNumber, token: loginData?.token });
      const token = loginData?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.get(`${BASE_API_URL}api/user/edit_count`, config).then((res) => {
        setEditCount(res.data.editCount);
      })
    };
    loadLocalStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ state, setState, isPredicted, setisPredicted, isEnabled, setIsEnabled, editCount, setEditCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
