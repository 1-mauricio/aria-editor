import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const PostEditor = () => {
	const { token } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [post, setPost] = useState({
		title: "",
		subTitle: "",
		category: "",
		content: "",
		readTime: "",
		imageUrl: "",
		customLink: "",
	});
    const apiKey = process.env.REACT_APP_TINYMCE_API_KEY;

	useEffect(() => {
		if (id) {
			fetchPost();
		}
	}, [id]);

	const fetchPost = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(
				`https://imprensamalakoff-backend.onrender.com/api/posts/${id}`
			);
			if (!response.ok) throw new Error("Post não encontrado");
			const data = await response.json();
			setPost(data);
		} catch (error) {
			setError("Erro ao carregar post");
			navigate("/admin/posts");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setPost((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const validateForm = () => {
        const ContentValue = document.getElementById('myEditor').value;
        if (!ContentValue) return "Conteúdo é obrigatório";
        post.content = ContentValue;

		if (!post.title.trim()) return "Título é obrigatório";
		if (!post.category) return "Categoria é obrigatória";
		if (!post.readTime) return "Tempo de leitura é obrigatório";
		if (!post.customLink) {
			const generatedLink = post.title
				.toLowerCase()
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, "");
			setPost((prev) => ({
				...prev,
				customLink: generatedLink,
			}));
		}
		return null;
	};

	const handleSavePost = async () => {
		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			return;
		}

		setIsLoading(true);
		setError(null);

		const method = id ? "PUT" : "POST";
		const url = id
			? `https://imprensamalakoff-backend.onrender.com/api/posts/${id}`
			: "https://imprensamalakoff-backend.onrender.com/api/posts";

		try {
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(post),
			});

			if (!response.ok) {
				throw new Error("Erro ao salvar post");
			}

			navigate("/admin/posts");
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
			alert("Post salvo com sucesso!");
		}
	};

	return (
		<div className="admin-container">
			<header className="admin-header">
				<h1>{id ? "Editar Post" : "Novo Post"}</h1>
				<div className="header-actions">
					<button
						onClick={() => navigate("/admin/posts")}
						className="cancel-btn"
					>
						Cancelar
					</button>
				</div>
			</header>

			<main className="admin-content">
				<div className="post-editor">
					<div className="editor-header">
						<h2 className="editor-title">
							{id ? "Editar Post" : "Criar Novo Post"}
						</h2>
						{error && (
							<div className="feedback-message error">
								{error}
							</div>
						)}
					</div>

					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="title">Título</label>
							<input
								id="title"
								type="text"
								name="title"
								value={post.title}
								onChange={handleChange}
								placeholder="Título do Post"
								disabled={isLoading}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="subTitle">Subtítulo</label>
							<input
								id="subTitle"
								type="text"
								name="subTitle"
								value={post.subTitle}
								onChange={handleChange}
								placeholder="Subtítulo do Post"
								disabled={isLoading}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="category">Categoria</label>
							<select
								id="category"
								name="category"
								value={post.category}
								onChange={handleChange}
								disabled={isLoading}
							>
								<option value="">
									Selecione uma categoria
								</option>
								<option value="Tecnologia">Tecnologia</option>
								<option value="Notícias">Notícias</option>
								<option value="Educação">Educação</option>
								<option value="Política">Política</option>
								<option value="Economia">Economia</option>
								<option value="Ciência">Ciência</option>
								<option value="Saúde">Saúde</option>
								<option value="Esportes">Esportes</option>
								<option value="Cultura">Cultura</option>
							</select>
						</div>

						<div className="form-group">
							<label htmlFor="readTime">
								Tempo de Leitura (minutos)
							</label>
							<input
								id="readTime"
								type="number"
								name="readTime"
								value={post.readTime}
								onChange={handleChange}
								placeholder="Tempo de Leitura"
								disabled={isLoading}
								min="1"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="imageUrl">URL da Imagem</label>
							<input
								id="imageUrl"
								type="url"
								name="imageUrl"
								value={post.imageUrl}
								onChange={handleChange}
								placeholder="URL da imagem de capa"
								disabled={isLoading}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="customLink">
								Link Personalizado
							</label>
							<input
								id="customLink"
								type="text"
								name="customLink"
								value={post.customLink}
								onChange={handleChange}
								placeholder="link-personalizado"
								disabled={isLoading}
							/>
							<small className="help-text">
								Deixe em branco para gerar automaticamente do
								título
							</small>
						</div>

						<div className="form-group full-width">
                        <tinymce-editor
                            id="myEditor"
                            api-key={apiKey}
                            height="600"
                            plugins="preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons accordion"
                            menubar="file edit view insert format tools table help"
                            toolbar="undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image media | table | lineheight outdent indent | forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl"
                            autosave-ask-before-unload="true"
                            autosave-interval="30s"
                            autosave-prefix="{path}{query}-{id}-"
                            autosave-restore-when-empty="false"
                            autosave-retention="2m"
                            image-advtab="true"
                            importcss-append="true"
                            quickbars-selection-toolbar="bold italic | quicklink h2 h3 blockquote quickimage quicktable"
                            noneditable-class="mceNonEditable"
                            toolbar-mode="sliding"
                            contextmenu="link image table"
                            skin="oxide"
                            content_css="default"
                            content_style="body { font-family:Helvetica,Arial,sans-serif; font-size:16px }"
                            media-live-embeds="true"
                            value={post.content}
                        />
                            
						</div>
					</div>

					<div className="editor-actions">
						
						<button
							className="save-button"
							onClick={handleSavePost}
						>
							{id ? (
								"Salvar Alterações"
							) : (
								"Publicar Post"
							)}
						</button>
					</div>
				</div>
			</main>
		</div>
	);
};

export default PostEditor;
