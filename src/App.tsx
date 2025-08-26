import React, { useState } from 'react';
import './App.css';

// COMPLETE WORKING APP.TSX WITH DIAGNOSTIC AND FIXED FORM SUBMISSION

const App: React.FC = () => {
  // State management
  const [formData, setFormData] = useState({
    niche: '',
    keyword: '',
    companyName: '',
    affiliateLink: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  // DIAGNOSTIC FUNCTION - Test API directly
  const testAPIDirectly = async () => {
    console.log("=== TESTING API DIRECTLY FROM FRONTEND ===");
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          niche: 'Health & Supplements',
          keyword: 'lions mane benefits',
          companyName: 'Lions Mane Mushroom',
          modelTier: 'standard'
        })
      });

      console.log("Direct API test - Status:", response.status);
      console.log("Direct API test - Headers:", Object.fromEntries(response.headers));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Direct API test - Error:", errorText);
        return;
      }

      const result = await response.json();
      console.log("Direct API test - Success:", result);
      console.log("Direct API test - Content length:", result.content?.length);
      
    } catch (error) {
      console.error("Direct API test - Exception:", error);
    }
  };

  // DEBUG FORM DATA
  const debugFormSubmission = (formData: any) => {
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Form data received:", formData);
    console.log("Form data type:", typeof formData);
    console.log("Form data keys:", Object.keys(formData || {}));
    
    // Check for common field name issues
    const expectedFields = ['niche', 'keyword', 'companyName'];
    expectedFields.forEach(field => {
      console.log(`Field '${field}':`, formData[field] || "MISSING");
    });
    
    // Check for unexpected fields
    const unexpectedFields = Object.keys(formData || {}).filter(
      key => !['niche', 'keyword', 'companyName', 'affiliateLink', 'modelTier'].includes(key)
    );
    if (unexpectedFields.length > 0) {
      console.warn("Unexpected form fields:", unexpectedFields);
    }
  };

  // FIXED FORM SUBMISSION HANDLER
  const handleFormSubmission = async (submittedFormData: any) => {
    try {
      // Debug the form data first
      debugFormSubmission(submittedFormData);

      // 1. ENSURE PROPER REQUEST FORMAT (matches your working API test)
      const requestBody = {
        niche: submittedFormData.niche,
        keyword: submittedFormData.keyword,
        companyName: submittedFormData.companyName,
        affiliateLink: submittedFormData.affiliateLink || '', // Optional field
        modelTier: 'standard' // Add if missing
      };

      console.log("Sending request:", requestBody); // DEBUG: Log request

      // 2. PROPER FETCH WITH ERROR CHECKING
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", response.status); // DEBUG: Log status
      console.log("Response ok:", response.ok); // DEBUG: Log if ok

      // 3. CHECK RESPONSE STATUS BEFORE PARSING
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      // 4. SAFE JSON PARSING
      const result = await response.json();
      console.log("Parsed result:", result); // DEBUG: Log parsed result

      // 5. SAFE PROPERTY ACCESS WITH VALIDATION
      if (!result || typeof result !== 'object') {
        throw new Error("Invalid response format from API");
      }

      if (!result.content) {
        console.error("API result missing content:", result);
        throw new Error("API returned success but no content generated");
      }

      // 6. SAFE EXTRACTION OF DATA
      const extractedData = {
        content: result.content || "No content generated",
        qualityScore: result.qualityScore || 0,
        qualityBreakdown: result.qualityBreakdown || {},
        modelUsed: result.modelUsed || "unknown",
        estimatedCost: result.estimatedCost || 0
      };

      console.log("Successfully extracted data:", extractedData);
      
      // 7. UPDATE UI WITH SUCCESS
      setGeneratedContent(extractedData.content);
      setQualityScore(extractedData.qualityScore);
      setIsLoading(false);
      setError(null); // Clear any previous errors

      return extractedData;

    } catch (error: any) {
      // 8. COMPREHENSIVE ERROR HANDLING WITH REAL ERROR MESSAGES
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
        // Show the actual error message for debugging
        userFriendlyError = `Error: ${error.message}`;
      }

      setError(userFriendlyError);
      setIsLoading(false);
      
      // Also log to console for debugging
      console.error("USER FRIENDLY ERROR:", userFriendlyError);
      
      throw error; // Re-throw for any calling code
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await handleFormSubmission(formData);
    } catch (error) {
      // Error already handled in the function
      console.log("Form submission failed:", (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
          🚀 Empire Intelligence System
        </h1>
        
        {/* TEMPORARY DEBUG BUTTON */}
        <div className="mb-6 text-center">
          <button 
            type="button" 
            onClick={testAPIDirectly}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            🔍 DEBUG API
          </button>
          <span className="text-sm text-gray-400">
            (Check browser console after clicking)
          </span>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">
              Niche:
            </label>
            <input
              type="text"
              name="niche"
              value={formData.niche}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Health & Supplements"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Keyword:
            </label>
            <input
              type="text"
              name="keyword"
              value={formData.keyword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., lions mane benefits"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Company Name:
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Lions Mane Mushroom"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Affiliate Link (Optional):
            </label>
            <input
              type="url"
              name="affiliateLink"
              value={formData.affiliateLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-affiliate-link.com"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            {isLoading ? '⏳ Generating Content...' : '🚀 Generate Content'}
          </button>
        </form>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mt-6 p-4 bg-red-800 border border-red-600 rounded-lg">
            <h3 className="font-bold text-red-200">Error:</h3>
            <p className="text-red-100">{error}</p>
            <p className="text-sm text-red-200 mt-2">
              Check browser console for detailed error information.
            </p>
          </div>
        )}

        {/* SUCCESS DISPLAY */}
        {generatedContent && (
          <div className="mt-6 p-6 bg-green-800 border border-green-600 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-green-200">✅ Content Generated Successfully!</h3>
              {qualityScore && (
                <span className="bg-green-700 px-3 py-1 rounded text-green-100">
                  Quality: {qualityScore}/100
                </span>
              )}
            </div>
            <div className="bg-gray-900 p-4 rounded border max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-200">
                {generatedContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
