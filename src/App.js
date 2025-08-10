import React, { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("LLM Thoughts");
  const [url, setUrl] = useState(
    "https://cookbook.openai.com/examples/gpt4-1_prompting_guide"
  );
  const [template, setTemplate] = useState(`[Intro]
Tagline: 
Title:
Paragraph: 

[Slide 1]
Title: 
Paragraph: 

[Slide 2]
Title: 
Paragraph: 

[rest of the slides]
...

[Outro]
Tagline: 
Title:
Paragraph: 
Call to action:`);

  const [responseText, setResponseText] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseText(null);

    try {
      const res = await axios.post(
        "https://poll-google-docs-until-new-content.onrender.com/start-flow",
        {
          topic,
          jsontemplate: template,
          url,
        }
      );

      // Just take content as-is (assuming res.data.content is the string)
      const text = typeof res.data === "string" ? res.data : res.data.content || "";
      setResponseText(text);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>
        Generate Presentation Carousel
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 40,
          display: "flex",
          flexDirection: "column",
          gap: 15,
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <label>
          <strong>Topic:</strong>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              marginTop: 5,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            required
          />
        </label>

        <label>
          <strong>URL:</strong>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 16,
              marginTop: 5,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            required
          />
        </label>

        <label>
          <strong>JSON Template:</strong>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={12}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              marginTop: 5,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontFamily: "monospace",
              resize: "vertical",
            }}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            fontSize: 18,
            borderRadius: 6,
            backgroundColor: loading ? "#aaa" : "#007bff",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && (
        <div
          style={{
            background: "#ffe6e6",
            color: "#cc0000",
            padding: 15,
            borderRadius: 6,
            marginBottom: 20,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Error: {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}

      {responseText && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            backgroundColor: "#fafafa",
            borderRadius: 8,
            padding: 20,
            fontFamily: "monospace",
            fontSize: 15,
            lineHeight: 1.4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {responseText}
        </pre>
      )}
    </div>
  );
}

export default App;
