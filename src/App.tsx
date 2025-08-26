// DIAGNOSTIC CODE - Add this to your form component to identify the exact issue
// This will show you exactly where the frontend is failing

// 1. TEST API DIRECTLY FROM FRONTEND (add this to your component)
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

// 2. COMPARE FORM DATA (add this to your form submission)
const debugFormSubmission = (formData) => {
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

// 3. ADD TO YOUR COMPONENT
const YourFormComponent = () => {
  // Add this button temporarily for testing
  const handleDebugClick = () => {
    console.log("Starting diagnostic tests...");
    testAPIDirectly();
  };

  const handleFormSubmit = async (formData) => {
    debugFormSubmission(formData);
    // ... rest of your form submission code
  };

  return (
    <div>
      {/* Your existing form */}
      
      {/* TEMPORARY DEBUG BUTTON - Remove after fixing */}
      <button 
        type="button" 
        onClick={handleDebugClick}
        style={{background: 'red', color: 'white', margin: '10px'}}
      >
        🔍 DEBUG API
      </button>
    </div>
  );
};

// 4. BROWSER CONSOLE COMMANDS (run these in browser dev tools)
/*
// Test API from browser console:
testAPI = async () => {
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
    const result = await response.json();
    console.log("Browser console test:", result);
  } catch (e) {
    console.error("Browser console error:", e);
  }
};
testAPI();
*/
