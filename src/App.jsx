// import { useState } from "react";
import { useState, useEffect } from "react";
import "./App.css"; 

const API_KEY = "ab350910833c-4e35-998e-670bda429efd:sk-ZmE3MDNhNzQtMzAyMi00NjUzLTk5N2UtMDE5ZWExMThiZDU5";
const AGENT_ID = "e10496af-3e69-4be2-a7ef-d8e85c7a80cf";

export default function App() {
  const [url, setUrl] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [progress, setProgress] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        // Simulate progress - will take about 30 seconds to reach 100%
        setProgress(prev => Math.min(prev + 3.3, 99));
      }, 1000);
    } else {
      setTimeElapsed(0);
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleRunAgent = async () => {
    setLoading(true);
    setResult("");
    setProgress(0);
    
    try {
      // First API call to trigger the agent
      const res = await fetch(`https://api-bcbe5a.stack.tryrelevance.com/latest/agents/trigger`, {
        method: "POST",
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            role: "user",
            content: `LinkedIn: ${url}\n\nJob: ${jd}`,
          },
          agent_id: AGENT_ID,
        }),
      });

      const responseData = await res.json();
      console.log("API Response:", responseData);

      // Check if the response contains the expected properties
      if (!responseData || !responseData.job_info) {
        throw new Error("Invalid API response format. Missing job_info property.");
      }

      const { studio_id, job_id } = responseData.job_info;

      // Poll for result
      let done = false;
      let output = "";
      let pollAttempts = 0;
      const maxPollAttempts = 30; // Maximum number of polling attempts (30 seconds)

      while (!done && pollAttempts < maxPollAttempts) {
        pollAttempts++;
        
        try {
          const pollRes = await fetch(
            `https://api-bcbe5a.stack.tryrelevance.com/latest/studios/${studio_id}/async_poll/${job_id}`,
            { headers: { Authorization: API_KEY } }
          );
          
          if (!pollRes.ok) {
            throw new Error(`Poll request failed with status ${pollRes.status}`);
          }
          
          const data = await pollRes.json();
          
          const update = data.updates?.find((u) => u.type === "chain-success");
          if (update) {
            output = update.output?.output?.answer || "No answer provided in response";
            done = true;
            setProgress(100);
          }
        } catch (pollError) {
          console.error("Error during polling:", pollError);
          // Continue polling despite errors
        }
        
        // Wait 1 second before next poll
        await new Promise((res) => setTimeout(res, 1000));
      }

      if (!done) {
        throw new Error("Timed out waiting for a response from the agent.");
      }

      // Format the result
      const formattedResult = formatAnalysisResult(output);
      setResult(formattedResult);
    } catch (err) {
      console.error("API Error:", err);
      setResult(`❌ Error: ${err.message}`);
    }

    setLoading(false);
  };

  // Function to format the analysis result
  const formatAnalysisResult = (result) => {
    if (!result) return "";
    
    return result; // We'll actually handle the formatting in CSS
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Top recruiter</h1>
        <p className="text-gray-600 mb-6">This recruiter finds if a candidate matches the post</p>
      </div>
      
      {/* Form */}
      <div className="form-container">
        <div className="input-group">
          <label htmlFor="linkedin-url">LinkedIn Profile URL</label>
          <input
            id="linkedin-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description here..."
            rows={5}
            className="input"
          />
        </div>

        <button
          onClick={handleRunAgent}
          disabled={loading}
          className={`button ${loading ? 'button-loading' : ''}`}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Evaluating...
            </>
          ) : (
            "Evaluate Match"
          )}
        </button>
      </div>

      {/* Progress Bar (visible during loading) */}
      {loading && (
        <div className="progress-container">
          <div className="progress-info">
            <span>Processing... {timeElapsed}s elapsed</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="result">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          <div className="result-content">
            {/* Score section */}
            <div className="score-section">
              <h3 className="text-lg font-medium mb-2">Overall Match Score</h3>
              <div className="score-container">
                <div className="score-value">60</div>
                <div className="score-scale">/100</div>
              </div>
              <div className="score-bar">
                <div className="score-fill" style={{ width: "60%" }}></div>
              </div>
              <div className="score-label">Moderate Fit</div>
            </div>

            {/* Skills Match Table */}
            <div className="match-section">
              <h3 className="text-lg font-medium mb-2">Skills Match Table</h3>
              <div className="table-container">
                <table className="match-table">
                  <thead>
                    <tr>
                      <th>Skill Required</th>
                      <th>Candidate Score</th>
                      <th>Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Go</td>
                      <td className="status-missing">Not listed</td>
                      <td className="status-gap">Gap</td>
                    </tr>
                    <tr>
                      <td>AWS</td>
                      <td className="status-good">85</td>
                      <td className="status-match">Match</td>
                    </tr>
                    <tr>
                      <td>Docker</td>
                      <td className="status-missing">Not listed</td>
                      <td className="status-gap">Gap</td>
                    </tr>
                    <tr>
                      <td>CI/CD</td>
                      <td className="status-missing">Not listed</td>
                      <td className="status-gap">Gap</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Experience & Role Fit */}
            <div className="match-section">
              <h3 className="text-lg font-medium mb-2">Experience & Role Fit</h3>
              <div className="table-container">
                <table className="match-table">
                  <thead>
                    <tr>
                      <th>Factor</th>
                      <th>Requirement</th>
                      <th>Candidate Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Years of Experience</td>
                      <td>3+ years</td>
                      <td className="status-match">8 years ✅</td>
                    </tr>
                    <tr>
                      <td>Cloud-native Environments</td>
                      <td>Required</td>
                      <td>Strong (score: 85)</td>
                    </tr>
                    <tr>
                      <td>Microservices</td>
                      <td>Required</td>
                      <td>Weak (score: 60)</td>
                    </tr>
                    <tr>
                      <td>Go</td>
                      <td>Must know</td>
                      <td className="status-gap">Not listed ❌</td>
                    </tr>
                    <tr>
                      <td>Docker</td>
                      <td>Must know</td>
                      <td className="status-gap">Not listed ❌</td>
                    </tr>
                    <tr>
                      <td>CI/CD</td>
                      <td>Must know</td>
                      <td className="status-gap">Not listed ❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recruiter Insights */}
            <div className="insights-section">
              <h3 className="text-lg font-medium mb-2">Recruiter Insights</h3>
              <div className="insight-container">
                <div className="insight-item">
                  <h4>Strengths:</h4>
                  <p>Strong experience in AWS and leadership roles; extensive background in software development.</p>
                </div>
                <div className="insight-item">
                  <h4>Gaps:</h4>
                  <p>No mention of Go, Docker, or CI/CD; these are critical for the role.</p>
                </div>
                <div className="insight-item">
                  <h4>Concerns:</h4>
                  <p>Candidate may require significant ramp-up time to meet the technical requirements of the position.</p>
                </div>
                <div className="insight-item">
                  <h4>Overall:</h4>
                  <p>While the candidate has strong leadership and technical skills, the lack of specific experience in Go, Docker, and CI/CD makes them a less suitable fit for this backend Go developer role. Recommend considering for other positions that align more closely with their strengths.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}