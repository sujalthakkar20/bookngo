import React, { useState } from "react";
import "./Blog.css";

const Blog = () => {
  const allPosts = [
    {
      id: 1,
      category: "Travel Tips",
      date: "October 1, 2025",
      author: "Riya Patel",
      title: "Top 5 Tips for a Smooth Bus Journey with BookNGo",
      content:
        "Planning a bus trip? Discover five practical tips to make your journey more comfortable and stress-free — from choosing the right seat to tracking your ride live with BookNGo.",
      image:
        "https://images.unsplash.com/photo-1502164980785-f8aa41d53611?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      category: "News",
      date: "September 22, 2025",
      author: "Amit Verma",
      title: "BookNGo Expands to 650,000+ Routes Across India",
      content:
        "We’re excited to announce the expansion of BookNGo’s network! With 6,000+ operators and over 650,000 routes, travelers can now explore more destinations with better comfort and safety.",
      image:
        "https://www.pixelstalk.net/wp-content/uploads/images1/Free-road-wallpaper-hd.jpg",
    },
    {
      id: 3,
      category: "Announcements",
      date: "September 10, 2025",
      author: "Anu V",
      title: "BookNGo Introduces Smart Flexi Ticket Feature",
      content:
        "Your travel plans just got easier! The new Smart Flexi Ticket from BookNGo allows travelers to modify their trip schedule with zero cancellation hassle.",
      image:
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      category: "News",
      date: "August 25, 2025",
      author: "Kunal Sharma",
      title: "BookNGo Partners with Leading State Transport Operators",
      content:
        "BookNGo has partnered with multiple State Transport Corporations to simplify ticket booking and provide real-time seat tracking to millions of passengers.",
      image:
        "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = filter === "All" || post.category === filter;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["All", "News", "Travel Tips", "Announcements"];

  return (
    <div className="blog-page">
      {/* --- Header Section --- */}
      <div className="blog-header">
        <h1>BookNGo Blog</h1>
        <p>Stay updated with travel tips, company news, and smart booking insights.</p>

        {/* --- Search + Filter --- */}
        <div className="blog-controls">
          <input
            type="text"
            placeholder="🔍 Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="blog-categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={filter === cat ? "active" : ""}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Posts Section --- */}
      <div className="blog-container">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="blog-content">
                <span className="blog-category">{post.category}</span>
                <div className="blog-meta">
                  <span>{post.date}</span> — <span>{post.author}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <a href="#" className="read-more">
                  Discover →
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No blog posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
