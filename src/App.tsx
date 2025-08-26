import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState("house-domain");
  const [contentType, setContentType] = useState("affiliate");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceMaterial, setSourceMaterial] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [authorCredentials, setAuthorCredentials] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [additionalRequirements, setAdditionalRequirements] = useState("");
  const [modelTier, setModelTier] = useState("efficient");
  const [niche, setNiche] = useState("health-supplements");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [qualityScore, setQualityScore] = useState(0);
  const [qualityBreakdown, setQualityBreakdown] = useState<Record<string, number>>({});
  const [disclaimers, setDisclaimers] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addDebugLog = (message: string) => {
    console.log(message);
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const nicheConfig = {
    "health-supplements": {
      name: "Health & Supplements",
      structure: "Benefits → How It Works → Usage Guide → Safety → FAQ",
      tone: "Authoritative but accessible, health-focused",
      targetWords: 3200,
      ymyl: "high",
      disclaimers: ["medical", "general"],
      competitors: ["Healthline", "WebMD", "Examine.com"]
    },
    technology: {
      name: "Technology & Software",
      structure: "Features → Comparison → Use Cases → Pricing → Verdict",
      tone: "Technical but approachable, innovation-focused",
      targetWords: 2800,
      ymyl: "low",
      disclaimers: ["general"],
      competitors: ["TechCrunch", "The Verge", "Ars Technica"]
    },
    finance: {
      name: "Finance & Investment",
      structure: "Analysis → Risks → Benefits → Comparison → Recommendations",
      tone: "Professional and cautious, risk-aware",
      targetWords: 3500,
      ymyl: "critical",
      disclaimers: ["financial", "general"],
      competitors: ["NerdWallet", "Investopedia", "Morningstar"]
    },
    ecommerce: {
      name: "E-commerce & Products",
      structure: "Overview → Top Picks → Detailed Reviews → Buying Guide → FAQ",
      tone: "Helpful and trustworthy, consumer-focused",
      targetWords: 3000,
      ymyl: "medium",
      disclaimers: ["general"],
      competitors: ["Wirecutter", "Consumer Reports", "PCMag"]
    }
  };

  const platformConfig = {
    "globe-newswire": {
      name: "Globe Newswire",
      compliance: "HIGH",
      restrictions: ["No aggressive sales language", "News angle required", "Professional tone"],
      requirements: ["Company contact info", "Factual reporting", "Press release format"]
    },
    newswire: {
      name: "Newswire.com",
      compliance: "MEDIUM",
      restrictions: ["Educational focus required", "No direct financial advice"],
      requirements: ["Educational disclaimers", "Risk warnings"]
    },
    "sponsored-post": {
      name: "Sponsored Post",
      compliance: "MINIMAL",
      restrictions: ["Clear sponsorship disclosure"],
      requirements: ["Sponsored content labeling"]
    },
    "house-domain": {
      name: "House Domain",
      compliance: "NONE",
      restrictions: ["Complete creative freedom"],
      requirements: ["No restrictions"]
    }
  };

  // Direct API test function
  const testApiDirectly = async () => {
    addDebugLog("=== TESTING API DIRECTLY ===");
    setDebugLogs([]);
    
    try {
      const testPayload = {
        niche: 'health-supplements',
        keyword: 'test keyword',
        sourceMaterial: 'test source material',
        modelTier: 'efficient'
      };
      
      addDebugLog(`Making direct API call with payload: ${JSON.stringify(testPayload)}`);
      
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(testPayload)
      });

      addDebugLog(`Direct API test - Status: ${response.status}`);
      addDebugLog(`Direct API test - OK: ${response.ok}`);
      addDebugLog(`Direct API test - Headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addDebugLog(`Direct API test - Error response: ${errorText}`);
        return;
      }

      const result = await response.json();
      addDebugLog(`Direct API test - Success: ${JSON.stringify(result)}`);
      addDebugLog(`Direct API test - Content length: ${result.content?.length || 'No content'}`);
      
    } catch (error: any) {
      addDebugLog(`Direct API test - Exception: ${error.message}`);
      addDebugLog(`Direct API test - Stack: ${error.stack}`);
    }
  };

  const handleSubmit = async () => {
    addDebugLog("=== FORM SUBMISSION DEBUG ===");
    setDebugLogs([]);
    
    if (!niche || !contentType || !platform) {
      setError("Please select niche, content type, and platform");
      addDebugLog("Validation failed: Missing required selections");
      return;
    }

    if (!keyword.trim() || !sourceMaterial.trim()) {
      setError("Keyword and source material are required");
      addDebugLog("Validation failed: Missing keyword or source material");
      return;
    }

    if (contentType === "affiliate" && !affiliateLink.trim()) {
      setError("Affiliate link is required for affiliate content");
      addDebugLog("Validation failed: Missing affiliate link");
      return;
    }

    addDebugLog("All validations passed, starting API call");

    setIsLoading(true);
    setError("");
    setGeneratedContent("");
    setQualityScore(0);
    setQualityBreakdown({});
    setDisclaimers([]);

    try {
      const requestPayload = {
        niche,
        contentType,
        platform,
        sourceMaterial,
        targetAudience: targetAudience || "General audience",
        wordCount: wordCount || nicheConfig[niche as keyof typeof nicheConfig].targetWords,
        additionalRequirements: additionalRequirements || "Follow industry best practices",
        keyword,
        affiliateLink,
        companyName,
        email,
        phone,
        authorCredentials,
        modelTier
      };

      addDebugLog(`Request payload: ${JSON.stringify(requestPayload, null, 2)}`);
      addDebugLog("Making fetch request to /api/generate-content");

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload)
      });

      addDebugLog(`Response status: ${response.status}`);
      addDebugLog(`Response ok: ${response.ok}`);
      addDebugLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
          addDebugLog(`Error response text: ${errorText}`);
        } catch (textError) {
          addDebugLog(`Could not read error response: ${textError}`);
          errorText = `HTTP ${response.status} - ${response.statusText}`;
        }
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      let result;
      try {
        result = await response.json();
        addDebugLog(`Parsed result: ${JSON.stringify(result, null, 2)}`);
      } catch (jsonError) {
        addDebugLog(`JSON parsing error: ${jsonError}`);
        throw new Error("Invalid JSON response from API");
      }

      if (!result || typeof result !== 'object') {
        addDebugLog(`Invalid result type: ${typeof result}`);
        throw new Error("Invalid response format from API");
      }

      // Check different possible response formats
      if (result.success === false) {
        addDebugLog(`API returned success=false: ${result.message}`);
        throw new Error(result.message || "API returned unsuccessful response");
      }

      if (result.error) {
        addDebugLog(`API returned error: ${result.error}`);
        throw new Error(result.error);
      }

      // Handle different content field possibilities
      let content = result.content || result.data?.content || result.generatedContent;
      
      if (!content) {
        addDebugLog("No content found in any expected field");
        addDebugLog(`Available fields: ${Object.keys(result).join(', ')}`);
        throw new Error("API returned success but no content generated");
      }

      const extractedData = {
        content: content,
        qualityScore: result.qualityScore || result.data?.qualityScore || 0,
        qualityBreakdown: result.qualityBreakdown || result.data?.qualityBreakdown || {},
        modelUsed: result.modelUsed || result.data?.modelUsed || "unknown",
        estimatedCost: result.estimatedCost || result.data?.estimatedCost || 0
      };

      addDebugLog("Successfully extracted data");
      addDebugLog(`Content length: ${extractedData.content.length}`);
      addDebugLog(`Quality score: ${extractedData.qualityScore}`);

      setGeneratedContent(extractedData.content);
      setQualityScore(extractedData.qualityScore);
      setQualityBreakdown(extractedData.qualityBreakdown);
      setDisclaimers(result.disclaimers || result.data?.disclaimers || []);
      setError("");

    } catch (error: any) {
      addDebugLog(`Form submission error: ${error.message}`);
      addDebugLog(`Error stack: ${error.stack}`);

      let userFriendlyError = "Content generation failed";

      if (error.message.includes("fetch")) {
        userFriendlyError = "Network error - please check your connection";
      } else if (error.message.includes("API Error")) {
        userFriendlyError = `Server error: ${error.message}`;
      } else if (error.message.includes("Invalid response") || error.message.includes("JSON")) {
        userFriendlyError = "Server returned invalid response format";
      } else if (error.message.includes("no content")) {
        userFriendlyError = "API succeeded but generated no content";
      } else {
        userFriendlyError = `Error: ${error.message}`;
      }

      setError(userFriendlyError);
      addDebugLog(`USER FRIENDLY ERROR: ${userFriendlyError}`);
    } finally {
      setIsLoading(false);
      addDebugLog("Form submission completed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: "30px", 
        padding: "25px", 
        backgroundColor: "#fff", 
        borderRadius: "15px", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white"
      }}>
        <h1 style={{ fontSize: "2.2em", marginBottom: "10px" }}>
          EMPIRE INTELLIGENCE SYSTEM - AI MODEL SELECTION
        </h1>
        <h2 style={{ fontSize: "1.3em", marginBottom: "15px", opacity: 0.9 }}>
          Professional Content Generation • Model Tier Selection • Quality Controls
        </h2>
        <div style={{ fontSize: "16px", opacity: 0.8 }}>
          Choose Your AI Model • Optimize Cost vs Quality • Production Ready
        </div>
      </div>

      {/* Debug Section */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px", border: "3px solid #e74c3c" }}>
        <h3 style={{ color: "#e74c3c", marginBottom: "15px" }}>🔧 DEBUG TOOLS - Find The Exact Problem</h3>
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={testApiDirectly}
            style={{
              backgroundColor: "#e74c3c",
              color: "white",
              padding: "15px 30px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            🔍 TEST API DIRECTLY
          </button>
          <span style={{ color: "#666", fontSize: "14px" }}>
            Click this first to test if your API is working at all
          </span>
        </div>
        
        {/* Debug Logs */}
        {debugLogs.length > 0 && (
          <div style={{
            backgroundColor: "#2c3e50",
            color: "#ecf0f1",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "12px",
            fontFamily: "monospace",
            maxHeight: "300px",
            overflowY: "auto"
          }}>
            <strong>DEBUG LOGS:</strong><br />
            {debugLogs.map((log, index) => (
              <div key={index} style={{ marginBottom: "2px" }}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #f5c6cb"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Main Form */}
      <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", marginBottom: "25px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#2c3e50", marginBottom: "25px" }}>Content Generation Settings</h2>
        
        {/* Primary Settings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px", marginBottom: "25px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
              Target Keyword:
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., mushroom gummies, protein powder"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "16px"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
              Niche Category:
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "16px"
              }}
            >
              <option value="health-supplements">Health & Supplements</option>
              <option value="technology">Technology & Software</option>
              <option value="finance">Finance & Investment</option>
              <option value="ecommerce">E-commerce & Products</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
              Content Type:
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "16px"
              }}
            >
              <option value="affiliate">Affiliate Marketing</option>
              <option value="informational">Educational/E-E-A-T</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
              AI Model Quality:
            </label>
            <select
              value={modelTier}
              onChange={(e) => setModelTier(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "16px"
              }}
            >
              <option value="efficient">Efficient (Fast & Low Cost)</option>
              <option value="standard">Standard (Balanced)</option>
              <option value="premium">Premium (Maximum Quality)</option>
            </select>
            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
              {modelTier === "efficient" && "Cost: ~$0.06-$0.10 per article • Speed: Very Fast"}
              {modelTier === "standard" && "Cost: ~$0.15-$0.25 per article • Speed: Moderate"}
              {modelTier === "premium" && "Cost: ~$0.25-$0.40 per article • Speed: Slower but highest quality"}
            </div>
          </div>
        </div>

        {/* Source Material - Simplified for testing */}
        <div style={{ backgroundColor: "#fff3e0", padding: "25px", borderRadius: "10px", marginBottom: "25px", border: "3px solid #ff9800" }}>
          <h3 style={{ color: "#e65100", marginBottom: "15px" }}>Source Material (Required for Testing)</h3>
          <textarea
            value={sourceMaterial}
            onChange={(e) => setSourceMaterial(e.target.value)}
            placeholder="For testing, just paste any text here - product info, article content, etc."
            style={{
              width: "100%",
              minHeight: "100px",
              padding: "15px",
              borderRadius: "8px",
              border: "2px solid #ff9800",
              fontSize: "14px",
              fontFamily: "monospace",
              resize: "vertical"
            }}
            required
          />
        </div>

        {/* Affiliate Link - Only if affiliate selected */}
        {contentType === "affiliate" && (
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
              Affiliate Link: <span style={{ color: "#e74c3c" }}>*Required for Affiliate Content</span>
            </label>
            <input
              type="url"
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              placeholder="https://your-affiliate-link.com"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "16px"
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !keyword.trim() || !sourceMaterial.trim() || (contentType === "affiliate" && !affiliateLink.trim())}
          style={{
            backgroundColor: isLoading || !keyword.trim() || !sourceMaterial.trim() || (contentType === "affiliate" && !affiliateLink.trim()) ? "#95a5a6" : "#27ae60",
            color: "white",
            padding: "20px 40px",
            borderRadius: "12px",
            border: "none",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: isLoading || !keyword.trim() || !sourceMaterial.trim() || (contentType === "affiliate" && !affiliateLink.trim()) ? "not-allowed" : "pointer",
            width: "100%"
          }}
        >
          {isLoading 
            ? `Generating with ${modelTier} model...` 
            : !keyword.trim() || !sourceMaterial.trim() 
              ? "Keyword & Source Material Required" 
              : contentType === "affiliate" && !affiliateLink.trim() 
                ? "Affiliate Link Required" 
                : `🚀 Generate Professional Content (${modelTier} model)`
          }
        </button>
      </div>

      {/* Generated Content Display */}
      {generatedContent && (
        <div style={{ backgroundColor: "#d4edda", padding: "25px", borderRadius: "15px", border: "3px solid #27ae60", marginBottom: "25px" }}>
          <h3 style={{ color: "#155724", marginBottom: "15px" }}>
            ✅ SUCCESS! Generated Professional Content ({generatedContent.split(' ').length} words)
          </h3>
          <div style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            maxHeight: "400px",
            overflowY: "auto",
            fontFamily: "Georgia, serif",
            lineHeight: "1.6"
          }}>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {generatedContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
