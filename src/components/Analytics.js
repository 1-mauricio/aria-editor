import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Analytics = () => {
	const [stats, setStats] = useState({
		totalViews: 0,
		weeklyViews: 0,
		monthlyViews: 0,
		topPosts: [],
		categories: {},
	});
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("week");

	useEffect(() => {
		fetchAnalytics();
	}, []);

	const fetchAnalytics = async () => {
		try {
			const response = await fetch(
				"https://imprensamalakoff-backend.onrender.com/api/posts"
			);
			const data = await response.json();
			setStats(calculatePostStatistics(data));
		} catch (error) {
			console.error("Erro ao carregar analytics:", error);
		} finally {
			setLoading(false);
		}
	};

	function calculatePostStatistics(posts) {
		let totalViews = 0;
		let weeklyViews = 0;
		let monthlyViews = 0;
		let categoryDistribution = {};
		let topPostsWeek = [];
		let topPostsMonth = [];

		posts.forEach((post) => {
			totalViews += post.viewCount || 0;
			weeklyViews += post.viewsThisWeek || 0;
			monthlyViews += post.viewsThisMonth || 0;

			const category = post.category || "Sem categoria";
			categoryDistribution[category] =
				(categoryDistribution[category] || 0) + 1;

			topPostsWeek.push({
				id: post.id,
				title: post.title,
				views: post.viewsThisWeek || 0,
				period: "week",
			});

			topPostsMonth.push({
				id: post.id,
				title: post.title,
				views: post.viewsThisMonth || 0,
				period: "month",
			});
		});

		topPostsWeek = topPostsWeek
			.sort((a, b) => b.views - a.views)
			.slice(0, 5);
		topPostsMonth = topPostsMonth
			.sort((a, b) => b.views - a.views)
			.slice(0, 5);

		return {
			totalViews: totalViews,
			weeklyViews: weeklyViews,
			monthlyViews: monthlyViews,
			categoryDistribution: categoryDistribution,
			topPosts: [...topPostsWeek, ...topPostsMonth],
		};
	}

	if (loading)
		return (
			<div className="loading-container">
				<div className="loading-spinner"></div>
			</div>
		);

	return (
		<section className="analytics-section">
			<h2>Análise de Desempenho</h2>

			<div className="analytics-grid">
				{/* Cards de Métricas */}
				<div className="metric-card total-views">
					<div className="metric-icon">👁️</div>
					<div className="metric-content">
						<h3>Total de Visualizações</h3>
						<p className="metric-value">{stats.totalViews}</p>
					</div>
				</div>

				<div className="metric-card weekly-views">
					<div className="metric-icon">📅</div>
					<div className="metric-content">
						<h3>Visualizações na Semana</h3>
						<p className="metric-value">{stats.weeklyViews}</p>
					</div>
				</div>

				<div className="metric-card monthly-views">
					<div className="metric-icon">📊</div>
					<div className="metric-content">
						<h3>Visualizações no Mês</h3>
						<p className="metric-value">{stats.monthlyViews}</p>
					</div>
				</div>
			</div>

			{/* Posts Mais Vistos */}
			<div className="top-posts-section">
				<h3>Posts Mais Vistos</h3>
				<div className="most-viewed-header">
					<div className="tab-navigation">
						<button
							className={`tab-button ${
								activeTab === "week" ? "active" : ""
							}`}
							onClick={() => setActiveTab("week")}
						>
							Semana
						</button>
						<button
							className={`tab-button ${
								activeTab === "month" ? "active" : ""
							}`}
							onClick={() => setActiveTab("month")}
						>
							Mês
						</button>
					</div>
				</div>

				<div className="most-viewed-list">
					{stats.topPosts
						.filter((post) => post.period === activeTab)
						.map((post, index) => (
							<Link
								to={`https://imprensamalakoff-frontend.onrender.com/p/${post.id}`}
								target="_blank"
								style={{ textDecoration: "none" }}
							>
								<div key={post.id} className="most-viewed-item">
									<span className="most-viewed-number">
										{index + 1}
									</span>
									<div className="most-viewed-content">
										<h4>{post.title}</h4>
										<span className="most-viewed-views">
											{post.views} visualizações
										</span>
									</div>
								</div>
							</Link>
						))}
				</div>
			</div>
		</section>
	);
};

export default Analytics;
