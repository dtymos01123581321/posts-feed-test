import React, { useState, useEffect } from 'react';
import './styles.css';
import { Statuses, ApiUrls } from './constants';
import { IPost, IComment } from "./types";

const App = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [status, setStatus] = useState(Statuses.LOADING);

  useEffect(() => {
    fetch(ApiUrls.POSTS)
        .then(response => response.json())
        .then(data => {
          setPosts(data);
          setStatus(Statuses.LOADED);
        })
        .catch(() => setStatus(Statuses.ERROR));
  }, []);

  if (status === Statuses.LOADING) {
    return <div>Loading...</div>;
  }

  if (status === Statuses.ERROR) {
    return <div>Error loading posts.</div>;
  }
    console.log('posts  --: ', posts);
  return (
      <div className="app">
        {posts.map(post => (
            <PostItem key={post.id} post={post} />
        ))}
      </div>
  );
}

const PostItem: React.FC<{ post: IPost }> = ({ post }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsStatus, setCommentsStatus] = useState(Statuses.LOADING);
  const [showComments, setShowComments] = useState(false);

  const fetchComments = () => {
    fetch(`${ApiUrls.POSTS}/${post.id}/comments`)
        .then(response => response.json())
        .then(data => {
          setShowComments(true)
          setComments(data);
          setCommentsStatus(Statuses.LOADED);
        })
        .catch(() => setCommentsStatus(Statuses.ERROR));
  };

  return (
      <div className="post">
        <img src={ApiUrls.FAKE_IMG} alt="Post banner" />
        <div className="post-content">
          <h2>{post.title}</h2>
          <p className="post-description">{post.body}</p>
          <p className="user-id">Posted by user: {post.userId}</p>
          {showComments ? <h3>Comments</h3> : <button onClick={fetchComments}>Show comments</button>}
          {showComments && commentsStatus === Statuses.LOADING && <div>Loading comments...</div>}
          {showComments && commentsStatus === Statuses.ERROR && <div>Error loading comments.</div>}
          {showComments && commentsStatus === Statuses.LOADED && (
              <ul className="comment-list" onClick={() => setShowComments(false)}>
                  {comments.map(comment => (
                      <li key={comment.id} className="comment-item">
                          {comment.body}
                      </li>
                  ))}
              </ul>
          )}
        </div>
      </div>
  );
}

export default App;
