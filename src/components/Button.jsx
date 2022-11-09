import React from "react";
import "./styles/Button.css";

export default function Button({ text, cta, onClick }) {
	if (cta === undefined) {
		cta = false;
	}

	return (
		<>
			<div
				onClick={onClick}
				className={
					cta ? "buttonContainer buttonCallToAction" : "buttonContainer"
				}>
				<p className='buttonText'>{text}</p>
			</div>
		</>
	);
}
