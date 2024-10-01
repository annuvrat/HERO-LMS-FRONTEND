import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
import { BsFileEarmarkPlus } from 'react-icons/bs';

const BulkUploadButton = () => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/bulk-upload-leave', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred while uploading.');
      setSuccessMessage('');
    }
  };

  return (
    
    <div className="flex flex-col items-center mt-2 p-6 bg-white bg-opacity-30 backdrop-blur-md rounded-lg shadow-lg">
      <p className="text-lg font-bold font-semibold mb-2 text-center">
        BULK UPLOAD
      </p>
      <hr className="border-t-2 border-gray-120 w-full mb-4" />
      <label
        htmlFor="file-upload"
        className="flex items-center justify-center cursor-pointer py-2 px-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 text-lg"
      >
        <BsFileEarmarkPlus className="mr-2 text-2xl" />
        Choose File
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={handleUpload}
        className="flex items-center justify-center mt-4 py-2 px-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1 text-lg"
      >
        <FaUpload className="mr-2" />
        Upload Leaves
      </button>
      {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
    </div>
  );
};

export default BulkUploadButton;
