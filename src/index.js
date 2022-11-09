import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./modules/styles/deluDialog.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuthLayout from "./layouts/AuthLayout";
import UserProfile from "./pages/UserProfile";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<SignUp />} />
				<Route element={<AuthLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/messages' element={<HomePage />} />
					<Route path='/explore' element={<HomePage />} />
					<Route path='/user/:userId' element={<UserProfile />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>
);
