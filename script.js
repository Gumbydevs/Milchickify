// Debug code to check if dictionary is loading
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, checking dictionary...');
  console.log('Dictionary loaded?', window.milchickDictionary ? 'Yes' : 'No');
  
  if (!window.milchickDictionary) {
    console.error('Dictionary not found, creating a simple one for testing');
    // Create a simple dictionary for testing
    window.milchickDictionary = {
      responseTemplates: {
        greeting: ["I acknowledge your communicative gesture according to protocol."]
      },
      exactMatches: {},
      themes: {},
      severanceSpecific: {}
    };
  }
});
// Global state for the app
let fallbackMode = false;

// Main milchickify function that gets called when the button is clicked
function milchickify() {
  const inputText = document.getElementById('inputText').value;
  const outputBox = document.getElementById('outputBox');
  const outputText = document.getElementById('outputText');
  const loadingIndicator = document.getElementById('loadingIndicator');
  
  // Check if there's any input
  if (!inputText.trim()) {
    alert('Please enter some text to milchickify!');
    return;
  }
  
  // Show loading indicator
  loadingIndicator.classList.remove('hidden');
  outputBox.classList.add('hidden');
  
  if (fallbackMode) {
    // Use the enhanced fallback mode (local processing)
    setTimeout(() => {
      const result = enhancedFallbackMilchickify(inputText);
      outputText.textContent = result;
      loadingIndicator.classList.add('hidden');
      outputBox.classList.remove('hidden');
    }, 500); // Short delay for UX
  } else {
    // Try to use API (if available and configured)
    try {
      // Check if API key exists
      const apiKey = window.ENV && window.ENV.API_KEY;
      
      if (!apiKey) {
        // No API key, fall back to local processing
        console.log("No API key found, using fallback mode");
        fallbackMode = true;
        document.getElementById('toggleModeBtn').textContent = 'Switch to API Mode';
        const result = enhancedFallbackMilchickify(inputText);
        outputText.textContent = result;
        loadingIndicator.classList.add('hidden');
        outputBox.classList.remove('hidden');
        return;
      }
      
      // Make API call (placeholder - you would need to implement actual API call)
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are Milchick from the TV show Severance. Respond to the user's text in your formal, verbose, corporate-speak style. Use terminology like 'procedural', 'departmental', 'optimization', etc. Make the response sound like it's from Lumon Industries."
            },
            {
              role: "user",
              content: inputText
            }
          ],
          max_tokens: 150
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      })
      .then(data => {
        const result = data.choices[0].message.content.trim();
        outputText.textContent = result;
        loadingIndicator.classList.add('hidden');
        outputBox.classList.remove('hidden');
      })
      .catch(error => {
        console.error('Error:', error);
        // Fall back to local processing on error
        const result = enhancedFallbackMilchickify(inputText);
        outputText.textContent = result;
        loadingIndicator.classList.add('hidden');
        outputBox.classList.remove('hidden');
      });
    } catch (error) {
      console.error('Error:', error);
      // Fall back to local processing if anything goes wrong
      const result = enhancedFallbackMilchickify(inputText);
      outputText.textContent = result;
      loadingIndicator.classList.add('hidden');
      outputBox.classList.remove('hidden');
    }
  }
}

// Function to toggle between API and fallback modes
function toggleFallbackMode() {
  fallbackMode = !fallbackMode;
  const toggleBtn = document.getElementById('toggleModeBtn');
  
  if (fallbackMode) {
    toggleBtn.textContent = 'Switch to API Mode';
  } else {
    toggleBtn.textContent = 'Switch to Basic Mode';
  }
}

// Copy the generated text to clipboard
function copyOutput() {
  const outputText = document.getElementById('outputText').textContent;
  
  // Use the clipboard API if available
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(outputText)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        fallbackCopyToClipboard(outputText);
      });
  } else {
    fallbackCopyToClipboard(outputText);
  }
}

// Fallback method for copying text when Clipboard API is not available
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert('Text copied to clipboard!');
    } else {
      alert('Failed to copy text to clipboard!');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    alert('Failed to copy text to clipboard!');
  }
  
  document.body.removeChild(textArea);
}

