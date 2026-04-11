# EcoTrack (Carbon AI)

A modern React-based web application for carbon emissions tracking and environmental sustainability management. EcoTrack helps organizations monitor, report, and reduce their carbon footprint through real-time monitoring, Scope 1–3 automation, forecasting, and audit-ready reporting.

## Features

- **Real-time Monitoring**: Unified visibility across facilities with live emissions signals and anomaly alerts.
- **Scope 1–3 Automation**: Structured data capture and workflows aligned to GHG Protocol and reporting cycles.
- **Forecasting & Scenarios**: Model trajectories and initiatives to prioritize emission reduction efforts.
- **Audit-Ready Reporting**: Exportable narratives, backend emails natively pushed securely over edge-networking layers.
- **User Authentication**: Secure login/logout with Supabase.
- **Real-time Peer Benchmarking**: Empowers instant scoring algorithm updates syncing dashboard displays via optimized PubSub tracking natively simulating growth coaching.
- **Precision Grounding**: Calculates real-world conversion metrics applying strict India-grid float calculations removing UX gamifications limits.
- **Intelligent OCR NLP**: Extracts inputs dynamically mimicking visual file-parsing through conversational safety cycles before storing database parameters natively.
- **Dashboard**: Interactive panels for emissions, energy usage, configured entirely into Framer Motion.
- **Responsive Design**: Dark-themed UI with Tailwind CSS and smooth animations natively attached organically.

## Prerequisites

Before setting up, ensure you have the following installed:

- **Node.js** (v14 or higher): Download from [nodejs.org](https://nodejs.org/) (LTS recommended).
- **npm** (comes with Node.js) or **yarn/pnpm** (optional alternatives).
- **Git** (for cloning the repo, if needed).

Verify installations:
```bash
node --version
npm --version
```

## Alternative Setup with Conda

If you prefer using Conda for environment management (e.g., for isolation or multiple projects), follow these steps instead of the npm setup below.

1. **Install Conda** (if not installed):
   - Download Miniconda from [miniconda.com](https://docs.conda.io/en/latest/miniconda.html).
   - Verify: `conda --version`.

2. **Create and Activate Environment**:
   ```bash
   conda create -n ecotrack-env nodejs
   conda activate ecotrack-env
   ```

3. **Clone the Repository** (if not already done):
   ```bash
   git clone https://github.com/prasanna9701/EcoTrack.git
   cd EcoTrack
   ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```
   This installs all required packages (see [DEPENDENCIES.md](DEPENDENCIES.md) for details).

5. **Environment Configuration** (Optional):
   - The app uses Supabase for backend. Credentials are pre-configured in `src/pages/supabaseClient.js`.
   - If you need to customize (e.g., your own Supabase project), update the URL and key there.

6. **Run the App**:
   - Development: `npm start`
   - Test: `npm test`
   - Build: `npm run build`

7. **Deactivate Environment** (when done):
   ```bash
   conda deactivate
   ```

## Installation & Setup (npm)

- **Development Mode**:
  ```bash
  npm start
  ```
  Opens the app at [http://localhost:3000](http://localhost:3000). The page reloads on changes.

- **Testing**:
  ```bash
  npm test
  ```
  Runs the test suite in interactive watch mode.

- **Build for Production**:
  ```bash
  npm run build
  ```
  Creates an optimized build in the `build/` folder, ready for deployment.

- **Eject** (Advanced - Not Recommended):
  ```bash
  npm run eject
  ```
  Ejects from Create React App for custom configuration. This is irreversible.

## Project Structure

```
EcoTrack/
├── public/                 # Static assets (HTML, icons, etc.)
├── src/
│   ├── pages/              # React components (home, emission, login, etc.)
│   ├── App.js              # Main app component with routing
│   ├── index.js            # App entry point
│   └── ...                 # Other React files
├── supabase/               # Supabase-related files
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS config
└── README.md               # This file
```

## Dependencies

For a detailed breakdown of all dependencies and their purposes, see [DEPENDENCIES.md](DEPENDENCIES.md).

## Contributing

1. Fork the repo and create a feature branch.
2. Make changes and run tests: `npm test`.
3. Submit a pull request with a clear description.

## License

This project is private. Contact the owner for usage rights.

## Learn More

- [React Documentation](https://reactjs.org/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Create React App](https://facebook.github.io/create-react-app/docs/getting-started)
