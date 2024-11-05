// src/ImageUploadComponent.js
import React, { useState } from 'react';
import getHistoricalFigureInfo from './HistoricalFigureInfo';

function ImageUploadComponent() {
  const [imageFile, setImageFile] = useState(null);
  const [personInfo, setPersonInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Please upload an image file.");
      return;
    }
    try {
      const info = await getHistoricalFigureInfo(imageFile);
      setPersonInfo(info);
      setError(null);
    } catch (error) {
      setError("An error occurred while fetching the information.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Upload an Image to Find Historical Information</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Find Info</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {personInfo && (
        <div>
          <h3>Historical Information</h3>
          <p>{personInfo.description}</p>
          <a href={personInfo.url} target="_blank" rel="noopener noreferrer">
            Read more on Wikipedia
          </a>
        </div>
      )}
    </div>
  );
}

export default ImageUploadComponent;
