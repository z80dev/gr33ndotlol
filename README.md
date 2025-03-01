# Greentext Story Generator

A modern React app for creating 4chan-style greentext stories with image export functionality.

![Greentext Generator](https://i.imgur.com/placeholder.png)

## Features

- Create greentext stories with classic 4chan styling
- Lines that start with ">" are automatically displayed in green
- Customize the anonymous name, post number, and timestamp
- Upload and include images in your greentext posts
- Export your creation as a PNG image
- Responsive design that works on mobile and desktop

## Technologies Used

- React
- Tailwind CSS
- HTML-to-Image (for PNG export)
- Webpack
- Babel

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/greentext-app.git
   cd greentext-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```
npm run build
```

This will generate optimized files in the `dist` directory.

## Usage

1. Enter your greentext story in the text area. Lines that start with ">" will appear green.
2. Customize the anonymous name, post number, and date if desired.
3. Optionally upload an image to include with your post.
4. The preview will update in real-time as you type.
5. Click "Save as PNG" to download your creation as a PNG image.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the classic 4chan greentext format
- Built with React and modern web technologies