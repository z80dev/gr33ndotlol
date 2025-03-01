import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

const SAMPLE_GREENTEXT = `>be me
>software developer
>working on greentext app
>finally implement the save as PNG feature
>feels good man`;

const GreentextGenerator = () => {
  const [text, setText] = useState(SAMPLE_GREENTEXT);
  const [imagePreview, setImagePreview] = useState(null);
  const [anonymousName, setAnonymousName] = useState('Anonymous');
  const [postNumber, setPostNumber] = useState('12345678');
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  const greentextRef = useRef(null);

  // Handle text input changes
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open file browser when the "Upload Image" button is clicked
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Remove the uploaded image
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to process text into greentext format
  const processGreentextLines = (text) => {
    return text.split('\n').map((line, index) => {
      // If line starts with '>', color it green
      if (line.trim().startsWith('>')) {
        return (
          <p key={index} className="text-green-500">{line}</p>
        );
      }
      return <p key={index}>{line}</p>;
    });
  };

  // Generate a random post number
  const generateRandomPostNumber = () => {
    const randomNum = Math.floor(Math.random() * 900000000) + 100000000;
    setPostNumber(randomNum.toString());
  };

  // Update current date and time
  const updateDateTime = () => {
    setDateTime(new Date().toLocaleString());
  };

  // Save as PNG image
  const saveAsPng = () => {
    if (!greentextRef.current) return;
    
    setIsSaving(true);
    
    // Generate a filename based on the first line of text or default
    const firstLine = text.split('\n')[0] || 'greentext';
    const filename = `${firstLine.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.png`;
    
    toPng(greentextRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
        setIsSaving(false);
      })
      .catch((err) => {
        console.error('Error saving image:', err);
        alert('Error saving image. Please try again.');
        setIsSaving(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Greentext Story Generator</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Create Your Greentext</h2>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Anonymous Name:</label>
            <input
              type="text"
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Post Number:</label>
            <div className="flex">
              <input
                type="text"
                value={postNumber}
                onChange={(e) => setPostNumber(e.target.value)}
                className="w-full p-2 border rounded mr-2"
              />
              <button
                onClick={generateRandomPostNumber}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
              >
                Random
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Date & Time:</label>
            <div className="flex">
              <input
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full p-2 border rounded mr-2"
              />
              <button
                onClick={updateDateTime}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
              >
                Now
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Greentext Story:</label>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your greentext here. Start lines with > for green text."
              className="w-full p-2 border rounded h-40"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Upload Image (optional):</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleUploadClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Upload Image
              </button>
              {imagePreview && (
                <button
                  onClick={handleRemoveImage}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Remove Image
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Image preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div 
            ref={greentextRef} 
            className="bg-gray-100 p-4 rounded shadow mb-4"
          >
            <div className="bg-gray-200 p-2 rounded mb-2 flex justify-between">
              <span className="font-medium">{anonymousName}</span>
              <span className="text-gray-600 text-sm">{dateTime} No.{postNumber}</span>
            </div>
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Post"
                  className="max-w-full max-h-96 border"
                />
              </div>
            )}
            <div className="font-mono text-sm whitespace-pre-wrap">
              {processGreentextLines(text)}
            </div>
          </div>

          <button
            onClick={saveAsPng}
            disabled={isSaving}
            className={`${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded w-full flex justify-center items-center`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save as PNG'
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">How to Use</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Enter text in the text area. Lines that start with "&gt;" will be green.</li>
          <li>Customize the anonymous name, post number, and date if desired.</li>
          <li>Optionally upload an image to include with your post.</li>
          <li>The preview will update in real-time as you type.</li>
          <li>Click "Save as PNG" to download your creation as a PNG image.</li>
        </ul>
      </div>
    </div>
  );
};

export default GreentextGenerator;