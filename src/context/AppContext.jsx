
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL 
  || 'https://hotel-booking-backend-production-aec5.up.railway.app';

axios.defaults.baseURL = BACKEND_URL;

console.log('🔗 Backend URL:', BACKEND_URL);
export const AppContext = createContext();
const AppContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [owner,setOwner] = useState(null);
    
    const value = {navigate,user,setUser,owner,setOwner,axios};
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;