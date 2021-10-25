import React, { useMemo, useState, createContext, useEffect, } from "react";

// creating the context 
export const AuthContext = createContext<{
    // all of these variables should be 
    // defined and given value to in the 
    // default export from this file
    isAuthed: boolean,
    authMetaData: any,
}>({
    isAuthed: false,
    authMetaData: {}
});

export const AuthProvider: React.FC = ({ children }) => {
    const [isAuthed, setIsAuthed] = useState(false);
    const [authMetaData, setAuthMetaData] = useState({});

    useEffect(() => {
        setInterval(() => {
            setIsAuthed((authed) => !authed);
        }, 5000)
    }, [])


    return (
        <AuthContext.Provider
            value={useMemo(
                () => ({
                    isAuthed,
                    authMetaData
                }),
                [isAuthed, authMetaData]
            )}
        >
            {children}
        </AuthContext.Provider>
    );
};