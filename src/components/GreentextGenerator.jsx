import React, { useState, useRef, useContext, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
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
  serious: {
    name: "Serious",
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
  const [isIOS, setIsIOS] = useState(false);
  
  const { darkMode } = useContext(ThemeContext);
  const fileInputRef = useRef(null);
  const greentextRef = useRef(null);
  
  // Detect iOS device
  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
    
    // Clean up any preview elements when component unmounts
    return () => {
      const elements = [
        document.getElementById('greentext-preview-img'),
        document.getElementById('greentext-preview-instruction'),
        document.getElementById('greentext-preview-close')
      ];
      
      for (const element of elements) {
        if (element) {
          if (element.tagName === 'IMG' && element.src) {
            URL.revokeObjectURL(element.src);
          }
          element.remove();
        }
      }
    };
  }, []);

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
        // Use custom green color for Serious theme, default for others
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
      // Serious theme (blue for /biz/)
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
    
    // Special handling for iOS
    if (isIOS) {
      // Clean up any existing image previews first to prevent duplicates
      const cleanupExistingPreviews = () => {
        // Remove any existing preview elements by their IDs
        const existingElements = [
          document.getElementById('greentext-preview-img'),
          document.getElementById('greentext-preview-instruction'),
          document.getElementById('greentext-preview-close')
        ];
        
        for (const element of existingElements) {
          if (element) {
            // If there's an image, revoke its object URL to prevent memory leaks
            if (element.tagName === 'IMG' && element.src) {
              URL.revokeObjectURL(element.src);
            }
            element.remove();
          }
        }
      };
      
      // First clean up any existing previews
      cleanupExistingPreviews();
      
      // For iOS we need a different approach that's more photo-library friendly
      toBlob(greentextRef.current, {
        cacheBust: true,
        style: {
          backgroundColor: bgColor
        },
        // Set this explicitly to fix iOS rendering issues with the uploaded image
        pixelRatio: window.devicePixelRatio || 1
      })
      .then((blob) => {
        // Create an img element to show the image that can be saved to library
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.id = 'greentext-preview-img';
        
        // Style to make it fill the screen
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.zIndex = '9999';
        img.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        
        // Add click handler to remove when clicked
        img.onclick = () => cleanupExistingPreviews();
        
        // Add instruction overlay
        const instruction = document.createElement('div');
        instruction.id = 'greentext-preview-instruction';
        instruction.textContent = 'Press and hold to save image to your photo library';
        instruction.style.position = 'fixed';
        instruction.style.bottom = '60px';
        instruction.style.left = '0';
        instruction.style.right = '0';
        instruction.style.textAlign = 'center';
        instruction.style.color = 'white';
        instruction.style.padding = '10px';
        instruction.style.zIndex = '10000';
        instruction.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        
        // Add a close button
        const closeBtn = document.createElement('button');
        closeBtn.id = 'greentext-preview-close';
        closeBtn.textContent = 'Close';
        closeBtn.style.position = 'fixed';
        closeBtn.style.bottom = '20px';
        closeBtn.style.left = '50%';
        closeBtn.style.transform = 'translateX(-50%)';
        closeBtn.style.padding = '8px 20px';
        closeBtn.style.backgroundColor = '#4CAF50';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.zIndex = '10000';
        closeBtn.onclick = () => cleanupExistingPreviews();
        
        // Append to document
        document.body.appendChild(img);
        document.body.appendChild(instruction);
        document.body.appendChild(closeBtn);
        
        // Add event listener to handle escape key
        const handleEscape = (e) => {
          if (e.key === 'Escape') {
            cleanupExistingPreviews();
            document.removeEventListener('keydown', handleEscape);
          }
        };
        document.addEventListener('keydown', handleEscape);
        
        setIsSaving(false);
      })
      .catch((err) => {
        console.error('Error saving image:', err);
        alert('Error saving image. Please try again.');
        setIsSaving(false);
      });
    } else {
      // Regular download for non-iOS devices
      toPng(greentextRef.current, { 
        cacheBust: true,
        style: {
          backgroundColor: bgColor
        },
        pixelRatio: window.devicePixelRatio || 1
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
    }
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
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                {isIOS ? 'Save to Photo Library' : 'Save as PNG'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">How to Use</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200">
          <li>Enter text in the text area. Lines that start with "&gt;" will be green.</li>
          <li>Customize the anonymous name, post number, and date if desired.</li>
          <li>Choose from different board themes to style your post (Classic, Yotsuba, Serious, or Yotsuba Pink).</li>
          <li>Optionally upload an image to include with your post.</li>
          <li>The preview will update in real-time as you type.</li>
          <li>Click "Save to Photo Library" (iOS) or "Save as PNG" (other platforms) to save your creation.</li>
          <li>Toggle between light and dark mode using the button in the top-right corner (affects UI only).</li>
        </ul>
      </div>
    </div>
  );
};

export default GreentextGenerator;
