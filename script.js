// Configuration for Hugging Face API integration
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

// Your API key
const API_KEY = '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'; 

// UI state variables
let isProcessing = false;
let useFallback = false;

// Milchick-style phrases and expressions
const milchickPrefixes = [
  "I want to express my gratitude for",
  "I'm delighted to inform you about",
  "It brings me immense pleasure to acknowledge",
  "I must commend you on",
  "Allow me to extend my appreciation for"
];

const milchickMiddles = [
  "your outstanding",
  "your exemplary",
  "your truly remarkable",
  "your diligent",
  "your praiseworthy"
];

const milchickCorporateTerms = [
  "synergy",
  "paradigm shift",
  "value proposition",
  "action items",
  "bandwidth",
  "circle back",
  "deep dive",
  "holistic approach",
  "leverage",
  "mission-critical",
  "optimize",
  "pivot",
  "robust solution",
  "streamline",
  "touch base"
];

const milchickSuffixes = [
  "which aligns perfectly with our core values",
  "that exemplifies the Lumon spirit",
  "that truly embodies what we stand for",
  "that we at Lumon hold in high regard",
  "that deserves recognition at our next wellness session"
];

/**
 * Toggles between AI and fallback mode
 */
function toggleFallbackMode() {
  useFallback = !useFallback;
  const toggleBtn = document.getElementById('toggleModeBtn');
  if (toggleBtn) {
    toggleBtn.textContent = useFallback ? 'Switch to AI Mode' : 'Switch to Basic Mode';
    toggleBtn.classList.toggle('fallback-mode');
  }
}

/**
 * Returns a random item from an array
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Transforms text using Hugging Face's API to match Milchick's style
 */
async function transformWithAI(text) {
  console.log("Attempting API call with text:", text);
  
  try {
    // Create a prompt that describes what we want
    const prompt = `Transform this text into Irving Milchick style corporate speak from Severance TV show, with flowery language, corporate jargon, and references to Lumon values: "${text}"`;
    
    console.log("Using API URL:", HUGGINGFACE_API_URL);
    console.log("API Key length:", API_KEY.length);
    
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 250,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      })
    });
    
    console.log("API Response status:", response.status);
    
    const data = await response.json();
    console.log("API Response data:", data);
    
    if (data.error) {
      console.error("API Error:", data.error);
      return null; // Will trigger fallback
    }
    
    // Different models return results in different formats
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      return data[0].generated_text;
    }
    else if (data.generated_text) {
      return data.generated_text;
    }
    else if (typeof data === 'string') {
      return data;
    }
    else {
      console.error("Unexpected API response format:", data);
      return null; // Will trigger fallback
    }
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return null; // Will trigger fallback
  }
}

/**
 * Fallback function that uses basic rules to transform text
 */
function fallbackMilchickify(text) {
  console.log("Using fallback mode with text:", text);
  
  // Handle empty input
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Split the input into sentences
  const sentences = text.split('. ');
  const milchickifiedSentences = [];
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    if (!sentence.trim()) {
      continue;
    }
    
    // Randomly determine if we should completely replace or enhance the sentence
    if (Math.random() < 0.3) {  // 30% chance to completely replace
      const prefix = getRandomItem(milchickPrefixes);
      const middle = getRandomItem(milchickMiddles);
      const corpTerm = getRandomItem(milchickCorporateTerms);
      const suffix = getRandomItem(milchickSuffixes);
      
      const milchickified = `${prefix} ${middle} ${corpTerm}, ${suffix}.`;
      milchickifiedSentences.push(milchickified);
    } else {  // 70% chance to enhance the original
      // Insert corporate-speak terms
      const words = sentence.split(' ');
      
      // Insert a corporate term
      if (words.length > 3) {
        const insertPos = Math.floor(Math.random() * (words.length - 1)) + 1;
        const corpTerm = getRandomItem(milchickCorporateTerms);
        words.splice(insertPos, 0, corpTerm);
      }
      
      // Add a Milchick-style suffix
      const suffix = getRandomItem(milchickSuffixes);
      const milchickified = words.join(' ') + ', ' + suffix + '.';
      
      milchickifiedSentences.push(milchickified);
    }
  }
  
  const result = milchickifiedSentences.join(' ');
  console.log("Fallback generated:", result);
  return result;
}

/**
 * Main function to process the input text
 */
async function milchickify() {
  console.log("milchickify function called");
  
  try {
    const inputElement = document.getElementById('inputText');
    const outputElement = document.getElementById('outputText');
    const outputBox = document.getElementById('outputBox');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    console.log("Input element exists:", !!inputElement);
    console.log("Output element exists:", !!outputElement);
    console.log("Output box exists:", !!outputBox);
    console.log("Loading indicator exists:", !!loadingIndicator);
    
    if (!inputElement || !outputElement || !outputBox) {
      console.error('Required DOM elements not found');
      return;
    }
    
    const input = inputElement.value.trim();
    console.log("Input text:", input);
    
    if (!input) {
      console.log("Empty input, returning");
      return;
    }

    // Show loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
      console.log("Loading indicator displayed");
    }
    
    isProcessing = true;
    let milchickifiedText;
    
    console.log("Using fallback mode:", useFallback);
    
    if (useFallback) {
      // Use the basic algorithm if in fallback mode
      milchickifiedText = fallbackMilchickify(input);
    } else {
      // Try to use the AI API
      console.log("Attempting AI transformation");
      milchickifiedText = await transformWithAI(input);
      
      // If AI failed, use fallback
      if (!milchickifiedText) {
        console.log("AI transformation failed, falling back to basic mode");
        milchickifiedText = fallbackMilchickify(input);
      }
    }
    
    console.log("Final text:", milchickifiedText);
    
    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
      console.log("Loading indicator hidden");
    }
    
    outputElement.innerText = milchickifiedText;
    outputBox.classList.remove('hidden');
    console.log("Output displayed");
    
    isProcessing = false;
  } catch (error) {
    console.error("Error in milchickify function:", error);
    alert("An error occurred. Check the console for details.");
  }
}

/**
 * Copies the output text to clipboard
 */
function copyOutput() {
  console.log("copyOutput function called");
  
  const outputElement = document.getElementById('outputText');
  
  if (!outputElement) {
    console.error('Output element not found');
    return;
  }
  
  const text = outputElement.innerText;
  console.log("Copying text:", text);
  
  // Use a more modern approach to clipboard API with fallback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Copied!");
        console.log("Text copied successfully");
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        alert("Failed to copy. Please try again.");
      });
  } else {
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'Copied!' : 'Failed to copy. Please try again.';
      alert(msg);
      console.log("Text copy result:", successful);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert("Failed to copy. Please try again.");
    }
    
    document.body.removeChild(textArea);
  }
}

// Make sure the milchickify function is available globally
window.milchickify = milchickify;
window.copyOutput = copyOutput;
window.toggleFallbackMode = toggleFallbackMode;

// Log when the script loads
console.log("Script loaded successfully");

// Add a simple check in case the button is not properly hooked up
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded");
  
  // Check if the button has a click handler
  const button = document.querySelector('button[onclick="milchickify()"]');
  console.log("Main button exists:", !!button);
  
  if (button) {
    // Add an extra event listener just in case
    button.addEventListener('click', function() {
      console.log("Button clicked via event listener");
      milchickify();
    });
  }
  
  // Force default to fallback mode since we're having API issues
  useFallback = true;
  const toggleBtn = document.getElementById('toggleModeBtn');
  if (toggleBtn) {
    toggleBtn.textContent = 'Switch to AI Mode';
    toggleBtn.classList.add('fallback-mode');
  }
});