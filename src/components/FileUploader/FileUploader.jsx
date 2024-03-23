import React, { useState } from 'react';
import './FileUploader.css'; 
import folderIcon from '../../assets/img-folder.webp'; 

const FileUploader = ({ onFilesUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    setIsUploading(true);
    const files = event.target.files;
    onFilesUploaded(files);
    setIsUploading(false);
  };

  return (
    <div className="file-uploader-container">
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        directory=""
        webkitdirectory=""
        id="file-uploader"
        className="file-uploader-input"
      />
      <label htmlFor="file-uploader" className="file-uploader-label">
        <img src={folderIcon} alt="Upload" /> 
      </label>
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUploader;
