import { useState } from 'react';
import './PostForm.css';

const MAX_BODY_LENGTH = 500;

const PostForm = ({ onClose, apiUrl, allPosts, setAllPosts, setUserIds }) => {
    const [userId, setUserId] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const successHandler = newPost => {
        const maxId = allPosts.length;
        const finalPost = { ...newPost, id: maxId + 1 };

        setAllPosts(prev => [...prev, finalPost]);
        setUserIds(prev => {
            const exists = prev.includes(finalPost.userId);
            return exists
                ? prev
                : [...prev, finalPost.userId].sort((a, b) => a - b);
        });
    };

    const handleFormSubmit = async e => {
        e.preventDefault();
        if (body.length > MAX_BODY_LENGTH) return;

        setSubmitting(true);
        setError(null);

        const newPostData = {
            userId: Number(userId),
            title,
            body,
        };

        try {
            const res = await fetch(`${apiUrl}/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPostData),
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);
            const result = await res.json();

            successHandler(result);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to submit post.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBodyChange = e => {
        if (e.target.value.length <= MAX_BODY_LENGTH) {
            setBody(e.target.value);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add New Post</h2>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="number"
                        value={userId}
                        onChange={e => setUserId(e.target.value)}
                        placeholder="User ID"
                        required
                    />
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Title"
                        required
                    />
                    <textarea
                        value={body}
                        onChange={handleBodyChange}
                        placeholder="Body (max 500 characters)"
                        rows={5}
                        required
                    ></textarea>
                    <div className="char-counter">
                        {body.length} / {MAX_BODY_LENGTH}
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="modal-buttons">
                        <button
                            type="submit"
                            disabled={
                                submitting || body.length > MAX_BODY_LENGTH
                            }
                            className="btn"
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button type="button" onClick={onClose} className="btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostForm;
