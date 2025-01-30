const API_URL = "https://imprensamalakoff-backend.onrender.com/api/posts";

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("pt-BR");
};

export const fetchPosts = async () => {
	const response = await fetch(API_URL);
	if (!response.ok) throw new Error("Erro ao buscar posts");
	const posts = await response.json();

	const formattedPosts = posts.map((post) => ({
		...post,
		date: formatDate(post.date),
	}));

	return formattedPosts;
};

export default fetchPosts;
