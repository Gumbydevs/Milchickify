// Configuration for Hugging Face API integration
// Using an instruct model for better prompt following
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

// Your API key - should be filled in with your actual key
const API_KEY = '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';

// UI state variables
let isProcessing = false;
let useFallbackMode = false;

// Basic mode transformations
const corporateReplacements = {
  "good": "optimal",
  "bad": "suboptimal",
  "problem": "opportunity for improvement",
  "work": "perpetuate workplace harmony",
  "help": "facilitate",
  "meeting": "collaborative synergy session",
  "task": "deliverable",
  "team": "workgroup collective",
  "goal": "metric-driven objective",
  "important": "mission-critical",
  "deadline": "temporal milestone",
  "improve": "optimize",
  "change": "implement strategic adjustments",
  "discuss": "engage in bilateral communication",
  "issue": "action item",
  "success": "favorable outcome alignment"
};

function basicMilchickify(text) {
  let result = text.toLowerCase();

  // Replace full words only (using word boundaries)
  for (const [key, value] of Object.entries(corporateReplacements)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, value);
  }

  // Add Lumon-style phrases at the start or end (randomly)
  const lumenPhrases = [
    "In service of workplace harmony, ",
    "In alignment with our core values, ",
    "To maintain departmental cohesion, ",
    "For the greater good of Lumon, "
  ];

  const randomPhrase = lumenPhrases[Math.floor(Math.random() * lumenPhrases.length)];
  return randomPhrase + result.charAt(0).toUpperCase() + result.slice(1);
}

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
  useFallbackMode = !useFallbackMode;
  const toggleBtn = document.getElementById('toggleModeBtn');
  toggleBtn.textContent = useFallbackMode ? 'Switch to AI Mode' : 'Switch to Basic Mode';
  toggleBtn.classList.toggle('fallback-mode', useFallbackMode);
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
  const prompt = `You are Milchick, a disturbingly chipper and bureaucratic middle manager from Lumon Industries in the TV show Severance.
Reword the following sentence into your unique corporate style. The output must consist of exactly two sentences. Do not add any acknowledgment or confirmation—simply transform the input into concise, unsettling corporate-speak.
Examples:
Input: I need help with my task.
Output: Assistance with your mission-critical deliverable will be facilitated. Operational enhancements are underway.
Input: I would like this program to work.
Output: Functionality enhancements are underway. System optimization is in progress.
Now transform this: "${text}"`;

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.9,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    let generatedText = (await response.json())[0]?.generated_text || fallbackMilchickify(text);
    // Remove any leading "Output:" or "Transformation:" if present
    generatedText = generatedText.replace(/^(Output:|Transformation:)\s*/i, '');
    return generatedText.trim();
  } catch (error) {
    console.error("API Error:", error);
    return fallbackMilchickify(text);
  }
}

/**
 * Enhanced fallback function that uses more sophisticated rules to transform text
 */
function fallbackMilchickify(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const sentences = text.split('. ');
  const milchickifiedSentences = [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;

    const wordCount = sentence.split(' ').length;

    if (wordCount < 4 || Math.random() < 0.3) {
      const prefix = getRandomItem(milchickPrefixes);
      const middle = getRandomItem(milchickMiddles);
      const corpTerm = getRandomItem(milchickCorporateTerms);
      const suffix = getRandomItem(milchickSuffixes);
      milchickifiedSentences.push(`${prefix} ${middle} ${corpTerm}, ${suffix}.`);
    } else {
      const words = sentence.split(' ');
      const numTermsToAdd = Math.min(Math.floor(wordCount / 5) + 1, 2);
      for (let j = 0; j < numTermsToAdd; j++) {
        const insertPos = Math.floor(Math.random() * (words.length - 1)) + 1;
        const corpTerm = getRandomItem(milchickCorporateTerms);
        words.splice(insertPos, 0, corpTerm);
      }
      const suffix = getRandomItem(milchickSuffixes);
      milchickifiedSentences.push(words.join(' ') + ', ' + suffix + '.');
    }
  }

  return milchickifiedSentences.join(' ');
}

/**
 * Main function to process the input text
 */
async function milchickify() {
  const inputText = document.getElementById('inputText').value.trim();
  if (!inputText) return;

  const outputBox = document.getElementById('outputBox');
  const outputText = document.getElementById('outputText');
  const loadingIndicator = document.getElementById('loadingIndicator');

  outputBox.classList.add('hidden');
  loadingIndicator.classList.remove('hidden');

  try {
    const result = useFallbackMode 
      ? fallbackMilchickify(inputText)
      : await transformWithAI(inputText);

    outputText.textContent = result;
    outputBox.classList.remove('hidden');
  } catch (error) {
    console.error('Error:', error);
    outputText.textContent = fallbackMilchickify(inputText);
    outputBox.classList.remove('hidden');
  } finally {
    loadingIndicator.classList.add('hidden');
  }
}

/**
 * Copies the output text to clipboard
 */
function copyOutput() {
  const outputText = document.getElementById('outputText').textContent;
  navigator.clipboard.writeText(outputText)
    .then(() => alert('Copied to clipboard!'))
    .catch(err => console.error('Failed to copy:', err));
}

// Attach functions to the global window object
window.milchickify = milchickify;
window.copyOutput = copyOutput;
window.toggleFallbackMode = toggleFallbackMode;

// Attach event listeners once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('button[onclick="milchickify()"]');
  if (button) {
    button.addEventListener('click', milchickify);
  }

  const toggleBtn = document.getElementById('toggleModeBtn');
  if (toggleBtn) {
    toggleBtn.textContent = 'Switch to Basic Mode';
    toggleBtn.classList.add('fallback-mode');
  }
});
