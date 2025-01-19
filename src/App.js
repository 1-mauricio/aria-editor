import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PostList from "./components/PostList";
import PostEditor from "./components/PostEditor";
import Auth from "./components/Auth";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Auth />} />

				<Route
					path="/"
					element={<Navigate to="/admin/posts" replace />}
				/>

				<Route path="/admin" element={<PrivateRoute />}>
					<Route path="posts" element={<PostList />} />
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
