from flask import Flask, jsonify, request
import numpy as np
import cv2
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enabling CORS for the Flask app to allow cross-origin requests from the frontend

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

@app.route("/detect", methods=["POST"])
def GettingImage():

    # Raw image -> Bytes -> Numpy array -> OpenCV image

    if "image" not in request.files: # Checking if the key "image" is present in the uploaded files
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files["image"] # Accessing the uploaded file using the key "image"

    Bytes_image = file.read() # Reading the file as bytes

    np_image = np.frombuffer(Bytes_image, np.uint8) # Converting bytes to a numpy array
    cv_image = cv2.imdecode(np_image, cv2.IMREAD_COLOR) # Decoding the numpy array to an OpenCV image

    # Later opencv after detection will return (x, y, width, height)
    # which would be used to draw the rectangle on the image

    Height, Width, Channels = cv_image.shape # Getting the dimensions of the image (height, width, channels)

    gray_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5)

    for face in faces:
        x, y, w, h = face
        cv2.rectangle(cv_image, (x, y), (x + w, y + h), (255, 0, 0), 2) # Drawing a rectangle around the detected face
    
    # cv2.imwrite('DetectedImages/output.png', cv_image) For checking if the image is being processed correctly DEBUGGING PURPOSES

    success, encoded_image = cv2.imencode('.jpg', cv_image)

    # Convert the buffer to raw bytes
    if success:
        jpg_bytes = encoded_image.tobytes()
    else:
        return jsonify({"error": "Failed to encode image"}), 500

    return jsonify({
        "faces": len(faces) if len(faces) > 0 else "No faces detected",
        "image": base64.b64encode(jpg_bytes).decode('utf-8') # Encoding the image bytes to base64 and decoding it to a UTF-8 string for JSON response
        })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=9000)
