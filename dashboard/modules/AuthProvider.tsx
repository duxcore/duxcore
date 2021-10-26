import axios from "axios";
import { useRouter } from "next/router";
import React, { useMemo, useState, createContext, useEffect, PropsWithChildren, } from "react";
import { apiUrl } from "./apiUrl";

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

export const AuthProvider = ({ children, requiresAuth }: PropsWithChildren<{ requiresAuth: boolean }>) => {
	const router = useRouter();
	const [isAuthed, setIsAuthed] = useState(null);
	const [authMetaData, setAuthMetaData] = useState({});

	useEffect(() => {
		if (!requiresAuth) return;
		const authToken = window.localStorage.getItem("authToken");
		if (!authToken) router.push("/login");

		axios.get(`${apiUrl.v1}/users/@me`, {
			headers: {
				Authorization: authToken
			}
		}).then(data => data.data)
			.then(data => {
				setIsAuthed(true)
				setAuthMetaData(data);
			}).catch(err => {
				if ((err.data && err.data.meta) !== undefined) router.push("/login");
				setIsAuthed(false);
			})
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