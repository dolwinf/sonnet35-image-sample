import React, { useState } from "react";
import styled from "styled-components";
import { FaCloudUploadAlt } from "react-icons/fa";

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  height: 200px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  margin: 20px auto;
`;

const Icon = styled(FaCloudUploadAlt)`
  font-size: 50px;
  color: #ccc;
  margin-bottom: 10px;
`;

const Input = styled.input`
  display: none;
`;

const Text = styled.p`
  color: #ccc;
  font-size: 16px;
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
`;

const SubmitButton = styled.button`
  display: block;
  padding: 10px 20px;
  margin: 20px auto;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const UploadImage = () => {
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setPreview(base64Data);        
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_base64: preview }),
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error("Error submitting image:", error);
      alert("Failed to submit the image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <UploadContainer onClick={() => document.getElementById("fileInput").click()}>
        {!preview && (
          <>
            <Icon />
            <Text>Click to upload an image</Text>
          </>
        )}
        <Input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </UploadContainer>

      {preview && (
        <PreviewContainer>
          <PreviewImage src={preview} alt="Uploaded Preview" />
        </PreviewContainer>
      )}

      <SubmitButton onClick={handleSubmit} disabled={!preview || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Image"}
      </SubmitButton>
    </div>
  );
};

export default UploadImage;
