import { useState } from 'react';
import './App.css';

function App() {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
  
    try {
      const response = await fetch('https://api.relevanceai.com/v1/agents/ab350910833c-4e35-998e-670bda429efd/run', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-OGYxYmIzZjItNjdlYy00MThjLWFlM2YtNTMyYzY3ODJlM2Nm',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            linkedinUrl,
            jobDescription,
          }
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }
  
      setResult(data.output || 'No output received.');
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    }
  
    setLoading(false);
  };
  




  return (
    <div className="app">
      <h1>AI Candidate Evaluator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="LinkedIn Profile URL"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          required
        />
        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Evaluating...' : 'Evaluate'}
        </button>
      </form>
      <div className="result">
        <h2>Result:</h2>
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default App;
