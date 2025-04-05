// This script is part of the "Milchickify" web app, which transforms text into a corporate management style reminiscent of Irving Milchick from the TV show "Severance".
// The app uses the Hugging Face API for advanced text transformation, but also has a fallback mechanism for basic text manipulation.
// Embedded API key handling is included, and the app allows users to save their API key for future use.
const API_KEY = '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';

// UI state variables
let isProcessing = false;
let useFallback = false;

// Sample phrases that define Milchick's style (used as backup and examples)
const milchickPhrases = [
  "I want to express my gratitude for your outstanding work",
  "It brings me immense pleasure to acknowledge your contributions",
  "I must commend you on your exemplary performance metrics",
  "Your diligent efforts deserve recognition at our next wellness session",
  "Allow me to extend my appreciation for your synergy with our core values"
];

// Milchick-style phrases and expressions for fallback
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
 * Shows the API key input modal
 */
function showApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  if (!apiKey && modal) {
    modal.style.display = 'flex';
  }
}

/**
 * Saves the API key and closes the modal
 */
function saveApiKey() {
  const keyInput = document.getElementById('apiKeyInput');
  if (keyInput) {
    apiKey = keyInput.value.trim();
    
    // Save to local storage if user wants to remember
    const rememberCheckbox = document.getElementById('rememberKey');
    if (rememberCheckbox && rememberCheckbox.checked) {
      localStorage.setItem('milchickify_api_key', apiKey);
    }
    
    // Close the modal
    const modal = document.getElementById('apiKeyModal');
    if (modal) {
      modal.style.display = 'none';
    }
    
    // Check if we were waiting for an API key
    const pendingText = document.getElementById('inputText').value.trim();
    if (pendingText && isProcessing) {
      milchickify();
    }
  }
}

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
 * Checks if we have a stored API key on page load
 */
function checkStoredApiKey() {
  const storedKey = localStorage.getItem('milchickify_api_key');
  if (storedKey) {
    apiKey = storedKey;
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
 * @param {string} text - The input text to transform
 * @return {Promise<string>} The Milchickified text
 */
async function transformWithAI(text) {
  if (!apiKey) {
    showApiKeyModal();
    return null; // Will be handled by the calling function
  }
  
  try {
    const prompt = `<s>[INST] You are Irving Milchick from the TV show Severance. Transform the following text into your distinctive corporate management style. Use flowery corporate language, excessive positivity, vague corporate jargon, and maintain a tone that is simultaneously encouraging yet subtly threatening. Make sure to reference Lumon's values and use phrases like "diligent workers" or mention wellness sessions.

Here's the text to transform:
${text} [/INST]</s>`;

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error);
      return null; // Will trigger fallback
    }
    
    if (data && Array.isArray(data) && data.length > 0) {
      // Extract just the generated text, removing any prompt parts
      let generatedText = data[0].generated_text;
      
      // Remove the prompt part from the response if it's included
      const promptEnd = generatedText.indexOf('[/INST]');
      if (promptEnd !== -1) {
        generatedText = generatedText.substring(promptEnd + 7).trim();
      }
      
      return generatedText;
    } else {
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
 * @param {string} text - The input text to transform
 * @return {string} The Milchickified text
 */
function fallbackMilchickify(text) {
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
  
  return milchickifiedSentences.join(' ');
}

/**
 * Main function to process the input text
 */
async function milchickify() {
  const inputElement = document.getElementById('inputText');
  const outputElement = document.getElementById('outputText');
  const outputBox = document.getElementById('outputBox');
  const loadingIndicator = document.getElementById('loadingIndicator');
  
  if (!inputElement || !outputElement || !outputBox) {
    console.error('Required DOM elements not found');
    return;
  }
  
  const input = inputElement.value.trim();
  if (!input) {
    return;
  }

  // Show loading indicator
  if (loadingIndicator) {
    loadingIndicator.style.display = 'block';
  }
  
  isProcessing = true;
  let milchickifiedText;
  
  if (useFallback) {
    // Use the basic algorithm if in fallback mode
    milchickifiedText = fallbackMilchickify(input);
  } else {
    // Try to use the AI API
    milchickifiedText = await transformWithAI(input);
    
    // If AI failed or we need an API key, use fallback
    if (!milchickifiedText) {
      if (!apiKey) {
        // We're waiting for the API key
        if (loadingIndicator) {
          loadingIndicator.style.display = 'none';
        }
        return;
      }
      
      milchickifiedText = fallbackMilchickify(input);
    }
  }
  
  // Hide loading indicator
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }
  
  outputElement.innerText = milchickifiedText;
  outputBox.classList.remove('hidden');
  isProcessing = false;
}

/**
 * Copies the output text to clipboard
 */
function copyOutput() {
  const outputElement = document.getElementById('outputText');
  
  if (!outputElement) {
    console.error('Output element not found');
    return;
  }
  
  const text = outputElement.innerText;
  
  // Use a more modern approach to clipboard API with fallback
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Copied!");
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
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert("Failed to copy. Please try again.");
    }
    
    document.body.removeChild(textArea);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  checkStoredApiKey();
});

// Make functions available globally
window.milchickify = milchickify;
window.copyOutput = copyOutput;
window.saveApiKey = saveApiKey;
window.toggleFallbackMode = toggleFallbackMode;