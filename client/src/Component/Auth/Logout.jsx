import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();
    const logoutUser = () => {
        localStorage.removeItem("userData");
        navigate("/");
    }
    useEffect(() => {
        logoutUser();
    })
}

export default Logout