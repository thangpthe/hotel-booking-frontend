import React, { useContext, useEffect } from 'react';
import AppContext from "../context/AppContext";
import { useParams } from 'react-router-dom';
const Loader = () => {
    const {navigate} = useContext(AppContext);
    const {nextUrl} = useParams();
    useEffect(() => {
        if(nextUrl){
            setTimeout(() => {
                navigate(`/${nextUrl}`);
            }, 8000);
        }
    },[nextUrl]);
  return (
    <div>Loader</div>
  )
}

export default Loader;