// Helper function to get a random item from an array
function getRandomItem(array) {
  if (!array || array.length === 0) {
    return '';
  }
  return array[Math.floor(Math.random() * array.length)];
}

// Main function to convert text to Milchick corporate speak
function enhancedFallbackMilchickify(text) {
  // Make sure we have access to the dictionary
  if (!window.milchickDictionary) {
    console.error("Milchick dictionary not loaded!");
    return "I regret to inform you that the departmental response generator is currently experiencing a temporary operational disruption. Please contact technical support for immediate assistance.";
  }

  if (!text || typeof text !== 'string') {
    return '';
  }

  // Clean and normalize the input
  let cleanText = text.trim();
  
  // First check for exact preset responses
  const presetResponse = checkForPresetResponse(cleanText);
  if (presetResponse) {
    return presetResponse;
  }
  
  // Check if the text matches any pattern in our dictionary
  const dictionaryResponse = findDictionaryMatch(cleanText);
  if (dictionaryResponse) {
    return dictionaryResponse;
  }

  // Add a period if there isn't one
  if (!cleanText.endsWith('.') && !cleanText.endsWith('?') && !cleanText.endsWith('!')) {
    cleanText += '.';
  }

  // Break the input into sentences
  const sentences = cleanText.split(/(?<=[.!?])\s+/);
  
  // Generate Milchick-style sentences
  const generatedSentences = [];
  
  // Process up to 2 sentences from the input
  for (let i = 0; i < Math.min(2, sentences.length); i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    // Determine the type of sentence
    const type = determineInputType(sentence);
    
    // Get keywords based on the type
    const keyTerms = getImprovedKeywords(sentence, type);
    
    // Generate appropriate response based on sentence type
    generatedSentences.push(generateSentenceByType(type, keyTerms));
  }
  
  // If we don't have 2 sentences yet, add generic corporate sentences
  while (generatedSentences.length < 2) {
    // Use a generic response from the dictionary's greeting templates
    const genericTemplates = window.milchickDictionary.responseTemplates.greeting || [];
    generatedSentences.push(getRandomItem(genericTemplates));
  }
  
  // Return exactly 2 sentences
  return generatedSentences.slice(0, 2).join(' ');
}

// Extract key terms from input text
function extractKeyTerms(text) {
  if (!text) return [];
  
  // Get themes from the dictionary
  const themes = window.milchickDictionary.themes || {};
  const allThemeKeywords = [];
  
  // Collect all theme keywords
  for (const themeWords of Object.values(themes)) {
    allThemeKeywords.push(...themeWords);
  }
  
  // Extract the keywords from the text
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const keyTerms = words.filter(word => 
    allThemeKeywords.includes(word) && 
    word.length > 3
  );
  
  // If no specific keywords found, extract nouns or important words
  if (keyTerms.length === 0) {
    const stopWords = ['and', 'the', 'this', 'that', 'for', 'with', 'from', 'have', 'been'];
    const potentialNouns = words.filter(word => 
      word.length > 3 && 
      !stopWords.includes(word)
    );
    
    // Take up to 2 potential important words
    return potentialNouns.slice(0, 2);
  }
  
  // Take up to 2 keywords
  return keyTerms.slice(0, 2);
}

