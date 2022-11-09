import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Loading() {
	return (
		<div
			style={{
				width: "100%",
				display: "grid",
				placeItems: "center",
			}}
			id='loadingContainer'>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
				className='loadstuff'>
				<FontAwesomeIcon className='spinner' icon={faCircleNotch} size={"xl"} />
				<p>Loading</p>
			</div>
		</div>
	);
}
