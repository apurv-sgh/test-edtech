import React, { createContext, useState } from "react";

export const NotifyContext = createContext();


export const NotifyProvider = ({ children }) =>{

    const [toasts, setToasts] = useState([]);
    
    const notify = (msg, type = 'info') => {
        const toast = { id: Date.now(), msg, type };
        setToasts((prev) => [...prev, toast]);
        setTimeout(() => setToasts((prev) => prev.filter(t => t.id !== toast.id)), 3000);
    }
    
    return (
        <NotifyContext.Provider
        value={notify}>
            {children}
        </NotifyContext.Provider>
    )
}
