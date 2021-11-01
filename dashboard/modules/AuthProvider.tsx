import axios from "axios";
import { useRouter } from "next/router";
import React, { useMemo, useState, createContext, useEffect, PropsWithChildren, } from "react";
import { apiUrl } from "./apiUrl";

export const AuthContext = createContext<{
	isAuthed: boolean,
	authMetaData: any,
}>({
	isAuthed: false,
	authMetaData: {}
});

export const AuthProvider = ({ children, requiresAuth }: PropsWithChildren<{ requiresAuth: boolean }>) => {
	const router = useRouter();
	const [isAuthed, setIsAuthed] = useState<boolean>(false);
	const [authMetaData, setAuthMetaData] = useState<any>({});

	useEffect(() => {
		if (!requiresAuth) return;
		const authToken = window.localStorage.getItem("authToken");
		if (!authToken) router.push("/login");

		axios.get(`${apiUrl.v1}/users/@me`, {
			headers: {
				Authorization: authToken || ""
			}
		}).then(data => data.data)
			.then(data => {
				setIsAuthed(true)
				setAuthMetaData(data);
			}).catch(err => {
				return router.push("/login");
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