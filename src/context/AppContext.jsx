
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL 
  || 'https://hotel-booking-backend-production-aec5.up.railway.app';

axios.defaults.baseURL = BACKEND_URL;
export const AppContext = createContext();
const AppContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [owner,setOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('📦 Token found in localStorage');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/user/profile');
            
            // console.log('✅ Profile response:', data);
            
            if (data.success && data.user) {
                setUser(data.user);
                setOwner(data.user.role === 'owner');
                // console.log('✅ User authenticated:', data.user.email, 'Role:', data.user.role);
            } else {
                setUser(null);
                setOwner(false);
            }
        } catch (error) {
                console.log('Not authenticated');
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                    setOwner(false);
         }
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/user/logout');
            console.log('Logout successful');
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            // Clear token and user state
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setOwner(false);
            navigate('/login');
        }
    };
    const value = {navigate,user,setUser,owner,setOwner,axios, loading,logout,checkAuth};
    return(
        <AppContext.Provider value={value}>
            {loading ? <Loading fullScreen={true} message="Loading .." /> : children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;