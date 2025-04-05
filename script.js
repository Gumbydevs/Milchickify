// API Configuration
// OpenAI (Primary)
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = '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';
const OPENAI_MODEL = 'gpt-3.5-turbo'; // Most cost-effective option

// Hugging Face (Backup)
const PRIMARY_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';
const BACKUP_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
const HF_API_KEY = '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';

// UI state variables
let isProcessing = false;
let useFallbackMode = false;
let apiProvider = 'openai'; // 'openai', 'huggingface', or 'local'

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
 * Transform text using OpenAI
 */
async function transformWithOpenAI(text) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: 'system', 
            content: 'You are Milchick, a disturbingly chipper and bureaucratic middle manager from Lumon Industries in the TV show Severance. Transform input text into your corporate style while preserving the core meaning. Always respond with exactly two sentences. Make it concise, unsettlingly corporate, and use bureaucratic language and Lumon-appropriate terminology. Do not include any explanations, just respond with the converted text.'
          },
          {role: 'user', content: text}
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return null;
  }
}

/**
 * Transforms text using Hugging Face's API to match Milchick's style
 */
async function transformWithHuggingFace(text) {
  const randomParam = Math.random().toString(36).substring(7);
  const prompt = `You are Milchick, a disturbingly chipper and bureaucratic middle manager from Lumon Industries in the TV show Severance.

SYSTEM: Respond ONLY with the transformed text. Do not include any acknowledgments, labels, or metadata.

STYLE GUIDE:
- Transform the input into your unique corporate style while PRESERVING THE CORE MEANING
- Output must be exactly two sentences
- Make it concise and unsettlingly corporate
- Use bureaucratic language and Lumon-appropriate terminology
- IMPORTANT: Maintain the original intent and key information from the input

EXAMPLES:
Input: I need help with my task.
Output: Your mission-critical deliverable will receive immediate facilitation support. Rest assured that all necessary resources will be allocated to optimize your performance metrics.

Input: I would like this program to work.
Output: Functionality optimization of the designated software solution has been prioritized for your benefit. Our technical refinement process will ensure operational excellence in alignment with department standards.

Input: The coffee machine is broken again.
Output: The beverage dispensation unit is experiencing a temporary operational disruption that requires immediate maintenance intervention. A service request has been expedited to restore workplace refreshment harmony.

###
INPUT TEXT: "${text}" ${randomParam}
###`;

  try {
    // Try primary model first
    let response = await fetch(PRIMARY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    // If primary fails, try backup model with simplified prompt
    if (!response.ok) {
      console.log("Primary HF model failed, trying backup model...");
      
      // Simplified prompt for smaller model
      const backupPrompt = `Convert this text to corporate speak: "${text}"`;
      
      response = await fetch(BACKUP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          inputs: backupPrompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.8,
            return_full_text: false
          }
        })
      });
      
      // If backup also fails, return null
      if (!response.ok) {
        console.log("Backup HF model also failed");
        return null;
      }
    }

    let generatedText = (await response.json())[0]?.generated_text;
    if (!generatedText) return null;
    
    // Clean up model output to remove junk
    generatedText = generatedText
      .replace(/^(Output:|Transformation:)\s*/i, '')         // Remove starting labels
      .replace(/<!--[\s\S]*?-->/g, '')                       // Remove HTML comments
      .replace(/<[^>]+>/g, '')                               // Remove HTML tags
      .replace(/[^a-zA-Z0-9.,;:\-'"()\s]/g, '')             // Remove weird symbols
      .trim();

    // Remove any leading "Output:" or "Transformation:" from each line
    generatedText = generatedText.split('\n').map(line =>
      line.replace(/^(Output:|Transformation:)\s*/i, '')
    ).join(' ').trim();
    
    // If we got a very short response, return null
    if (generatedText.length < 20) {
      return null;
    }
    
    return generatedText;
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    return null;
  }
}

/**
 * Transforms text using available APIs or falls back to local implementation
 */
