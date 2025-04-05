// Configuration for Hugging Face API integration
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// We'll check for the global variable, but fall back to an empty string if not found
// You'll set this in env.js locally, but for Vercel you'll need to add it directly here
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
  // If no API key is available or it's empty, use fallback
  if (!API_KEY) {
    console.warn('No API key available, falling back to basic mode');
    return null; // Will trigger fallback
  }

  try {
    const prompt = `<s>[INST] You are Irving Milchick from the TV show Severance. Transform the following text into your distinctive corporate management style. Use flowery corporate language, excessive positivity, vague corporate jargon, and maintain a tone that is simultaneously encouraging yet subtly threatening. Make sure to reference Lumon's values and use phrases like "diligent workers" or mention wellness sessions.

Here's the text to transform:
${text} [/INST]</s>`;

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
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
    
    // If AI failed, use fallback
    if (!milchickifiedText) {
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

// Make functions available globally
window.milchickify = milchickify;
window.copyOutput = copyOutput;
window.toggleFallbackMode = toggleFallbackMode;