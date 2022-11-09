import {
	faComment,
	faHeart,
	faShare,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useEffect } from "react";
import "./styles/Post.css";
import dots from "../assets/edit.svg";

import {
	auth,
	getUser,
	likePost,
	dislikePost,
	userDeletePost,
} from "../config/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";

export default function Post({ uid, text, time, postId, postObject }) {
	const [user, setUser] = useState(null);
	const [likes, setLikes] = useState(postObject.data.likes.length);
	const [liked, setLiked] = useState(false);
	const [postBelongsToUser, setPostBelongsToUser] = useState(false);
	const [postDeleted, setPostDeleted] = useState(false);
	const [editPost, setEditPost] = useState(false);

	const navigate = useNavigate();

	const dateOptions = {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
	};

	useEffect(() => {
		if (uid === auth.currentUser.uid) {
			setPostBelongsToUser(true);
		}
		async function getUserFromUid() {
			const data = await getUser(uid);
			setUser(data);
		}
		getUserFromUid();
		function getLikes() {
			if (postObject.data.likes.includes(auth.currentUser.uid)) {
				setLiked(true);
			}
		}
		getLikes();
	}, [uid, postObject.data.likes]);

	return (
		<>
			{!postDeleted && (
				<div className='postContainer'>
					<div className='postHeader'>
						<div className='postAuthor'>
							{user?.image ? (
								<img
									onClick={() => navigate("user/" + uid)}
									className='authorImg'
									src={user.image}
									alt=''
								/>
							) : (
								<FontAwesomeIcon
									onClick={() => navigate("user/" + uid)}
									className='authorImage'
									icon={faUser}
									size={"lg"}
								/>
							)}
							<p onClick={() => navigate("user/" + uid)} className='authorName'>
								{user?.name}
							</p>
							{postBelongsToUser && (
								<div className='postEdit'>
									<Dropdown
										button={<img className='editBtn' src={dots} alt='dots' />}
										options={[
											{
												text: "Delete Post",
												onClick: () => {
													userDeletePost(postId);
													setPostDeleted(true);
												},
											},
										]}
										direction='left'
									/>
								</div>
							)}
						</div>
						<small className='postTime'>
							{new Date(time).toLocaleDateString(undefined, dateOptions)}
						</small>
					</div>
					<div className='postBody'>
						<p className='postText'>{text}</p>
						{postObject?.data.image && (
							<img className='postImage' src={postObject.data.image} alt='' />
						)}
					</div>
					<div className='postFooter'>
						<div
							onClick={() => {
								if (!liked) {
									likePost(user?.uid, postId);
									setLikes(likes + 1);
									setLiked(true);
								} else {
									dislikePost(user?.uid, postId);
									setLikes(likes - 1);
									setLiked(false);
								}
							}}
							className='postLikes'>
							<FontAwesomeIcon
								className={liked ? "postLiked" : ""}
								icon={faHeart}
								size={"lg"}
							/>
							<small className='postStat postLikesAmount'>{likes}</small>
						</div>
						<div className='postComments'>
							<FontAwesomeIcon icon={faComment} size={"lg"} />
							<small className='postStat postCommentsAmount'>0</small>
						</div>
						<div className='postShares'>
							<FontAwesomeIcon icon={faShare} size={"lg"} />
							<small className='postStat postSharesAmount'>0</small>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
