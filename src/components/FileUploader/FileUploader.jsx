import React, { useState } from 'react';

const FileUploader = ({ onFilesUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    setIsUploading(true);
    const files = event.target.files;
    onFilesUploaded(files); 
    setIsUploading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple directory="" webkitdirectory="" style={{ display: 'none' }} id="file-uploader" />
      <label htmlFor="file-uploader" className="file-uploader-label">Выберите папку</label>
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUploader;
