import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PostList from "./components/PostList";
import PostEditor from "./components/PostEditor";
import Auth from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import fetchPosts from "./services/PostService";
import usePosts from "./hooks/UsePosts";

function App() {
	const { posts, loading, error } = usePosts();

	if (loading)
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Auth />} />

				<Route
					path="/"
					element={<Navigate to="/admin/posts" replace />}
				/>

				<Route path="/admin" element={<PrivateRoute />}>
					<Route path="posts" element={<PostList data={posts} />} />
					<Route path="editor" element={<PostEditor />} />
					<Route path="editor/:id" element={<PostEditor />} />
				</Route>

				<Route
					path="*"
					element={<Navigate to="/admin/posts" replace />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
