import React from 'react'
import { useState } from 'react'

function Upload() {
    const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image file

    function handleImageChange(event) {
        const file = event.target.files[0]; // Get the first selected file (if multiple files are allowed, you can handle them accordingly)
        setSelectedImage(file); // Store the selected image in state
        console.log(selectedImage); // Log the selected image file to the console for debugging purposes
    }

    async function handleDetectFaces() {
        if (!selectedImage) {
            console.error("No image selected for face detection.");
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await fetch('http://localhost:9000/detect_faces', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data); // Log the response data for debugging purposes
        } catch (error) {
        console.error("Error during face detection:", error);
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

        <button className="detect-btn" onClick={handleDetectFaces}>
          Detect Faces
        </button>
      </div>
    </div>
  );
}


export default Upload;