// Function to make ordinary terms more corporate
function corporatize(term) {
  // Check if this is already a corporate term
  if (term.includes('_')) {
    // Replace underscores with spaces and add a corporate modifier
    return term.replace(/_/g, ' ');
  }
  
  // Dictionary of corporate-speak translations
  const corporateTerms = {
    'happy': 'positive workplace sentiment',
    'sad': 'negative emotional state',
    'project': 'strategic initiative',
    'work': 'procedural engagement',
    'job': 'professional assignment',
    'help': 'operational assistance',
    'problem': 'situational anomaly',
    'issue': 'procedural impediment',
    'team': 'interdepartmental unit',
    'meeting': 'collaborative synchronization',
    'email': 'digital communication',
    'talk': 'verbal exchange protocol',
    'idea': 'conceptual innovation',
    'good': 'performance-exceeding metrics',
    'bad': 'suboptimal outcome scenario',
    'report': 'data documentation artifact',
    'deadline': 'temporal completion parameter',
    'customer': 'external stakeholder entity',
    'manager': 'hierarchical oversight facilitator',
    'feedback': 'performance evaluation data',
    'salary': 'compensation allocation',
    'office': 'workspace environment',
    'training': 'skill acquisition protocol',
    'decision': 'strategic determination',
    'employee': 'human resource asset',
    'policy': 'behavioral guideline framework',
    'time': 'temporal resource allocation',
    'goal': 'targeted outcome objective',
    'chat': 'informal communication exchange',
    'call': 'verbal transmission session'
  };
  
  // Return the corporate version or make it more corporate if not in dictionary
  if (corporateTerms[term]) {
    return corporateTerms[term];
  } else if (term.length > 3) {
    // For unknown terms, add corporate modifiers
    const corporateModifiers = [
      'operational', 'strategic', 'procedural', 'departmental', 
      'organizational', 'enterprise', 'synergistic', 'systematic',
      'integrated', 'optimized', 'productivity', 'workflow', 
      'management', 'performance'
    ];
    
    // Add a corporate modifier
    const modifier = getRandomItem(corporateModifiers);
    return `${modifier} ${term}`;
  }
  
  return term;
}

// Check for preset responses from our dictionary
function checkForPresetResponse(text) {
  if (!window.milchickDictionary) {
    return null;
  }
  
  // Check Severance-specific terms
  const lowerText = text.toLowerCase().trim();
  
  // Check for Severance-specific terms first
  for (const [term, response] of Object.entries(window.milchickDictionary.severanceSpecific || {})) {
    if (lowerText.includes(term)) {
      return response;
    }
  }
  
  // Then check exact matches
  if (window.milchickDictionary.exactMatches && window.milchickDictionary.exactMatches[lowerText]) {
    return window.milchickDictionary.exactMatches[lowerText];
  }
  
  return null;
}

// Function to find matches in our expanded dictionary
function findDictionaryMatch(text) {
  if (!window.milchickDictionary || !window.milchickDictionary.patterns) {
    return null;
  }
  
  const lowerText = text.toLowerCase().trim();
  
  // Check for exact matches first
  if (window.milchickDictionary.exactMatches[lowerText]) {
    return window.milchickDictionary.exactMatches[lowerText];
  }
  
  // Then check for pattern matches
  for (const [pattern, responses] of Object.entries(window.milchickDictionary.patterns)) {
    if (new RegExp(pattern, 'i').test(lowerText)) {
      return getRandomItem(responses);
    }
  }
  
  // Check for common themes
  for (const [theme, keywords] of Object.entries(window.milchickDictionary.themes)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return getRandomItem(window.milchickDictionary.themeResponses[theme] || []);
    }
  }
  
  return null;
}

