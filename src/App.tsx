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

  const handleSubmit = async () => {
    if (!niche || !contentType || !platform) {
      setError("Please select niche, content type, and platform");
      return;
    }

    if (!keyword.trim() || !sourceMaterial.trim()) {
      setError("Keyword and source material are required");
      return;
    }

    if (contentType === "affiliate" && !affiliateLink.trim()) {
      setError("Affiliate link is required for affiliate content");
      return;
    }

    setIsLoading(true);
    setError("");
    setGeneratedContent("");
    setQualityScore(0);
    setQualityBreakdown({});
    setDisclaimers([]);

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        })
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("Parsed result:", result);

      if (!result || typeof result !== 'object') {
        throw new Error("Invalid response format from API");
      }

      if (!result.content) {
        console.error("API result missing content:", result);
        throw new Error("API returned success but no content generated");
      }

      const extractedData = {
        content: result.content || "No content generated",
        qualityScore: result.qualityScore || 0,
        qualityBreakdown: result.qualityBreakdown || {},
        modelUsed: result.modelUsed || "unknown",
        estimatedCost: result.estimatedCost || 0
      };

      console.log("Successfully extracted data:", extractedData);

      setGeneratedContent(extractedData.content);
      setQualityScore(extractedData.qualityScore);
      setQualityBreakdown(extractedData.qualityBreakdown);
      setDisclaimers(result.disclaimers || []);
      setError("");

    } catch (error: any) {
      console.error("Form submission error:", error);
      console.error("Error stack:", error.stack);

      let userFriendlyError = "Content generation failed";

      if (error.message.includes("fetch")) {
        userFriendlyError = "Network error - please check your connection";
      } else if (error.message.includes("API Error")) {
        userFriendlyError = `Server error: ${error.message}`;
      } else if (error.message.includes("Invalid response")) {
        userFriendlyError = "Server returned invalid response format";
      } else if (error.message.includes("no content")) {
        userFriendlyError = "API succeeded but generated no content";
      } else {
        userFriendlyError = `Error: ${error.message}`;
      }

      setError(userFriendlyError);
      console.error("USER FRIENDLY ERROR:", userFriendlyError);
    } finally {
      setIsLoading(false);
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

        {/* Secondary Settings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "25px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
              Publication Platform:
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "16px"
              }}
            >
              <option value="house-domain">House Domain (No Restrictions)</option>
              <option value="sponsored-post">Sponsored Post (Minimal)</option>
              <option value="newswire">Newswire.com (Medium Compliance)</option>
              <option value="globe-newswire">Globe Newswire (High Compliance)</option>
            </select>
          </div>

          {contentType === "affiliate" && (
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
                Affiliate Link: <span style={{ color: "#e74c3c" }}>*Required</span>
              </label>
              <input
                type="url"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                placeholder="https://affiliate-link.com"
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

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#2c3e50" }}>
              Source URL:
            </label>
            <input
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://source-url.com"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #ddd",
                fontSize: "16px"
              }}
            />
          </div>
        </div>

        {/* Company Information */}
        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
          <h3 style={{ color: "#495057", marginBottom: "15px" }}>Company & Author Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "15px" }}>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "14px"
              }}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "14px"
              }}
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "14px"
              }}
            />
            <input
              type="text"
              value={authorCredentials}
              onChange={(e) => setAuthorCredentials(e.target.value)}
              placeholder="Author Credentials"
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "14px"
              }}
            />
          </div>
        </div>

        {/* Source Material */}
        <div style={{ backgroundColor: "#fff3e0", padding: "25px", borderRadius: "10px", marginBottom: "25px", border: "3px solid #ff9800" }}>
          <h3 style={{ color: "#e65100", marginBottom: "15px" }}>Source Material (Required for Factual Accuracy)</h3>
          <textarea
            value={sourceMaterial}
            onChange={(e) => setSourceMaterial(e.target.value)}
            placeholder={`PASTE COMPLETE SOURCE MATERIAL HERE:

SUPPORTED NICHES:
- Health & Supplements: Product specs, clinical studies, ingredients, benefits
- Technology: Features, specifications, user guides, reviews, comparisons
- Finance: Terms, rates, regulations, risk disclosures, analysis
- E-commerce: Product details, pricing, comparisons, testimonials, reviews

Paste all relevant source material to ensure 100% factual accuracy in the generated content.`}
            style={{
              width: "100%",
              minHeight: "200px",
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

        {/* Optional Settings */}
        <div style={{ backgroundColor: "#e8f5e8", padding: "20px", borderRadius: "10px", marginBottom: "25px" }}>
          <h3 style={{ color: "#2e7d32", marginBottom: "15px" }}>Optional Settings</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Target Audience (optional)"
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "14px"
              }}
            />
            <input
              type="text"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              placeholder="Word Count (optional)"
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "14px"
              }}
            />
            <input
              type="text"
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="Additional Requirements (optional)"
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ced4da",
                fontSize: "14px"
              }}
            />
          </div>
        </div>

        {/* Platform Information */}
        <div style={{ backgroundColor: "#e3f2fd", padding: "15px", borderRadius: "8px", marginBottom: "25px", border: "2px solid #2196f3" }}>
          <h4 style={{ color: "#1565c0", marginBottom: "10px" }}>
            {platformConfig[platform as keyof typeof platformConfig].name} - Compliance Level: {platformConfig[platform as keyof typeof platformConfig].compliance}
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", fontSize: "14px" }}>
            <div>
              <strong style={{ color: "#1976d2" }}>Restrictions:</strong>
              <ul style={{ margin: "5px 0 0 20px", color: "#1976d2" }}>
                {platformConfig[platform as keyof typeof platformConfig].restrictions.map((restriction, index) => (
                  <li key={index}>{restriction}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong style={{ color: "#1976d2" }}>Requirements:</strong>
              <ul style={{ margin: "5px 0 0 20px", color: "#1976d2" }}>
                {platformConfig[platform as keyof typeof platformConfig].requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

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
            width: "100%",
            background: isLoading || !keyword.trim() || !sourceMaterial.trim() || (contentType === "affiliate" && !affiliateLink.trim()) ? "#95a5a6" : "linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)"
          }}
        >
          {isLoading 
            ? `Generating with ${modelTier} model...` 
            : !keyword.trim() || !sourceMaterial.trim() 
              ? "Keyword & Source Material Required" 
              : contentType === "affiliate" && !affiliateLink.trim() 
                ? "Affiliate Link Required" 
                : `Generate Professional Content (${modelTier} model)`
          }
        </button>
      </div>

      {/* Quality Score Display */}
      {qualityScore > 0 && (
        <div style={{
          backgroundColor: qualityScore >= 85 ? "#d4edda" : qualityScore >= 70 ? "#d1ecf1" : "#fff3cd",
          padding: "25px",
          borderRadius: "15px",
          border: qualityScore >= 85 ? "3px solid #27ae60" : qualityScore >= 70 ? "3px solid #17a2b8" : "3px solid #ffc107",
          marginBottom: "25px"
        }}>
          <h3 style={{ color: qualityScore >= 85 ? "#155724" : qualityScore >= 70 ? "#0c5460" : "#856404", marginBottom: "15px" }}>
            Content Quality Score: {qualityScore}/100
            {qualityScore >= 85 && " - PRODUCTION READY!"}
            {qualityScore >= 70 && qualityScore < 85 && " - GOOD QUALITY"}
          </h3>
          <div style={{ width: "100%", backgroundColor: "#e9ecef", borderRadius: "10px", overflow: "hidden", marginBottom: "15px" }}>
            <div style={{
              width: `${qualityScore}%`,
              backgroundColor: qualityScore >= 85 ? "#28a745" : qualityScore >= 70 ? "#17a2b8" : "#ffc107",
              height: "20px",
              transition: "width 0.3s ease"
            }} />
          </div>
          {Object.keys(qualityBreakdown).length > 0 && (
            <div style={{ fontSize: "14px", color: "#666" }}>
              <strong>Quality Breakdown:</strong>
              {Object.entries(qualityBreakdown).map(([key, value]) => (
                <span key={key} style={{ marginLeft: "10px" }}>
                  {key}: {Math.round(value)}/100
                </span>
              ))}
            </div>
          )}
          <div style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
            Niche: {nicheConfig[niche as keyof typeof nicheConfig].name} | Platform: {platformConfig[platform as keyof typeof platformConfig].name} | Model: {modelTier} | Words: {generatedContent.split(' ').length}
          </div>
        </div>
      )}

      {/* Disclaimers */}
      {disclaimers.length > 0 && (
        <div style={{ backgroundColor: "#fff3cd", padding: "20px", borderRadius: "10px", marginBottom: "25px", border: "2px solid #ffc107" }}>
          <h3 style={{ color: "#856404", marginBottom: "15px" }}>Compliance Disclaimers</h3>
          {disclaimers.map((disclaimer, index) => (
            <div key={index} style={{ backgroundColor: "#fff", padding: "10px", borderRadius: "5px", marginBottom: "10px", fontSize: "14px", color: "#721c24" }}>
              {disclaimer}
            </div>
          ))}
        </div>
      )}

      {/* Generated Content */}
      {generatedContent && (
        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", marginBottom: "25px" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>
            Generated Professional Content
            <span style={{ fontSize: "16px", color: "#666", marginLeft: "10px" }}>
              ({nicheConfig[niche as keyof typeof nicheConfig].name} - {modelTier} model)
            </span>
          </h3>
          <div style={{
            backgroundColor: "#f8f9fa",
            padding: "25px",
            borderRadius: "10px",
            fontFamily: "Georgia, serif",
            lineHeight: "1.6",
            maxHeight: "600px",
            overflowY: "auto",
            border: "1px solid #dee2e6"
          }}>
            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", color: "#333" }}>
              {generatedContent}
            </pre>
          </div>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => navigator.clipboard.writeText(generatedContent)}
              style={{
                backgroundColor: "#17a2b8",
                color: "white",
                padding: "12px 25px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                marginRight: "15px"
              }}
            >
              Copy Content
            </button>
            <button
              onClick={() => {
                const blob = new Blob([generatedContent], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${keyword.replace(/\s+/g, "-")}-${niche}-${modelTier}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "12px 25px",
                borderRadius: "8px",
                border: "none",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Download Content
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", borderLeft: "5px solid #17a2b8" }}>
        <h3 style={{ color: "#17a2b8", marginBottom: "15px" }}>EMPIRE INTELLIGENCE SYSTEM - AI MODEL SELECTION</h3>
        <div style={{ color: "#0c5460" }}>
          <p><strong>✅ Multi-Model Support:</strong> Choose between Efficient, Standard, and Premium AI models</p>
          <p><strong>✅ Cost Optimization:</strong> Balance quality and cost based on content importance</p>
          <p><strong>✅ Quality Controls:</strong> Comprehensive scoring and validation across all models</p>
          <p><strong>✅ Professional Compliance:</strong> YMYL, FTC, and platform-specific requirements</p>
          <p><strong>✅ Production Ready:</strong> Scalable architecture with model selection flexibility</p>
          <p><strong>✅ Team Friendly:</strong> Clear model options with cost and speed indicators</p>
        </div>
      </div>
    </div>
  );
};

export default App;
