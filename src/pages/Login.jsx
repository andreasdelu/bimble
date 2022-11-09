import React from "react";
import { useRef } from "react";
import Button from "../components/Button";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.svg";

import {
	auth,
	logInWithEmailAndPassword,
	signInWithGoogle,
} from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login() {
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();
	const formRef = useRef(null);

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user]);

	async function handleLogin(e) {
		e.preventDefault();
		let email = e.target.email.value;
		let password = e.target.pass.value;
		logInWithEmailAndPassword(email, password);
	}
	function handleSignUp() {
		navigate("/signup");
	}

	return (
		<div className='loginScreen'>
			<div id='loginContainer'>
				<h2>Login</h2>
				<form onSubmit={handleLogin} ref={formRef} id='loginForm'>
					<input
						type='email'
						name='email'
						id='loginEmail'
						placeholder='Email'
						required
					/>
					<input
						type='password'
						name='pass'
						id='loginPass'
						placeholder='Password'
						required
					/>
					<div className='loginButtons'>
						<button type='submit'>Login</button>
						<Button onClick={handleSignUp} text={"Sign Up"} />
					</div>
				</form>
				<hr />
				<div className='altLogins'>
					<small>Other</small>
					<div
						onClick={() => {
							signInWithGoogle();
						}}
						className='altLoginButton'>
						<img src={google} alt='google' />
						<p className='altLoginText'>Login using Google</p>
					</div>
				</div>
			</div>
		</div>
	);
}
