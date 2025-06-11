import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './store/auth.jsx'; // adjust path if needed
import { SearchProvider } from "./store/searchContext.jsx";

createRoot(document.getElementById('root')).render(
   
   <React.StrictMode>
    <SearchProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </SearchProvider>
  </React.StrictMode>,
)
