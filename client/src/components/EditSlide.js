import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import './EditSlide.css';

function EditSlide() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/slides/${id}`)
        .then(response => {
          setTitle(response.data.title);
          setContent(response.data.content);
        })
        .catch(error => console.error(error));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const slideData = { title, content };

    if (id) {
      axios.put(`http://localhost:5000/api/slides/${id}`, slideData)
        .then(() => navigate('/'))
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:5000/api/slides', slideData)
        .then(() => navigate('/'))
        .catch(error => console.error(error));
    }
  };

  return (
    <div className="edit-slide-container">
      <h2 className="form-heading">{id ? 'Edit Slide' : 'Add New Slide'}</h2>
      <form onSubmit={handleSubmit} className="slide-form">
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            className="form-input"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Content (Markdown):</label>
          <MDEditor value={content} onChange={setContent} height={400} />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {id ? 'Update' : 'Create'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditSlide;