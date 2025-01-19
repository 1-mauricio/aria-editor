import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { useAuth } from "../contexts/AuthContext";
import Analytics from "./Analytics";

const PostList = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filter, setFilter] = useState("");
	const [sortBy, setSortBy] = useState("date");
	const [sortOrder, setSortOrder] = useState("desc");

	if (window.tinymce) {
		window.tinymce.remove();
	}

	useEffect(() => {
		fetchPosts();
	}, []);

	const fetchPosts = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				"https://imprensamalakoff-backend.onrender.com/api/posts"
			);
			if (!response.ok) throw new Error("Falha ao carregar posts");
			const data = await response.json();
			setPosts(data);
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (postId) => {
		if (!window.confirm("Tem certeza que deseja deletar este post?"))
			return;

		try {
			const response = await fetch(
				`https://imprensamalakoff-backend.onrender.com/api/posts/${postId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"authToken"
						)}`,
					},
				}
			);
			if (!response.ok) throw new Error("Erro ao deletar post");
			setPosts(posts.filter((post) => post.id !== postId));
		} catch (error) {
			alert(error.message);
		}
	};

	const handleEdit = (postId) => {
		navigate(`/admin/editor/${postId}`);
	};

	const handleNewPost = () => {
		navigate("/admin/editor");
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const filteredAndSortedPosts = posts
		.filter(
			(post) =>
				post.title.toLowerCase().includes(filter.toLowerCase()) ||
				post.category.toLowerCase().includes(filter.toLowerCase())
		)
		.sort((a, b) => {
			const modifier = sortOrder === "asc" ? 1 : -1;
			return modifier * (a[sortBy] > b[sortBy] ? 1 : -1);
		});

	if (loading)
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);

	if (error) return <div className="error">{error}</div>;

	return (
		<div className="admin-container">
			<header className="admin-header">
				<h1>Ária Editor</h1>
				<div className="header-actions">
					<button onClick={handleNewPost} className="new-post-btn">
						Novo Post
					</button>
					<button onClick={handleLogout} className="logout-btn">
						Sair
					</button>
				</div>
			</header>

			<main className="admin-content">
				<div className="list-controls">
					<input
						type="text"
						placeholder="Buscar posts..."
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						className="filter-input"
					/>
					<div className="sort-controls">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="sort-select"
						>
							<option value="date">Data</option>
							<option value="title">Título</option>
							<option value="category">Categoria</option>
						</select>
						<button
							onClick={() =>
								setSortOrder((prev) =>
									prev === "asc" ? "desc" : "asc"
								)
							}
							className="sort-direction"
							title={
								sortOrder === "asc"
									? "Ordem crescente"
									: "Ordem decrescente"
							}
						>
							{sortOrder === "asc" ? "↑" : "↓"}
						</button>
					</div>
				</div>

				{filteredAndSortedPosts.length === 0 ? (
					<div className="no-posts">
						{filter
							? "Nenhum post encontrado para esta busca."
							: "Nenhum post cadastrado."}
					</div>
				) : (
					<div className="posts-grid">
						{filteredAndSortedPosts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								onEdit={() => handleEdit(post.id)}
								onDelete={() => handleDelete(post.id)}
							/>
						))}
					</div>
				)}

			<Analytics />

			</main>

		</div>
	);
};

export default PostList;
