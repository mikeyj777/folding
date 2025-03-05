import React, { useState, useEffect, useRef } from 'react';
import { Slider, Button } from './ui/ui';
import { Chain } from '../classes/AminoAcid';

// Custom 3D Viewer Component
const Viewer3D = ({ chain }) => {
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState({
    x: 0,
    y: 0,
    z: -150,
    rotationX: 0,
    rotationY: 0,
    zoom: 1
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [coordinates, setCoordinates] = useState([]);

  // Initial rendering and when chain changes
  useEffect(() => {
    if (chain) {
      setCoordinates(chain.calculateCoordinates());
    }
  }, [chain]);

  // Handle canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || coordinates.length === 0) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Simple 3D projection
    const project = (point) => {
      // Apply camera transformations
      const rotatedX = 
        point.x * Math.cos(camera.rotationY) - 
        point.z * Math.sin(camera.rotationY);
      const rotatedZ = 
        point.x * Math.sin(camera.rotationY) + 
        point.z * Math.cos(camera.rotationY);
      const rotatedY = 
        point.y * Math.cos(camera.rotationX) + 
        rotatedZ * Math.sin(camera.rotationX);
      const finalZ = 
        -point.y * Math.sin(camera.rotationX) + 
        rotatedZ * Math.cos(camera.rotationX);
      
      // Apply projection
      const scale = camera.zoom * 400 / (finalZ - camera.z);
      return {
        x: centerX + rotatedX * scale + camera.x,
        y: centerY + rotatedY * scale + camera.y,
        z: finalZ,
        scale // Store scale for rendering
      };
    };
    
    // Project all points
    const projectedPoints = coordinates.map(project);
    
    // Draw connections between points
    ctx.lineWidth = 2;
    
    for (let i = 0; i < projectedPoints.length - 1; i++) {
      const p1 = projectedPoints[i];
      const p2 = projectedPoints[i + 1];
      
      // Get the color from the amino acid if available
      const aminoAcid = i < chain.chain.length ? chain.chain[i] : null;
      ctx.strokeStyle = aminoAcid && aminoAcid.color ? aminoAcid.color : '#4a90e2';
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    
    // Draw amino acid points
    for (let i = 0; i < projectedPoints.length; i++) {
      const p = projectedPoints[i];
      const radius = Math.max(1, 5 * p.scale / 100);
      
      // Starting point is special (red)
      if (i === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e74c3c';
        ctx.fill();
        continue;
      }
      
      // Get the color from the amino acid if available
      const aminoAcid = i - 1 < chain.chain.length ? chain.chain[i - 1] : null;
      ctx.fillStyle = aminoAcid && aminoAcid.color ? aminoAcid.color : '#3498db';
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [coordinates, camera]);

  // Mouse event handlers for smooth pan and zoom
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    if (e.shiftKey) {
      // Rotate view when shift is pressed
      setCamera(prev => ({
        ...prev,
        rotationY: prev.rotationY + deltaX * 0.01,
        rotationX: prev.rotationX + deltaY * 0.01
      }));
    } else {
      // Pan view
      setCamera(prev => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }
    
    setLastPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    
    setCamera(prev => ({
      ...prev,
      zoom: prev.zoom * zoomFactor
    }));
  };

  return (
    <canvas 
      ref={canvasRef}
      width={600}
      height={500}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    />
  );
};

// Main AminoAcidViewer component
const AminoAcidViewer = () => {
  const [aminoAcidCount, setAminoAcidCount] = useState(20);
  const [chain, setChain] = useState(null);
  const [angleIncrements, setAngleIncrements] = useState(20);

  // Initialize chain
  useEffect(() => {
    generateNewChain();
  }, []);

  const generateNewChain = () => {
    setChain(new Chain(aminoAcidCount, angleIncrements));
  };

  return (
    <div className="amino-acid-viewer">
      <div className="viewer-container">
        <div className="viewer-panel">
          {chain && <Viewer3D chain={chain} />}
          <div className="viewer-instructions">
            <p>Drag: Pan view | Shift+Drag: Rotate | Scroll: Zoom</p>
          </div>
        </div>
        
        <div className="control-panel">
          <h2>Amino Acid Chain Controls</h2>
          
          <Slider 
            label="Amino Acid Count"
            value={aminoAcidCount}
            min={1}
            max={1000}
            onChange={setAminoAcidCount}
          />
          
          <Slider 
            label="Angle Increments"
            value={angleIncrements}
            min={4}
            max={300}
            onChange={setAngleIncrements}
          />
          
          <Button onClick={generateNewChain}>
            Generate New Chain
          </Button>
        </div>
      </div>

    </div>
  );
};

export default AminoAcidViewer;