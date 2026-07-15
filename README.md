# Editkaro.in - Premium Multi-Page Portfolio

A premium, minimalist, and highly interactive multi-page portfolio website designed for a social media marketing and video editing agency.

---

## Features

- **Cinematic Dark Theme**: A sophisticated, dark aesthetic with an ambient mesh gradient background for a modern editorial feel.
- **Dynamic Video Modal**: Seamlessly integrates Vimeo embeds for high-quality, ad-free video playback across multiple categories (Short-form, Long-form, Gaming, Football, eCommerce, Documentary, Color Grading, Anime Videos, and Ads).
- **Interactive UI/UX**: Features a custom magnetic cursor, smooth scroll animations (`IntersectionObserver`), and a 3D parallax tilt effect on portfolio cards.
- **Fully Responsive**: Optimized for all devices with adaptive layouts, preventing horizontal scrolling and ensuring a flawless mobile viewing experience.
- **Google Sheets & Excel Integration**: Complete integration template utilizing browser-based storage fallback, instant Excel (CSV) exports, and Google Apps Script triggers.

---

## Getting Started

To view the project locally:

1. Clone or download the repository.
2. Open the `index.html` file in your web browser. No compilation, local server, or npm installs are required.

---

## Google Sheets Integration Setup Guide

The website is pre-configured with a local database fallback. To automate storing submissions directly to a live **Google Sheet** (meeting the Excel/Google Sheets integration criteria):

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name the sheet (e.g., `Editkaro Submissions`).

### Step 2: Add Apps Script Code
1. In the Google Sheets menu, navigate to **Extensions > Apps Script**.
2. Replace any default code in the editor with the following Google Apps Script:

```javascript
function doPost(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    if (data.email && !data.name) {
      // Email Collector Submission
      sheet.appendRow([
        new Date().toLocaleString(),
        "Newsletter Subscriber",
        data.email,
        "",
        "",
        ""
      ]);
    } else {
      // Contact Form Submission
      sheet.appendRow([
        new Date().toLocaleString(),
        "Contact Inquiry",
        data.email,
        data.name,
        data.phone,
        data.message
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "error": err.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Save the project (click the disk icon).

### Step 3: Deploy as a Web App
1. Click the **Deploy** button at the top right and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the configurations:
   - **Description**: `Editkaro Form Handler`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` (this allows public form submissions)
4. Click **Deploy**.
5. Copy the generated **Web App URL** (ends in `/exec`).

### Step 4: Link to Website
1. Open `script.js` in your code editor.
2. Locate the line:
   ```javascript
   const GOOGLE_SCRIPT_URL = '';
   ```
3. Paste the copied Web App URL inside the quotes:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXX/exec';
   ```
4. Save the file. Form submissions will now write to the Google Sheet automatically.

---

## Deployment

This project is production-ready and optimized for static hosting platforms like **Vercel** or **GitHub Pages**. All assets, links, and video modals use CORS-safe external assets to guarantee immediate functionality without deployment issues.

---

## Project Report

### 1. Changes Made
- **Multi-page Architecture**: Transformed the single-page prototype into a fully developed 5-page setup (`index.html`, `portfolio.html`, `about.html`, `contact.html`, and `admin.html`).
- **9-Category Portfolio Grid**: Created a categorized grid of works mapping exactly to the requested categories (Short Form, Long Form, Gaming Videos, Football Edits, eCommerce Ads, Documentary Style, Color Grading, Anime Videos, and Ads) with category filter buttons.
- **LocalStorage Spreadsheet Dashboard**: Built a simulated admin spreadsheet view that dynamically loads form submissions and allows instant CSV downloads (Excel format).
- **Responsive Drawer Menu**: Created a sleek slide-out hamburger menu drawer for mobile devices and optimized flexible grids for a zero-overflow viewport.

### 2. Challenges Faced & Solutions
- **Challenge: YouTube Embed hotlinking errors**  
  *Issue*: YouTube video URLs threw domain and CORS policy errors inside the dynamic modal when deployed.  
  *Solution*: Replaced the video links with public Vimeo assets and built a dynamic iframe generator in `script.js` that loads Vimeo cleanly without third-party playback blocks.
- **Challenge: Mobile horizontal scrolling**  
  *Issue*: Absolute widths and viewport-width margins on container elements caused text overflow and horizontal drift on mobile screens.  
  *Solution*: Refactored CSS constraints on `html` and `body` (`overflow-x: hidden`), and replaced fixed margins with responsive grid margins and flexboxes.
- **Challenge: Simulating active databases**  
  *Issue*: Requiring Google Sheets write capabilities locally could fail without hosting and server setups.  
  *Solution*: Configured standard `localStorage` fallbacks that automatically log form submissions. Designed a hidden database view panel (`admin.html`) with CSV exports to act as a robust Excel/Sheets mockup, and included the Apps Script code for direct linking.
