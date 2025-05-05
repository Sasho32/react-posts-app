import React, { useEffect, useState } from 'react';
import PostList from './components/PostList';
import Filter from './components/Filter';
import PostForm from './components/PostForm';

const App = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userIds, setUserIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'https://jsonplaceholder.typicode.com';

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchAllPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`${API_URL}/posts`, { signal });
                if (!res.ok)
                    throw new Error(`HTTP error! Status: ${res.status}`);
                const data = await res.json();
                // await new Promise(res => setTimeout(res, 6000));
                setAllPosts(data);
                const uniqueUserIds = [
                    ...new Set(data.map(post => post.userId)),
                ].sort((a, b) => a - b);
                setUserIds(uniqueUserIds);
                setPosts(data.slice(-20).reverse());
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError('Failed to load posts.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllPosts();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!allPosts.length) return;
        const filtered = userId
            ? allPosts.filter(post => post.userId === Number(userId))
            : allPosts;
        setPosts(filtered.slice(-20).reverse());
    }, [userId, allPosts]);

    const handleAddPost = newPost => {
        const maxId = allPosts.reduce((max, post) => Math.max(max, post.id), 0);
        const finalPost = { ...newPost, id: maxId + 1 };

        setAllPosts(prev => [...prev, finalPost]);
        setPosts(prev => [finalPost, ...prev.slice(0, 19)]);

        setUserIds(prev => {
            const exists = prev.includes(finalPost.userId);
            return exists
                ? prev
                : [...prev, finalPost.userId].sort((a, b) => a - b);
        });
    };
    return (
        <div id="App">
            <h1>
                {userId
                    ? `Latest 20 posts of user ${userId}`
                    : 'Latest 20 posts'}
            </h1>

            <Filter userIds={userIds} setUserId={setUserId} />

            <button
                onClick={() => setIsModalOpen(true)}
                className="btn"
                style={{ alignSelf: 'flex-start' }}
            >
                Add Post
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && <PostList posts={posts} />}

            {isModalOpen && (
                <PostForm
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleAddPost}
                    apiUrl={API_URL}
                />
            )}
        </div>
    );
};

export default App;
