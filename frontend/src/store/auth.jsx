import {createContext,useState,useContext} from "react";

export const AuthContext=createContext();

export const AuthProvider= ({children})=>{

const [token,setToken]=useState(localStorage.getItem("token"));
const storetokenInLS=(serverToken)=>{
    return localStorage.setItem("token",serverToken);
};


let isLoggedIn=!!token;
const LogoutUser=()=>{
    setToken("");
    return localStorage.removeItem("token");
};

    return (<AuthContext.Provider value={{isLoggedIn,storetokenInLS, LogoutUser}}>
        {children}
        </AuthContext.Provider>);

};

export const useAuth=()=>{// this function useAuth uses useContext to use this code inh different components of the project and this AuthContext gives you the privilage to use the above storetokenInLS in all the other components
    const authContextValue=useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth used outside of the provider");
    }
    return authContextValue;
};

