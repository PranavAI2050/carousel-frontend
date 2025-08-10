import React, { useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = React.useState("LLM Thoughts");
  const [url, setUrl] = React.useState(
    "https://cookbook.openai.com/examples/gpt4-1_prompting_guide"
  );
  const [template, setTemplate] = React.useState(`[Intro]
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

  const [responseText, setResponseText] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [currentSlide, setCurrentSlide] = React.useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseText(null);
    setCurrentSlide(0);

    try {
      const res = await axios.post(
        "https://poll-google-docs-until-new-content.onrender.com/start-flow",
        {
          topic,
          jsontemplate: template,
          url,
        }
      );
      // Assuming res.data is the raw text string
      setResponseText(res.data);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
    setLoading(false);
  }

  // Split the response text into slide chunks
  function getSlidesFromText(text) {
    if (!text) return [];
    // Split by new section headers, keep header lines using a lookahead regex
    const parts = text.split(/(?=\[(Intro|Slide \d+|Outro)\])/g);
    return parts;
  }

  const slides = getSlidesFromText(responseText);

  function prevSlide() {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }
  function nextSlide() {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 20,
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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

      {slides.length > 0 && (
        <>
          <div
            style={{
              marginBottom: 10,
              fontWeight: "bold",
              textAlign: "center",
              color: "#28a745",
              fontSize: 16,
            }}
          >
            🎉 Generation Complete! Slide {currentSlide + 1} of {slides.length}
          </div>

          <div
            style={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              minHeight: 260,
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              background: "#fafafa",
              padding: 20,
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: 15,
              lineHeight: 1.4,
            }}
          >
            {slides[currentSlide]}
          </div>

          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 24,
                  cursor: "pointer",
                  userSelect: "none",
                }}
                aria-label="Previous Slide"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 24,
                  cursor: "pointer",
                  userSelect: "none",
                }}
                aria-label="Next Slide"
              >
                ›
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
