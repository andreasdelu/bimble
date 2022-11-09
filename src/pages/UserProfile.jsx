import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles/UserProfile.css";

import { getUser, getAllPostsFromUser, auth } from "../config/firebase";
import Post from "../components/Post";

import DeluDialog from "../modules/deluDialog";
import Button from "../components/Button";

export default function UserProfile() {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [userPosts, setUserPosts] = useState([]);
	const [thisUser, setThisUser] = useState(false);

	useEffect(() => {
		async function getUserData() {
			const data = await getUser(userId);
			document.title = "bimble - " + data.name;
			setUser(data);
			const posts = await getAllPostsFromUser(userId);
			setUserPosts(posts);
		}
		getUserData();
		if (userId === auth.currentUser.uid) {
			setThisUser(true);
		}
	}, [userId]);

	useEffect(() => {
		window.addEventListener("click", imageClick, false);

		function imageClick(e) {
			if (e.target.classList.contains("postImage")) {
				new DeluDialog({ image: e.target.src, color: "#222526" }).spawn();
			}
		}

		return () => {
			window.removeEventListener("click", imageClick, false);
		};
	}, []);

	return (
		<div id='userProfileWrap'>
			<div className='profileContainer'>
				<img className='profileImage' src={user?.image} alt={user?.name} />
				<div className='profileInfo'>
					<p className='profileName'>{user?.name}</p>
					<p className='profileEmail'>{user?.email}</p>
				</div>
			</div>
			{!thisUser ? (
				<div className='profileButtons'>
					<Button cta={true} text={"Follow"} />
					<Button cta={false} text={"Message"} />
				</div>
			) : (
				<div className='profileButtons'>
					<Button cta={true} text={"Edit Profile"} />
				</div>
			)}

			<div id='allUserPosts'>
				{userPosts.map((post, i) => (
					<Post
						key={post.id}
						postId={post.id}
						uid={post.data.uid}
						text={post.data.textbody}
						time={post.data.timestamp}
						postObject={post}
					/>
				))}
			</div>
		</div>
	);
}
