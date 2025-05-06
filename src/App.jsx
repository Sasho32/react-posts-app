import React, { useEffect, useState } from 'react';
import PostList from './components/PostList';
import Filter from './components/Filter';
import PostForm from './components/PostForm';
import useFetch from './hooks/useFetch';

const API_URL = 'https://jsonplaceholder.typicode.com';

const App = () => {
    const [userId, setUserId] = useState(null);
    const [userIds, setUserIds] = useState([]);
    const {
        data: allPosts,
        setData: setAllPosts,
        loading,
        error,
    } = useFetch(API_URL + '/posts');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filtered = userId
        ? allPosts.filter(post => post.userId === Number(userId))
        : allPosts;

    const derivedDisplayPosts = filtered.slice(-20).reverse();

    useEffect(() => {
        const uniqueUserIds = [
            ...new Set(allPosts.map(post => post.userId)),
        ].sort((a, b) => a - b);
        setUserIds(uniqueUserIds);
    }, [allPosts]);

    return (
        <div id="App" className={isModalOpen ? 'modal-opened' : ''}>
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
            {!loading && !error && <PostList posts={derivedDisplayPosts} />}
            {isModalOpen && (
                <PostForm
                    onClose={() => setIsModalOpen(false)}
                    apiUrl={API_URL}
                    allPosts={allPosts}
                    setAllPosts={setAllPosts}
                    setUserIds={setUserIds}
                />
            )}
        </div>
    );
};

export default App;
