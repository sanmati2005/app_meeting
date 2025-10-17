import React, { useState, useRef, useEffect } from 'react';
import './Whiteboard.css';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);

  const tools = [
    { id: 'pen', name: 'Pen', icon: '✏️' },
    { id: 'eraser', name: 'Eraser', icon: '🧽' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜' },
    { id: 'circle', name: 'Circle', icon: '⭕' },
    { id: 'line', name: 'Line', icon: '📏' },
    { id: 'text', name: 'Text', icon: '🔤' }
  ];

  const colors = [
    '#ffffff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
    '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set initial drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    
    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = lineWidth * 3;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <h3>🎨 Collaborative Whiteboard</h3>
        <div className="whiteboard-actions">
          <button className="action-btn" onClick={clearCanvas}>🗑️ Clear</button>
          <button className="action-btn" onClick={saveCanvas}>💾 Save</button>
        </div>
      </div>

      <div className="whiteboard-toolbar">
        <div className="tools-section">
          <h4>Tools</h4>
          <div className="tools-grid">
            {tools.map(toolItem => (
              <button
                key={toolItem.id}
                className={`tool-btn ${tool === toolItem.id ? 'active' : ''}`}
                onClick={() => setTool(toolItem.id)}
                title={toolItem.name}
              >
                {toolItem.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="properties-section">
          <h4>Properties</h4>
          <div className="color-picker">
            {colors.map(colorOption => (
              <button
                key={colorOption}
                className={`color-btn ${color === colorOption ? 'selected' : ''}`}
                style={{ backgroundColor: colorOption }}
                onClick={() => setColor(colorOption)}
              />
            ))}
          </div>
          
          <div className="line-width-control">
            <label>Line Width: {lineWidth}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="width-slider"
            />
          </div>
        </div>
      </div>

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div className="whiteboard-footer">
        <div className="participants-indicator">
          <span>👥 5 participants editing</span>
        </div>
        <div className="collaboration-status">
          <span className="status-indicator online"></span>
          <span>Live collaboration</span>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;