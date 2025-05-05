# AI Candidate Evaluator

A modern web application that compares LinkedIn profiles against job descriptions to determine candidate fit.

![AI Candidate Evaluator Screenshot](screenshot.png)

## Overview

The AI Candidate Evaluator helps recruiters quickly assess how well a candidate matches a specific job role. By analyzing a LinkedIn profile URL and job description, the application provides a detailed assessment with scores, skill matches, and insights.

## Features

- **Profile Evaluation**: Input a LinkedIn profile URL and job description for analysis
- **Match Scoring**: Get an overall match score out of 100
- **Skills Assessment**: View a detailed breakdown of required skills vs. candidate experience
- **Progress Tracking**: Real-time progress bar with elapsed time while the evaluation runs
- **Detailed Insights**: Recruiter-focused insights including strengths, gaps, and recommendations

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ai-candidate-evaluator.git
   cd ai-candidate-evaluator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   VITE_RELEVANCE_API_KEY=your_relevance_api_key
   VITE_AGENT_ID=your_relevance_agent_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```
npm run build
```

The build files will be in the `dist` directory and can be served using any static file server.

## Usage

1. Enter the candidate's LinkedIn profile URL in the first input field
2. Paste the complete job description in the second input field
3. Click "Evaluate Match" to run the analysis
4. View the detailed results, including:
   - Overall match score
   - Skills match table
   - Experience and role fit analysis
   - Recruiter insights


## Deployment link
https://ai-evaluator-seven.vercel.app/

## Technology Stack

- **Frontend**: React.js, CSS3
- **Build Tool**: Vite
- **API Integration**: Relevance AI API for candidate evaluation
- **Styling**: Custom CSS with responsive design

## Configuration

You can customize the evaluation criteria by modifying the prompt sent to the Relevance AI API in the `handleRunAgent` function within `App.jsx`.

## API Integration

This application uses a custom agent I created on Relevance AI. Then uses API to process and analyze candidate profiles against job descriptions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Relevance AI for providing the evaluation API
- All contributors who have helped improve this tool

---

Created by [Siham]