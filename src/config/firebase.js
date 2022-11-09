import { initializeApp } from "firebase/app";
import {
	GoogleAuthProvider,
	getAuth,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signOut,
} from "firebase/auth";
import {
	getFirestore,
	query,
	getDocs,
	getDoc,
	setDoc,
	doc,
	collection,
	where,
	addDoc,
	updateDoc,
	orderBy,
	startAt,
	limit,
	endAt,
	getCountFromServer,
	endBefore,
	startAfter,
	deleteDoc,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyA-KPiBtFvCp9U0O_HLYXrr0kQ2hnXMAAE",
	authDomain: "testing-d1688.firebaseapp.com",
	projectId: "testing-d1688",
	storageBucket: "testing-d1688.appspot.com",
	messagingSenderId: "112963022317",
	appId: "1:112963022317:web:5b61bff9fdf8bcdb480be4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const user = res.user;
		const q = query(collection(db, "users"), where("uid", "==", user.uid));
		const docs = await getDocs(q);
		if (docs.docs.length === 0) {
			await setDoc(doc(db, "users/" + user.uid), {
				uid: user.uid,
				name: user.displayName,
				authProvider: "google",
				email: user.email,
				image: user.photoURL,
			});
		}
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const logInWithEmailAndPassword = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const registerWithEmailAndPassword = async (name, email, password) => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password);
		const user = res.user;
		await setDoc(doc(db, "users/" + user.uid), {
			uid: user.uid,
			name,
			authProvider: "local",
			email,
		});
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const sendPasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		alert("Password reset link sent!");
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const logout = () => {
	signOut(auth);
};

async function userCreatePost(user, textBody, image = "") {
	try {
		const colRef = collection(db, "userposts");
		const postObject = {
			uid: user.uid,
			textbody: textBody,
			timestamp: Date.now(),
			image: image,
			likes: [],
		};
		await addDoc(colRef, postObject);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}
async function userDeletePost(postId) {
	try {
		const docRef = doc(db, "userposts", postId);
		await deleteDoc(docRef);
		return true;
	} catch (error) {
		console.error(error);
		return false;
	}
}

async function getAllPosts() {
	const postArray = [];
	const colRef = collection(db, "userposts");
	const userPosts = await getDocs(colRef);
	for (const post of userPosts.docs) {
		const postObject = {
			id: post.id,
			data: post.data(),
		};
		postArray.push(postObject);
	}
	sortPosts(postArray);
	return postArray;
}

let lastKey;
let loadedPosts = 0;
let docCount = 0;

async function getInitialPosts(amount) {
	const countCol = await getCountFromServer(collection(db, "userposts"));
	docCount = countCol.data().count;
	const postArray = [];
	const colRef = collection(db, "userposts");
	const q = query(colRef, orderBy("timestamp", "desc"), limit(amount));
	const userPosts = await getDocs(q);
	for (const post of userPosts.docs) {
		const postObject = {
			id: post.id,
			data: post.data(),
		};
		postArray.push(postObject);
		lastKey = post.data().timestamp;
	}
	loadedPosts = amount;
	return postArray;
}
async function getSomePosts(amount) {
	if (loadedPosts >= docCount) {
		console.log("no more posts");
		return [];
	}
	try {
		const postArray = [];
		const colRef = collection(db, "userposts");
		const q = query(
			colRef,
			orderBy("timestamp", "desc"),
			startAfter(lastKey),
			limit(amount)
		);
		const userPosts = await getDocs(q);
		for (const post of userPosts.docs) {
			const postObject = {
				id: post.id,
				data: post.data(),
			};
			postArray.push(postObject);
			lastKey = post.data().timestamp;
		}
		loadedPosts += amount;
		return postArray;
	} catch (error) {
		console.log(error);
	}
}

async function getAllPostsFromUser(uid) {
	const postArray = [];
	const q = query(collection(db, "userposts"), where("uid", "==", uid));
	const userPosts = await getDocs(q);
	for (const post of userPosts.docs) {
		const postObject = {
			id: post.id,
			data: post.data(),
		};
		postArray.push(postObject);
	}
	sortPosts(postArray);
	return postArray;
}

function sortPosts(array) {
	array.sort((a, b) => b.data.timestamp - a.data.timestamp);
}

async function getUser(uid) {
	const user = await getDoc(doc(db, "users", uid));
	return user.data();
}

async function likePost(uid, postId) {
	try {
		const colRef = collection(db, "userposts");
		const postRef = doc(colRef, postId);
		const post = await getDoc(postRef);
		const data = post.data();
		data.likes.push(auth.currentUser.uid);
		await updateDoc(postRef, data);
	} catch (error) {
		console.error(error);
	}
}
async function dislikePost(uid, postId) {
	try {
		const colRef = collection(db, "userposts");
		const postRef = doc(colRef, postId);
		const post = await getDoc(postRef);
		const data = post.data();
		data.likes = data.likes.filter((id) => id !== auth.currentUser.uid);
		await updateDoc(postRef, data);
	} catch (error) {
		console.error(error);
	}
}

async function uploadImage(file) {
	try {
		const filename = auth.currentUser.uid.slice(0, 4) + Date.now();
		const storageRef = ref(storage, filename);
		await uploadBytes(storageRef, file).then((snapshot) => {
			console.log("File succesfully uploaded");
		});
		const url = await getDownloadURL(storageRef);
		return url;
	} catch (error) {
		console.error(error);
	}
}

export {
	auth,
	db,
	signInWithGoogle,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordReset,
	logout,
	userCreatePost,
	userDeletePost,
	getAllPosts,
	getAllPostsFromUser,
	getUser,
	likePost,
	dislikePost,
	uploadImage,
	getSomePosts,
	getInitialPosts,
};