// Determine the type of input sentence
function determineInputType(text) {
  const lowerText = text.toLowerCase();
  
  // Check for positive sentiment statements
  if (lowerText.includes('happy') || lowerText.includes('glad') || 
      lowerText.includes('enjoy') || lowerText.includes('like working') ||
      lowerText.includes('love') || lowerText.includes('wonderful') ||
      lowerText.includes('great') || lowerText.includes('excited')) {
    return 'positive_sentiment';
  }
  
  // Check for negative sentiment statements
  if (lowerText.includes('unhappy') || lowerText.includes('sad') || 
      lowerText.includes('dislike') || lowerText.includes('hate') ||
      lowerText.includes('frustrated') || lowerText.includes('terrible') ||
      lowerText.includes('awful') || lowerText.includes('bad experience')) {
    return 'negative_sentiment';
  }
  
  // Add specialized handler for work-related topics
  if (lowerText.includes('project') || lowerText.includes('work on') || 
      lowerText.includes('assignment') || lowerText.includes('working on') ||
      lowerText.includes('task') || lowerText.includes('job')) {
    return 'work_related';
  }
  
  // Add specialized handler for feedback or suggestions
  if (lowerText.includes('suggest') || lowerText.includes('idea') || 
      lowerText.includes('feedback') || lowerText.includes('improve') ||
      lowerText.includes('better') || lowerText.includes('could we')) {
    return 'suggestion';
  }

  // Standard checks
  if (text.includes('?')) {
    return 'question';
  } else if (lowerText.includes('thank') || lowerText.includes('appreciate') || lowerText.includes('grateful')) {
    return 'appreciation';
  } else if (lowerText.includes('problem') || lowerText.includes('issue') || lowerText.includes('broken') || 
           lowerText.includes('doesn\'t work') || lowerText.includes('not working')) {
    return 'complaint';
  } else if (lowerText.startsWith('i want') || lowerText.startsWith('i need') || 
           lowerText.startsWith('i would like') || lowerText.startsWith('please') || 
           lowerText.startsWith('can you') || lowerText.startsWith('could you')) {
    return 'request';
  } else if (lowerText.includes('hello') || lowerText.includes('hi ') || lowerText.startsWith('hi') || 
           lowerText.includes('greetings') || lowerText.includes('good morning') || 
           lowerText.includes('good afternoon') || lowerText.includes('good evening')) {
    return 'greeting';
  } else {
    return 'statement';
  }
}

// Get keywords based on input type
function getImprovedKeywords(text, type) {
  let lowerText = text.toLowerCase();
  let keywords = [];
  
  // Check if we have themes in the dictionary
  if (window.milchickDictionary && window.milchickDictionary.themes) {
    const themes = window.milchickDictionary.themes;
    
    // Find matching themes based on keywords
    for (const [theme, themeWords] of Object.entries(themes)) {
      if (themeWords.some(word => lowerText.includes(word))) {
        keywords.push(theme);
        break; // Just use one theme
      }
    }
  }
  
  // If we didn't find themed keywords, extract based on type
  if (keywords.length === 0) {
    switch(type) {
      case 'positive_sentiment':
        if (lowerText.match(/happy|glad|enjoy|like|love/)) {
          keywords.push('employee_satisfaction');
        }
        if (lowerText.match(/work|job|role|position/)) {
          keywords.push('work_environment');
        }
        break;
        
      case 'negative_sentiment':
        if (lowerText.match(/unhappy|sad|dislike|hate/)) {
          keywords.push('employee_concern');
        }
        if (lowerText.match(/work|job|role|position/)) {
          keywords.push('work_environment');
        }
        break;
        
      case 'work_related':
        if (lowerText.match(/project|assignment|task/)) {
          keywords.push('deliverable');
        }
        if (lowerText.match(/deadline|time|schedule/)) {
          keywords.push('timeline');
        }
        break;
      
      case 'suggestion':
        if (lowerText.match(/suggest|idea|think/)) {
          keywords.push('innovation');
        }
        if (lowerText.match(/improve|better|enhance/)) {
          keywords.push('optimization');
        }
        break;
    }
  }
  
  // If we still don't have keywords, use generic extraction
  if (keywords.length === 0) {
    return extractKeyTerms(text);
  }
  
  // Add at least one generic keyword if we have space
  if (keywords.length < 2) {
    const genericTerms = extractKeyTerms(text);
    if (genericTerms.length > 0) {
      keywords.push(genericTerms[0]);
    }
  }
  
  return keywords;
}

// Generate a sentence based on input type and keywords
function generateSentenceByType(type, keyTerms) {
  // Make terms more corporate
  const corporateTerms = keyTerms.map(corporatize);
  
  // Choose a random term for focus
  const focusTerm = corporateTerms.length > 0 ? getRandomItem(corporateTerms) : 'procedural matter';
  
  // Access our templates from the dictionary
  if (window.milchickDictionary && window.milchickDictionary.responseTemplates && 
      window.milchickDictionary.responseTemplates[type]) {
    const template = getRandomItem(window.milchickDictionary.responseTemplates[type]);
    return template.replace('${focusTerm}', focusTerm);
  }
  
  // Fallback if templates aren't available
  return `Your ${focusTerm} has been processed according to established departmental protocols.`;
}