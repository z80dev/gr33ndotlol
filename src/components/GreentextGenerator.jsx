import React, { useState, useRef, useContext } from 'react';
import { toPng } from 'html-to-image';
import { ThemeContext } from '../contexts/ThemeContext';

const SAMPLE_GREENTEXT = `>be me
>software developer
>working on greentext app
>finally implement the save as PNG feature
>implement dark mode too
>add multiple board color themes
>feels good man`;

// Board theme color schemes
const BOARD_THEMES = {
  classic: {
    name: "Classic",
    postBg: "bg-amber-100", // Light yellow background, no dark mode variant
    headerBg: "bg-red-200", // Reddish-peach header for /b/ style
    borderColor: "border-amber-200",
    textColor: "text-gray-900",
    secondaryText: "text-gray-600",
    // Green text color stays default
  },
  yotsuba: { 
    name: "Yotsuba",
    postBg: "bg-amber-50",
    headerBg: "bg-amber-100",
    borderColor: "border-amber-200",
    textColor: "text-gray-900",
    secondaryText: "text-gray-600",
    // Green text color stays default
  },
  tomorrow: {
    name: "Tomorrow",
    postBg: "bg-blue-200", // Blue background for /biz/ style
    headerBg: "bg-blue-300", // Lighter blue header
    borderColor: "border-blue-400", 
    textColor: "text-gray-900", // Darker text for better readability on light blue
    secondaryText: "text-gray-700", // Darker secondary text
    greenTextColor: "text-emerald-600" // Darker green for better readability on blue
  },
  yotsubaPink: {
    name: "Yotsuba Pink",
    postBg: "bg-pink-50",
    headerBg: "bg-pink-100",
    borderColor: "border-pink-200",
    textColor: "text-gray-900",
    secondaryText: "text-gray-600",
    // Green text color stays default
  }
};

const GreentextGenerator = () => {
  const [text, setText] = useState(SAMPLE_GREENTEXT);
  const [imagePreview, setImagePreview] = useState(null);
  const [anonymousName, setAnonymousName] = useState('Anonymous');
  const [postNumber, setPostNumber] = useState('12345678');
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [isSaving, setIsSaving] = useState(false);
  const [boardTheme, setBoardTheme] = useState("classic");
  
  const { darkMode } = useContext(ThemeContext);
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
        // Use custom green color for Tomorrow theme, default for others
        const greenColorClass = BOARD_THEMES[boardTheme].greenTextColor || "text-green-500";
        return (
          <p key={index} className={greenColorClass}>{line}</p>
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

  // Helper to get the background color based on the theme
  const getThemeBgColor = () => {
    // Map of Tailwind classes to actual color values
    const bgColorMap = {
      // Classic theme
      'bg-amber-100': '#fef3c7', 
      // Yotsuba theme
      'bg-amber-50': '#fffbeb',
      // Tomorrow theme (blue for /biz/)
      'bg-blue-200': '#bfdbfe',
      // Yotsuba Pink theme
      'bg-pink-50': '#fdf2f8'
    };
    
    // Get the theme's background class - no need to check for dark mode variants
    const bgClass = BOARD_THEMES[boardTheme].postBg;
    
    // Return the corresponding color value or a fallback
    return bgColorMap[bgClass] || '#f3f4f6';
  };

  // Save as PNG image
  const saveAsPng = () => {
    if (!greentextRef.current) return;
    
    setIsSaving(true);
    
    // Generate a filename based on the first line of text or default
    const firstLine = text.split('\n')[0] || 'greentext';
    const filename = `${firstLine.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${boardTheme}_${Date.now()}.png`;
    
    // Get the background color based on current theme
    const bgColor = getThemeBgColor();
    
    toPng(greentextRef.current, { 
      cacheBust: true,
      style: {
        backgroundColor: bgColor
      }
    })
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
    <div className="max-w-4xl mx-auto p-4 pt-16 transition-colors duration-200 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Greentext Story Generator</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow transition-colors duration-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create Your Greentext</h2>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Anonymous Name:</label>
            <input
              type="text"
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Post Number:</label>
            <div className="flex">
              <input
                type="text"
                value={postNumber}
                onChange={(e) => setPostNumber(e.target.value)}
                className="w-full p-2 border rounded mr-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
              />
              <button
                onClick={generateRandomPostNumber}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-200"
              >
                Random
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Date & Time:</label>
            <div className="flex">
              <input
                type="text"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full p-2 border rounded mr-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
              />
              <button
                onClick={updateDateTime}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-200"
              >
                Now
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Greentext Story:</label>
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your greentext here. Start lines with > for green text."
              className="w-full p-2 border rounded h-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-200"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Board Theme:</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(BOARD_THEMES).map((themeKey) => (
                <button
                  key={themeKey}
                  onClick={() => setBoardTheme(themeKey)}
                  className={`p-2 rounded border transition-all ${
                    themeKey === boardTheme 
                      ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-300 dark:ring-blue-700' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                  } ${BOARD_THEMES[themeKey].postBg}`}
                >
                  <div className={`text-xs font-semibold mb-1 ${BOARD_THEMES[themeKey].textColor}`}>
                    {BOARD_THEMES[themeKey].name}
                  </div>
                  <div className={`h-4 w-full rounded ${BOARD_THEMES[themeKey].headerBg}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800 dark:text-gray-200">Upload Image (optional):</label>
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
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                Upload Image
              </button>
              {imagePreview && (
                <button
                  onClick={handleRemoveImage}
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded transition-colors duration-200"
                >
                  Remove Image
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Image preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 border border-gray-300 dark:border-gray-700"
                />
              </div>
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Preview</h2>
          <div 
            ref={greentextRef} 
            className={`${BOARD_THEMES[boardTheme].postBg} p-4 rounded shadow mb-4 transition-colors duration-200`}
          >
            <div className={`${BOARD_THEMES[boardTheme].headerBg} p-2 rounded mb-2 flex justify-between transition-colors duration-200`}>
              <span className={`font-medium ${BOARD_THEMES[boardTheme].textColor}`}>{anonymousName}</span>
              <span className={`${BOARD_THEMES[boardTheme].secondaryText} text-sm`}>{dateTime} No.{postNumber}</span>
            </div>
            {imagePreview && (
              <div className="mb-2">
                <img
                  src={imagePreview}
                  alt="Post"
                  className={`max-w-full max-h-96 border ${BOARD_THEMES[boardTheme].borderColor}`}
                />
              </div>
            )}
            <div className={`font-mono text-sm whitespace-pre-wrap ${BOARD_THEMES[boardTheme].textColor}`}>
              {processGreentextLines(text)}
            </div>
          </div>

          <button
            onClick={saveAsPng}
            disabled={isSaving}
            className={`${
              isSaving 
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
            } text-white px-4 py-2 rounded w-full flex justify-center items-center transition-colors duration-200`}
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

      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">How to Use</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
          <li>Enter text in the text area. Lines that start with "&gt;" will be green.</li>
          <li>Customize the anonymous name, post number, and date if desired.</li>
          <li>Choose from different board themes to style your post (Classic /b/, Yotsuba, Tomorrow /biz/, or Yotsuba Pink).</li>
          <li>Optionally upload an image to include with your post.</li>
          <li>The preview will update in real-time as you type.</li>
          <li>Click "Save as PNG" to download your creation as a PNG image.</li>
          <li>Toggle between light and dark mode using the button in the top-right corner (affects UI only).</li>
        </ul>
      </div>
    </div>
  );
};

export default GreentextGenerator;
