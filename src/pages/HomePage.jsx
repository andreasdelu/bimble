import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import Button from "../components/Button";
import Loading from "../components/Loading";
import "./styles/HomePage.css";

import { faImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import {
	auth,
	userCreatePost,
	getAllPosts,
	getSomePosts,
	uploadImage,
	getInitialPosts,
} from "../config/firebase";

import optimizeImage from "../modules/imageOptimizer";
import DeluDialog from "../modules/deluDialog";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HomePage() {
	const [user] = useAuthState(auth);

	const [username, setUsername] = useState("noname");
	const [userImage, setUserImage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const [posts, setPosts] = useState([]);
	const MAX_PAGINATION = 5;
	const [noMorePosts, setNoMorePosts] = useState(false);

	document.title = "bimble - Dashboard";
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
			getFirstPosts();

			/* document
				.getElementById("mainContent")
				.addEventListener("scroll", scrollPaginate, false);

			return () => {
				document
					.getElementById("mainContent")
					.removeEventListener("scroll", scrollPaginate, false);
			}; */
		}
		function scrollPaginate() {
			if (this.scrollTop + window.innerHeight >= this.scrollHeight) {
				getNewPosts();
			}
		}
	}, [user]);

	async function getFirstPosts() {
		setIsLoading(true);
		const data = await getInitialPosts(MAX_PAGINATION);
		setPosts(data);
		setIsLoading(false);
	}

	async function getNewPosts() {
		const data = await getSomePosts(MAX_PAGINATION);
		if (data.length > 0) {
			setPosts((posts) => [...posts, ...data]);
		} else {
			setNoMorePosts(true);
		}
	}

	function handleMakePostInput(e) {
		e.target.style.height = 0;
		e.target.style.height = e.target.scrollHeight - 16 + "px";
	}

	async function createPost(e) {
		e.preventDefault();
		if (!e.target.text.value) {
			console.log("no text");
			return;
		}

		if (e.target.image.files.length > 0) {
			const blob = await optimizeImage(e.target.image.files[0], 600);
			const fileRef = await uploadImage(blob);
			await userCreatePost(user, e.target.text.value, fileRef);
		} else {
			await userCreatePost(user, e.target.text.value, "");
		}
		e.target.reset();
		getFirstPosts();
	}

	async function handleImageUpload(e) {}

	return (
		<>
			<div id='makePost'>
				<div className='makePostLeft'>
					<img id='makePostUser' src={userImage} alt={username} />
				</div>
				<div className='makePostRight'>
					<form onSubmit={createPost} id='makePostForm'>
						<textarea
							onChange={handleMakePostInput}
							placeholder='Write something :)'
							name='text'
							id='makePostText'></textarea>
						<div className='formFooter'>
							<div className='imageUpload'>
								<input
									onChange={handleImageUpload}
									type='file'
									name='image'
									id='imageUpload'
								/>
								<FontAwesomeIcon icon={faImage} />
							</div>
							<button type='submit'>
								<FontAwesomeIcon icon={faPaperPlane} />
							</button>
						</div>
					</form>
				</div>
			</div>
			<div id='feed'>
				{isLoading && <Loading />}
				{posts.map((post, i) => (
					<Post
						key={post.id}
						postId={post.id}
						uid={post.data.uid}
						text={post.data.textbody}
						time={post.data.timestamp}
						postObject={post}
					/>
				))}
				{!noMorePosts ? (
					<Button cta={true} onClick={getNewPosts} text={"Load more posts"} />
				) : (
					<p style={{ textAlign: "center" }}>You are up to date :)</p>
				)}
			</div>
		</>
	);
}
