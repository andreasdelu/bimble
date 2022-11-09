import logo from "../assets/logo.svg";
import {
	faCompass,
	faEnvelope,
	faHouse,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles/Header.css";

import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useEffect } from "react";

export default function Header() {
	const [user] = useAuthState(auth);
	const [username, setUsername] = useState("noname");
	const [userImage, setUserImage] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			if (!user.displayName) {
				setUsername(user.email.split("@")[0]);
			} else {
				setUsername(user.displayName.split(" ")[0]);
			}
			if (user.photoURL) {
				setUserImage(user.photoURL);
			}
		}
	}, [user]);

	function goToProfile() {
		navigate("user/" + user.uid);
	}

	return (
		<>
			<nav id='navBar'>
				<div className='logoContainer'>
					<img className='logo' src={logo} alt='bimble logo' />
				</div>
				<div className='navMenuItems'>
					<NavLink className='menuItem' to={"/"}>
						<FontAwesomeIcon icon={faHouse} size='lg' />
					</NavLink>
					<NavLink className='menuItem' to={"/messages"}>
						<FontAwesomeIcon icon={faEnvelope} size='lg' />
					</NavLink>
					<NavLink className='menuItem' to={"/explore"}>
						<FontAwesomeIcon icon={faCompass} size='lg' />
					</NavLink>
				</div>
				<div className='userContainer'>
					<div
						onClick={() => {
							goToProfile();
						}}
						className='user'>
						<p className='username'>{username}</p>
						{userImage ? (
							<img src={userImage} alt={username} className='userImage' />
						) : (
							<FontAwesomeIcon className='userIcon' icon={faUser} />
						)}
					</div>
				</div>
			</nav>
		</>
	);
}
