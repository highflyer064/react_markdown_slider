import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import './SlideViewer.css';

function SlideViewer() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(null);
  const [direction, setDirection] = useState('');
  const [renderKey, setRenderKey] = useState(0); // key to force re-render
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/slides')
      .then(response => setSlides(response.data))
      .catch(error => console.error(error));
  }, []);

  // Auto slide every 6 seconds
  // useEffect(() => {
  //   if (slides.length === 0) return;

  //   const interval = setInterval(() => {
  //     setDirection('right');
  //     setCurrentIndex((prev) => (prev + 1) % slides.length);
  //     setRenderKey(prev => prev + 1);
  //   }, 6000);

  //   return () => clearInterval(interval);
  // }, [slides]);

  const nextSlide = () => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setRenderKey(prev => prev + 1);
  };

  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000); // Every 5 seconds
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [autoPlay, nextSlide]);

  const prevSlide = () => {
    setDirection('left');
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    setRenderKey(prev => prev + 1);
  };

  // Hotkey Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
      else if (e.key === ' ') {
        e.preventDefault(); // prevent page scroll
        setAutoPlay(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const editSlide = () => {
    navigate(`/edit/${slides[currentIndex].id}`);
  };

  const addSlide = () => {
    navigate('/new');
  };

  if (slides.length === 0) return <div className="slide-loading">Loading...</div>;

  const slide = slides[currentIndex];

  const progressPercent = ((currentIndex + 1) / slides.length) * 100;

  return (
    <div className="viewer-container">
      <button className="add-slide-btn" onClick={addSlide}>+ New</button>
      <div className="slide-counter">
        {currentIndex + 1} / {slides.length}
      </div>
      <div key={renderKey} className={`slide-glass slide-anim-${direction}`}>
        <h2 className="slide-title">{slide.title}</h2>
        <div className="slide-markdown">
          <ReactMarkdown>{slide.content}</ReactMarkdown>
        </div>

        <button className="edit-btn" onClick={editSlide}>Edit</button>
        <button className="nav-btn left" onClick={prevSlide}>⟵</button>
        <button className="nav-btn right" onClick={nextSlide}>⟶</button>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <div className="autoplay-indicator">
        {autoPlay ? '▶ Auto Play ON (press Space to stop)' : '⏸ Auto Play OFF (press Space to start)'}
      </div>
    </div>
  );
}

export default SlideViewer;
