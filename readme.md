# Image Upload and Description Generation with React, FastAPI, and Sonnet35

Sample setup for an image upload and preview to be sent to a **FastAPI backend** to receive the image process and send to it **Sonnet35** for generating meaningful and thorough descriptions of the uploaded images.

## Project Structure

- **Frontend (React)**: Allows users to upload and preview an image before sending it to the backend.
- **Backend (FastAPI)**: Receives the image, processes it, and connects with Sonnet35 to generate a description.
- **Sonnet35**: Model used to generate detailed descriptions based on the uploaded image content.