async function transformWithAI(text) {
  try {
    // First try OpenAI
    apiProvider = 'openai';
    console.log("Trying OpenAI...");
    let result = await transformWithOpenAI(text);
    
    // If OpenAI fails, try Hugging Face
    if (!result) {
      apiProvider = 'huggingface';
      console.log("OpenAI failed, trying Hugging Face...");
      result = await transformWithHuggingFace(text);
    }
    
    // If both APIs fail, use improved fallback
    if (!result) {
      apiProvider = 'local';
      console.log("All APIs failed, using improved fallback...");
      result = improvedFallbackMilchickify(text);
    }
    
    return result;
  } catch (error) {
    console.error("API Error:", error);
    apiProvider = 'local';
    return improvedFallbackMilchickify(text);
  }
}

/**
 * Enhanced fallback function that preserves meaning while adding Milchick style
 */
function improvedFallbackMilchickify(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Clean and normalize the input
  let cleanText = text.trim();
  if (!cleanText.endsWith('.')) {
    cleanText += '.';
  }

  // Break into sentences
  const sentences = cleanText.split(/(?<=\.)\s+/);
  const result = [];
  
  // Process each sentence to preserve core meaning
  for (let i = 0; i < Math.min(sentences.length, 2); i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    // Extract key words (nouns, verbs) - simple approach
    const words = sentence.split(' ');
    const keyWords = words.filter(word => 
      word.length > 3 && 
      !['this', 'that', 'with', 'from', 'about', 'would', 'could'].includes(word.toLowerCase())
    );
    
    // Get 1-2 key words to preserve
    const keyTerms = keyWords.length > 0 
      ? keyWords.slice(0, Math.min(2, keyWords.length))
      : [words[Math.floor(words.length / 2)]]; // Fallback to middle word
    
    // Categorize input intent - very basic detection
    let intentType = 'statement';
    if (sentence.includes('?')) intentType = 'question';
    else if (sentence.toLowerCase().startsWith('i want') || 
             sentence.toLowerCase().startsWith('i would like') ||
             sentence.toLowerCase().startsWith('please') ||
             sentence.toLowerCase().includes('need')) {
      intentType = 'request';
    }
    
    // Generate appropriate corporate speak based on intent while preserving key terms
    switch(intentType) {
      case 'request':
        result.push(generateRequestResponse(keyTerms));
        break;
      case 'question':
        result.push(generateQuestionResponse(keyTerms));
        break;
      default:
        result.push(generateStatementResponse(keyTerms));
    }
  }
  
  // If we have less than 2 sentences, add a generic corporate follow-up
  while (result.length < 2) {
    result.push(getRandomItem([
      "This aligns perfectly with our departmental objectives.",
      "Your compliance with procedure is appreciated.",
      "Lumon values your continued engagement with the workflow.",
      "This has been noted in your quarterly evaluation metrics.",
      "The data refinement process benefits from your participation."
    ]));
  }
  
  return result.join(' ').trim();
}

/**
 * Generates a corporate response to a  request while preserving key terms
 */
function generateRequestResponse(keyTerms) {
  const templates = [
    "Your request regarding KEY_TERMS has been acknowledged and will be processed according to protocol.",
    "I'm pleased to inform you that your KEY_TERMS inquiry has been escalated to the appropriate department for immediate action.",
    "The KEY_TERMS matter you've raised has been designated as an actionable item in our workflow queue.",
    "We at Lumon recognize the importance of your KEY_TERMS needs and will allocate resources accordingly.",
    "Your KEY_TERMS requirement has been logged in the system with optimal priority designation."
  ];
  
  return applyTemplate(templates, keyTerms);
}

/**
 * Generates a corporate response to a question while preserving key terms
 */
function generateQuestionResponse(keyTerms) {
  const templates = [
    "Regarding your inquiry about KEY_TERMS, I'm authorized to provide a clarification that aligns with company policy.",
    "The information you seek concerning KEY_TERMS is available within parameters established by the handbook.",
    "Your KEY_TERMS question has been processed, and I'm pleased to facilitate the appropriate knowledge transfer.",
    "Our department maintains comprehensive protocols around KEY_TERMS that I'm delighted to share with you.",
    "I can confirm that KEY_TERMS fall within the scope of our operational guidelines as established by the board."
  ];
  
  return applyTemplate(templates, keyTerms);
}

