import React, { useEffect } from "react";
import { useRef } from "react";
import Button from "../components/Button";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";

import { auth, registerWithEmailAndPassword } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
	const [user, loading, error] = useAuthState(auth);
	const navigate = useNavigate();
	const formRef = useRef(null);

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, []);

	async function handleSignUp(e) {
		e.preventDefault();
		let email = e.target.email.value;
		let password = e.target.pass.value;
		registerWithEmailAndPassword("test", email, password);
		navigate("/login");
	}
	function handleLogin() {
		navigate("/login");
	}

	return (
		<div className='loginScreen'>
			<div id='loginContainer'>
				<h2>Sign Up</h2>
				<form onSubmit={handleSignUp} ref={formRef} id='loginForm'>
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
						<button type='submit'>Sign Up</button>
						<Button onClick={handleLogin} text={"Login"} />
					</div>
				</form>
			</div>
		</div>
	);
}
