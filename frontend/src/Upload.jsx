import React from 'react'
import { useState } from 'react'

function Upload() {
    const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image file

    const [processedImage, setProcessedImage] = useState(null); // State to store the processed image with detected faces
    const [loading, setLoading] = useState(false);

    function handleImageChange(event) {
        const file = event.target.files[0]; // Get the first selected file (if multiple files are allowed, you can handle them accordingly)
        setSelectedImage(file); // Store the selected image in state
    }

    async function handleDetectFaces() {
        if (!selectedImage) return;

        const formData = new FormData();
        formData.append("image", selectedImage);

        setLoading(true);

        const response = await fetch("http://localhost:9000/detect", {
            method: "POST",
            body: formData,
        });
        
        const data = await response.json();

        const imageUrl = `data:image/jpeg;base64,${data.image}`;

        setLoading(false);

        setProcessedImage(imageUrl);
    }


  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Face Detection</h1>

        <p className="subtitle">
          Upload an image and detect faces instantly
        </p>

        <label htmlFor="image-upload" className="upload-box">
          <span>Click to Upload Image</span>
        </label>

        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden-input"
          onChange={handleImageChange}
        />

        {selectedImage && (
          <div className="image-preview">
            <img className='Preview_of_uploaded' src={URL.createObjectURL(selectedImage)} alt="Selected" />
          </div>
        )}

        {loading && (
            <div className="loading-container">
            <div className="spinner"></div>
            <p>Processing image...</p>
            </div>
            )}

        {processedImage && (
          <div className="image-preview">
            <img className='Preview_of_uploaded' src={processedImage} alt="Proccessed" />
          </div>
        )}

        <button className="detect-btn" onClick={handleDetectFaces}>
          Detect Faces
        </button>
      </div>
    </div>
  );
}

export default Upload;