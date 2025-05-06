import './PostList.css';

const PostList = ({ posts }) => (
    <div className="post-grid">
        {posts.map(post => (
            <div key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <small>User ID: {post.userId}</small>
            </div>
        ))}
    </div>
);

export default PostList;
