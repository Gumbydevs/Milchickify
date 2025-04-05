// Configuration for Hugging Face API integration
// Using a simpler, more reliable model
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/gpt2';

// Your API key - should be filled in with your actual key
const API_KEY = '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';

// UI state variables
let isProcessing = false;
let useFallback = false; // Changed to false to default to AI mode

// Milchick-style phrases and expressions
const milchickPrefixes = [
  "I want to express my gratitude for",
  "I'm delighted to inform you about",
  "It brings me immense pleasure to acknowledge",
  "I must commend you on",
  "Allow me to extend my appreciation for",
  "I feel compelled to recognize",
  "It is with utmost enthusiasm that I address",
  "We at Lumon are particularly pleased with",
  "I'm thrilled to highlight"
];

const milchickMiddles = [
  "your outstanding",
  "your exemplary",
  "your truly remarkable",
  "your diligent",
  "your praiseworthy",
  "your incredibly valuable",
  "your most impressive",
  "your well-aligned",
  "your harmonious"
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
  "touch base",
  "core competencies",
  "vertical integration",
  "ideation",
  "deliverables",
  "strategic alignment",
  "operational excellence"
];

const milchickSuffixes = [
  "which aligns perfectly with our core values",
  "that exemplifies the Lumon spirit",
  "that truly embodies what we stand for",
  "that we at Lumon hold in high regard",
  "that deserves recognition at our next wellness session",
  "which reinforces our department's exceptional standards",
  "that contributes to our harmonious workplace environment",
  "which showcases the severed floor's commitment to excellence",
  "that will surely be noted in your quarterly review",
  "which we consider a testament to the refinement procedure"
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
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Improved prompt for better Milchick-style responses
    const milchickPrompt = `Rewrite this sentence in an elaborate, polite but condescending, corporate language flourish like the character Mr. Milchick from the show Severance who uses flowery language, excessive corporate jargon, and references to company values while maintaining a subtly threatening tone: "${text}"
Milchick's response: "`;
    
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        inputs: milchickPrompt,
        parameters: {
          max_length: 150,
          temperature: 0.8,
          return_full_text: false
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      let generated = data[0].generated_text.trim();
      
      // Look for quoted text and extract it if present
      const quotedTextMatch = generated.match(/"([^"]+)"/);
      if (quotedTextMatch && quotedTextMatch[1]) {
        generated = quotedTextMatch[1];
      }
      
      // Remove any markdown-like syntax or loading text
      generated = generated.replace(/\[.*?\]/g, '');
      generated = generated.replace(/Loading\./g, '');
      generated = generated.replace(/like this:/i, '');
      
      // Clean up the sentence structure
      let sentences = generated.split('.');
      if (sentences.length > 0) {
        // Take only the first complete sentence
        generated = sentences[0].trim();
        
        // Make sure it ends with proper punctuation
        if (!generated.endsWith('.') && !generated.endsWith('!') && !generated.endsWith('?')) {
          generated += '.';
        }
      }
      
      // Add Milchick-style suffix if missing
      if (!generated.toLowerCase().includes('lumon') && 
          !generated.toLowerCase().includes('value') && 
          !generated.toLowerCase().includes('spirit')) {
        const suffix = getRandomItem(milchickSuffixes);
        generated += ` ${suffix}.`;
      }
      
      return generated;
    }
    
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error("Error calling Hugging Face API:", error.message);
    return null;
  }
}

/**
 * Enhanced fallback function that uses more sophisticated rules to transform text
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
    const sentence = sentences[i].trim();
    if (!sentence) {
      continue;
    }
    
    // Determine approach based on sentence length and structure
    const wordCount = sentence.split(' ').length;
    
    if (wordCount < 4 || Math.random() < 0.3) {
      // For short sentences or 30% chance: complete replacement
      const prefix = getRandomItem(milchickPrefixes);
      const middle = getRandomItem(milchickMiddles);
      const corpTerm = getRandomItem(milchickCorporateTerms);
      const suffix = getRandomItem(milchickSuffixes);
      
      const milchickified = `${prefix} ${middle} ${corpTerm}, ${suffix}.`;
      milchickifiedSentences.push(milchickified);
    } else {
      // For longer sentences: enhance with corporate jargon
      const words = sentence.split(' ');
      
      // Add 1-2 corporate terms based on sentence length
      const numTermsToAdd = Math.min(Math.floor(wordCount / 5) + 1, 2);
      
      for (let j = 0; j < numTermsToAdd; j++) {
        // Insert at different positions for variety
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
  
  try {
    if (!inputElement || !outputElement || !outputBox) {
      throw new Error('Required DOM elements not found');
    }
    
    const input = inputElement.value.trim();
    if (!input) {
      return;
    }

    if (isProcessing) {
      return; // Prevent multiple simultaneous submissions
    }

    isProcessing = true;
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
    }
    
    let milchickifiedText;
    
    if (useFallback) {
      milchickifiedText = fallbackMilchickify(input);
    } else {
      milchickifiedText = await transformWithAI(input);
      if (!milchickifiedText) {
        milchickifiedText = fallbackMilchickify(input);
      }
    }
    
    outputElement.innerText = milchickifiedText;
    outputBox.classList.remove('hidden');
  } catch (error) {
    console.error('Error in milchickify:', error);
    outputElement.innerText = 'An error occurred. Please try again.';
  } finally {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    isProcessing = false;
  }
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

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Make functions available globally
  window.milchickify = milchickify;
  window.copyOutput = copyOutput;
  window.toggleFallbackMode = toggleFallbackMode;
  
  // Add an extra event listener to the button just in case
  const button = document.querySelector('button[onclick="milchickify()"]');
  if (button) {
    button.addEventListener('click', function() {
      milchickify();
    });
  }
  
  // Update the toggle button to reflect default fallback mode
  const toggleBtn = document.getElementById('toggleModeBtn');
  if (toggleBtn) {
    toggleBtn.textContent = 'Switch to AI Mode';
    toggleBtn.classList.add('fallback-mode');
  }
});