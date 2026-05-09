# Movie Nova 🌌

A fully responsive, cyber-themed Movie Review and Blogging platform built with HTML, Tailwind CSS, and Vanilla JavaScript. Movie Nova allows users to explore movies using the OMDB API, write reviews, publish blog posts ("Stellar Logs"), and manage their profiles. Data is persistently stored using the browser's Local Storage.

## ✨ Features
- **Movie Exploration**: Search for movies and series with real-time results powered by the OMDB API.
- **Review System**: View detailed movie information and leave star ratings and text reviews.
- **Stellar Logs (Blog)**: Write and publish blog posts with titles, content, and media.
- **Commander Profile**: An OTP-simulated secure profile section to update callsigns (usernames) and avatars.
- **Admin Command Center**: A classified, password-protected area to view overall stats, new reviews, and blogs.
- **Cyberpunk UI**: A dynamic, glass-morphism aesthetic with engaging animations, futuristic layout, and responsive design.

## 🛠️ Technologies Used
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS (via CDN).
- **Icons**: FontAwesome 6.
- **Fonts**: Google Fonts (Inter & Outfit).
- **Data Source**: [OMDB API](https://www.omdbapi.com/) for fetching movie details.
- **Storage**: HTML5 `localStorage` for saving reviews, blogs, and user profiles without needing a backend server.

## 🚀 How to Run Locally
Because this project relies entirely on client-side technologies and Local Storage, running it is incredibly simple:

1. Clone the repository:
   ```bash
   git clone https://github.com/MohitSharma2312004/movie-review-website.git
   ```
2. Navigate to the project directory:
   ```bash
   cd movie-review-website
   ```
3. Open the `index.html` file in any modern web browser (Google Chrome, Firefox, Safari).
   *(Alternatively, use a local development server like Live Server for VS Code).*

## 🔒 Admin Panel Access
To access the Admin Command Center:
- Click on the shield icon in the top right navigation bar.
- Use the admin access key to authenticate (by default defined in your JS logic).

## 🗂️ Project Structure
- `index.html` - The main layout and UI structure.
- `css/style.css` - Custom styles, animations, and the starry background setup.
- `js/` - Logic split into modules:
  - `config.js` - Global constants and OMDB API key.
  - `utils.js` - Helper functions and UI components (like toast notifications).
  - `state.js` - Global state management for data.
  - `reviews.js`, `blog.js`, `profile.js`, `admin.js` - Tab-specific functionalities.
  - `main.js` - Core initialization and routing.

## 📝 License
This project is licensed under the MIT License.
