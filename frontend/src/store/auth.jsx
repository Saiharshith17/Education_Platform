import {createContext,useState,useContext,useEffect} from "react";

export const AuthContext=createContext();

export const AuthProvider= ({children})=>{

const [token,setToken]=useState(localStorage.getItem("token"));
const [user,setUser]=useState();

const storetokenInLS=(serverToken)=>{
    return localStorage.setItem("token",serverToken);
};

let isLoggedIn=!!token;
console.log("isLoggedIn",isLoggedIn);
const LogoutUser=()=>{
    setToken("");
    return localStorage.removeItem("token");
};

const userAuthentication=async ()=>{
    try{
        const response=await fetch("http://localhost:5000/api/auth/user",{
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        });



    
        if(response.ok){
         const data=await response.json();
         console.log("user data",data.userData);
         setUser(data.userData);
        }


    }catch(error){
        console.error("Error fetching user data");
    }
};


useEffect(()=>{
    userAuthentication();
},[]);



    return (<AuthContext.Provider value={{isLoggedIn,storetokenInLS, LogoutUser,user,setUser,token,userAuthentication}}>
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

