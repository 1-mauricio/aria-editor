import { useEffect, useState } from "react";
import fetchPosts from "../services/PostService";

const usePosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadPosts = async () => {
			try {
				setLoading(true);
				const data = await fetchPosts();
				setPosts(data);
			} catch (err) {
				console.error(err);
				setError("Erro ao carregar posts.");
			} finally {
				setLoading(false);
			}
		};
		loadPosts();
	}, []);

	return { posts, setPosts, loading, error };
};

export default usePosts;
