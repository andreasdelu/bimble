import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";

import { useEffect } from "react";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../components/Loading";

export default function AuthLayout() {
	const navigate = useNavigate();
	const [user, loading, error] = useAuthState(auth);

	useEffect(() => {
		if (!user) {
			if (loading) {
			} else {
				navigate("/login");
			}
		}
	}, [user, loading]);

	return (
		<>
			{loading ? (
				<div className='loadingContainer'>
					<Loading />
				</div>
			) : (
				<>
					<Header />
					<div id='mainContent'>
						<Outlet />
					</div>
				</>
			)}
		</>
	);
}
