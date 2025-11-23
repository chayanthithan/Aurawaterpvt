# Finspire Software Solutions Website

A professional Angular-based website for Finspire Software Solutions featuring a modern design with rotating services animation and fully responsive layout.

## Features

- **Professional Design**: Modern, clean interface with gradient backgrounds and smooth animations
- **Rotating Services Animation**: Unique home page with company logo at center and services rotating around it
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Complete Navigation**: Five main pages with smooth routing
- **Contact Form**: Functional contact form with validation
- **Professional Styling**: Custom SCSS with professional color scheme and typography

## Pages

1. **Home** - Hero section with rotating services, service previews, works showcase, about preview, and contact info
2. **Services** - Detailed view of all services offered
3. **Our Works** - Portfolio showcase with filtering by category
4. **About Us** - Company story, team members, values, and statistics
5. **Contact Us** - Contact form, business information, and map placeholder

## Technologies Used

- Angular 16
- TypeScript
- SCSS
- Font Awesome Icons
- Google Fonts (Inter)
- Responsive CSS Grid & Flexbox

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Angular CLI

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd finspire-website
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Install Angular CLI globally (if not already installed):
   ```bash
   npm install -g @angular/cli
   ```

### Development Server

Run the development server:
```bash
ng serve
```

Navigate to `http://localhost:4200/` to view the application.

### Build

Build the project for production:
```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── navigation/          # Navigation component
│   ├── pages/
│   │   ├── home/               # Home page
│   │   ├── services/           # Services page
│   │   ├── our-works/          # Our Works page
│   │   ├── about-us/           # About Us page
│   │   └── contact-us/         # Contact Us page
│   ├── app-routing.module.ts   # Routing configuration
│   ├── app.component.*         # Root component
│   └── app.module.ts           # App module
├── assets/                     # Static assets
├── styles.scss                 # Global styles
└── index.html                  # Main HTML file
```

## Key Features Implemented

### Rotating Services Animation
- Company logo positioned at center
- Six services rotating around the logo
- Smooth CSS animations with hover effects
- Fully responsive design

### Professional Styling
- Modern gradient backgrounds
- Consistent color scheme (#667eea to #764ba2)
- Professional typography using Inter font
- Smooth hover animations and transitions

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and mobile devices
- Optimized layouts for all screen sizes
- Touch-friendly navigation on mobile

### Contact Form
- Form validation using Angular Forms
- Required field validation
- Email format validation
- Professional styling with focus states

## Customization

### Colors
Main brand colors can be updated in `src/styles.scss`:
- Primary gradient: `#667eea` to `#764ba2`
- Text colors: `#1a202c`, `#64748b`
- Background: `#f8fafc`

### Content
Update company information in respective component TypeScript files:
- Services: `src/app/pages/services/services.component.ts`
- Works: `src/app/pages/our-works/our-works.component.ts`
- Team: `src/app/pages/about-us/about-us.component.ts`
- Contact: `src/app/pages/contact-us/contact-us.component.ts`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for Finspire Software Solutions.

## Support

For support or questions, please contact the development team.