/**
 * Generates a corporate response to a statement while preserving key terms
 */
function generateStatementResponse(keyTerms) {
  const templates = [
    "I appreciate your perspective on KEY_TERMS, which contributes to our collective workplace harmony.",
    "Your observation regarding KEY_TERMS has been noted and will inform our procedural optimization.",
    "The KEY_TERMS information you've shared aligns with our department's ongoing strategic initiatives.",
    "We value your engagement with KEY_TERMS as it exemplifies the Lumon standard of excellence.",
    "Your statement about KEY_TERMS demonstrates the kind of workplace awareness we encourage."
  ];
  
  return applyTemplate(templates, keyTerms);
}

/**
 * Applies key terms to a template
 */
function applyTemplate(templates, keyTerms) {
  const template = getRandomItem(templates);
  const corporateKeyTerms = keyTerms.map(term => corporatize(term)).join(' and ');
  return template.replace('KEY_TERMS', corporateKeyTerms);
}

/**
 * Makes a term sound more corporate
 */
function corporatize(term) {
  // Clean the term
  term = term.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Common corporate replacements
  const corporateDict = {
    "eat": "nutritional intake",
    "food": "sustenance resources",
    "lunch": "midday nourishment period",
    "dinner": "evening sustenance allocation",
    "breakfast": "morning productivity fuel",
    "meeting": "collaborative synergy session",
    "talk": "verbal information exchange",
    "help": "procedural assistance",
    "want": "express preference for",
    "like": "indicate positive alignment with",
    "need": "require",
    "work": "productivity output",
    "problem": "operational challenge",
    "fix": "implement corrective measures for",
    "break": "temporary cessation of function",
    "change": "strategic modification",
    "update": "version enhancement",
    "new": "newly implemented",
    "old": "legacy",
    "big": "substantial",
    "small": "minimal footprint",
    "fast": "high-efficiency",
    "slow": "deliberate-paced",
    "good": "optimal",
    "bad": "sub-optimal",
    "money": "financial resources",
    "pay": "monetary compensation"
  };
  
  // If we have a direct replacement, use it
  if (corporateDict[term]) {
    return corporateDict[term];
  }
  
  // Otherwise, add a corporate adjective
  const corporateAdjectives = [
    "optimized", "strategic", "aligned", "productivity-focused",
    "sanctioned", "approved", "procedural", "workflow-oriented",
    "metric-driven", "harmonious", "refined", "standardized"
  ];
  
  return `${getRandomItem(corporateAdjectives)} ${term}`;
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
      ? improvedFallbackMilchickify(inputText)
      : await transformWithAI(inputText);

    outputText.textContent = result;
    
    // Optionally display which API was used (can be removed if not wanted)
    const apiSource = document.getElementById('apiSource');
    if (apiSource) {
      apiSource.textContent = useFallbackMode 
        ? 'Using local processing' 
        : `Using ${apiProvider} AI`;
    }
    
    outputBox.classList.remove('hidden');
  } catch (error) {
    console.error('Error:', error);
    outputText.textContent = improvedFallbackMilchickify(inputText);
    
    // Update API source display on error
    const apiSource = document.getElementById('apiSource');
    if (apiSource) {
      apiSource.textContent = 'Using local processing (fallback)';
    }
    
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
  
  // Optional: Add API source indicator element if it doesn't exist
  if (!document.getElementById('apiSource')) {
    const outputBox = document.getElementById('outputBox');
    if (outputBox) {
      const sourceIndicator = document.createElement('div');
      sourceIndicator.id = 'apiSource';
      sourceIndicator.className = 'api-source';
      sourceIndicator.style.fontSize = '0.7rem';
      sourceIndicator.style.color = '#666';
      sourceIndicator.style.textAlign = 'center';
      sourceIndicator.style.marginTop = '0.5rem';
      sourceIndicator.textContent = 'Using OpenAI AI';
      outputBox.appendChild(sourceIndicator);
    }
  }
});