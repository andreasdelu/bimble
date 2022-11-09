import React, { useEffect, useRef, useState } from "react";
import "./styles/Dropdown.css";

export default function Dropdown({ button, options = [], direction = "left" }) {
	const containerRef = useRef(null);
	const [shown, setShown] = useState(false);

	useEffect(() => {
		/* window.addEventListener("click", awayClick, false);

		function awayClick(e) {
			if (
				!e.target.classList.contains("dropdownItem") &&
				!e.target.classList.contains("dropdownClicker")
			) {
				setShown(false);
			}
		}
		return () => {
			window.removeEventListener("click", awayClick, false);
		}; */
	}, []);
	return (
		<>
			<div className='dropdownClicker' onClick={() => setShown(!shown)}>
				{button}
			</div>
			{shown && (
				<div
					ref={containerRef}
					className={
						direction === "right"
							? "dropdownContainer dcLeft "
							: "dropdownContainer dcRight "
					}>
					{options.map((option, i) => (
						<div onClick={option?.onClick} key={i} className='dropdownItem'>
							{option.text}
						</div>
					))}
				</div>
			)}
		</>
	);
}
