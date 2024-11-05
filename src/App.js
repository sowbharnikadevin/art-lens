// App.js
import React, { useState, useRef } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Tesseract from 'tesseract.js';
import '@tensorflow/tfjs';
import './App.css'; // Import the CSS

const App = () => {
  const [image, setImage] = useState(null);
  const [objects, setObjects] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const detectObjects = async () => {
    const model = await cocoSsd.load();
    const predictions = await model.detect(imageRef.current);

    setObjects(predictions);
    drawBoundingBoxes(predictions);
  };

  const drawBoundingBoxes = (predictions) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.font = '18px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText(prediction.class, x, y - 10);
    });
  };

  const extractText = async () => {
    const { data: { text } } = await Tesseract.recognize(image, 'eng');
    setExtractedText(text);
  };

  return (
    <div className="container">
      <h1>Art Lens</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <div className="upload-container">
        {image && (
          <>
            <img
              ref={imageRef}
              src={image}
              alt="Uploaded"
              onLoad={detectObjects}
            />
            <canvas
              ref={canvasRef}
              width={imageRef.current?.width || 0}
              height={imageRef.current?.height || 0}
            />
          </>
        )}
      </div>

      <button onClick={extractText}>Extract Art</button>

      {extractedText && (
        <div>
          <h3>Extracted:</h3>
          <p>{extractedText}</p>
        </div>
      )}

      {objects.length > 0 && (
        <ul>
          {objects.map((object, index) => (
            <li key={index}>
              {object.class} - {Math.round(object.score * 100)}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
