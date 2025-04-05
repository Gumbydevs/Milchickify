// API Configuration
// OpenAI (Primary)
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// Format is important - remove any "sk-proj-" prefix if the key starts with it 
const OPENAI_API_KEY = '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';
const OPENAI_MODEL = 'gpt-3.5-turbo'; // Most cost-effective option

// Hugging Face (Backup) - Using free models that don't require paid access
const PRIMARY_API_URL = 'https://api-inference.huggingface.co/models/gpt2';
const BACKUP_API_URL = 'https://api-inference.huggingface.co/models/distilgpt2';
const HF_API_KEY = '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';

// UI state variables
let isProcessing = false;
let useFallbackMode = false; // Start with AI mode enabled
let apiProvider = 'local'; // 'openai', 'huggingface', or 'local'

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
 * Fallback responses for common inputs
 */
const presetResponses = {
  "break": "Your temporary productivity pause request has been acknowledged and processed accordingly. Please note that optimal refueling intervals are critical to maintaining peak workplace efficiency metrics.",
  "lunch": "Your midday nutritional intake period has been scheduled in accordance with departmental guidelines. The sustenance acquisition and consumption process is essential for maintaining optimal performance levels throughout the workday.",
  "tired": "I've noted your current sub-optimal energy state in your personnel file for further evaluation. Remember that Lumon provides precisely calibrated wellness sessions designed to reinvigorate your productivity matrix.",
  "vacation": "Your temporary workplace absence request has been forwarded to the appropriate channels for procedural review. Please be advised that all schedule modifications must align with departmental harmony protocols as outlined in section 5.7 of your handbook.",
  "sick": "Your temporary physiological disruption has been documented in our wellness tracking system. Lumon values your prompt return to optimal functionality in accordance with established health and productivity guidelines.",
  "quit": "I must inform you that separation discussions require formal documentation through established departmental channels. Your continued contribution to our collective workplace harmony remains highly valued by Lumon management.",
  "hello": "I'm delighted to acknowledge your communicative initiation in accordance with established greeting protocols. Your engagement contributes significantly to our departmental cohesion metrics.",
  "meeting": "Your collaborative synergy session has been documented in our enterprise scheduling framework. These strategic alignment gatherings are essential for maintaining optimal cross-functional workflow dynamics.",
  "weekend": "I'm pleased to confirm your upcoming scheduled non-work period in alignment with standard temporal allocation protocols. Such restorative intervals are designed to optimize subsequent productivity metrics.",
  "salary": "Your inquiry regarding financial compensation structures has been directed to our appropriate resource allocation department. All monetary disbursement decisions are made in accordance with Lumon's comprehensive performance evaluation framework."
};

/**
 * Function to check for preset responses based on keywords
 * More specific matching to avoid over-triggering on common words
 */
function checkForPresetResponse(text) {
  // Make it more accurate by checking for more specific matches
  const lowerText = text.toLowerCase().trim();
  
  // Only match exact phrases or phrases where the keyword is a substantial part
  const exactMatches = {
    "break": ["need a break", "can i take a break", "give me a break"],
    "lunch": ["lunch time", "lunch break", "when is lunch"],
    "tired": ["i am tired", "i'm tired", "feeling tired"],
    "vacation": ["vacation time", "need vacation", "want vacation"],
    "sick": ["i am sick", "i'm sick", "feeling sick"],
    "quit": ["i quit", "want to quit", "i'm quitting"],
    "hello": ["hello", "hi there", "greetings"],
    "meeting": ["schedule meeting", "about the meeting", "in the meeting"],
    "weekend": ["this weekend", "for the weekend", "on weekend"],
    "salary": ["about salary", "my salary", "salary increase"]
  };
  
  // Check for exact matches or substantial matches
  for (const [keyword, phrases] of Object.entries(exactMatches)) {
    // Check for exact matches to any of the phrases
    if (phrases.some(phrase => lowerText === phrase || 
                    lowerText.startsWith(phrase + " ") || 
                    lowerText.endsWith(" " + phrase) ||
                    lowerText.includes(" " + phrase + " "))) {
      return presetResponses[keyword];
    }
  }
  
  // If we're here, no strong match was found
  return null;
}

/**
 * Transform text using OpenAI
 */
async function transformWithOpenAI(text) {
  try {
    console.log("Attempting OpenAI API call...");
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
      console.log(`OpenAI API request failed with status ${response.status}`);
      throw new Error(`OpenAI API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("OpenAI response received successfully");
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
  const prompt = `Transform this text into corporate bureaucratic language like Milchick from Severance: "${text}" ${randomParam}`;

  try {
    console.log("Attempting Hugging Face API call...");
    // Try primary model (gpt2)
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
          max_new_tokens: 100,
          temperature: 0.8,
          return_full_text: false
        }
      })
    });

    // If primary fails, try backup model (distilgpt2)
    if (!response.ok) {
      console.log("Primary HF model failed, trying backup model...");
      
      response = await fetch(BACKUP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          inputs: prompt,
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

    // Process into proper Milchick format
    // This extra step is needed because gpt2/distilgpt2 don't follow instructions as well
    const processedText = enhanceFallbackOutput(generatedText, text);
    return processedText;
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    return null;
  }
}

/**
 * Takes raw HuggingFace output and enhances it to follow Milchick format better
 */
function enhanceFallbackOutput(rawOutput, originalText) {
  // Extract any useful corporate phrases from the raw output
  const sentences = rawOutput.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length >= 2) {
    // If we got at least 2 sentences, use them but ensure proper format
    let result = sentences.slice(0, 2).map(s => s.trim()).join('. ');
    if (!result.endsWith('.')) result += '.';
    return result;
  } else {
    // If we didn't get good sentences, use enhanced fallback
    return enhancedFallbackMilchickify(originalText);
  }
}

/**
 * Transforms text using available APIs or falls back to local implementation
 */
async function transformWithAI(text) {
  try {
    // Only check for preset responses if there's a very specific match
    const presetResponse = checkForPresetResponse(text);
    if (presetResponse) {
      console.log("Using preset response for exact match");
      apiProvider = 'preset';
      return presetResponse;
    }
    
    // Try OpenAI
    apiProvider = 'openai';
    console.log("Trying OpenAI...");
    let result = await transformWithOpenAI(text);
    
    // If OpenAI fails, try Hugging Face
    if (!result) {
      apiProvider = 'huggingface';
      console.log("OpenAI failed, trying Hugging Face...");
      result = await transformWithHuggingFace(text);
    }
    
    // Only fall back to local processing if both APIs fail
    if (!result) {
      apiProvider = 'local';
      console.log("All APIs failed, using enhanced fallback...");
      result = enhancedFallbackMilchickify(text);
    }
    
    return result;
  } catch (error) {
    console.error("API Error:", error);
    apiProvider = 'local';
    return enhancedFallbackMilchickify(text);
  }
}

/**
 * Enhanced fallback function that gives AI-like results without API calls
 */
function enhancedFallbackMilchickify(text) {
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

  // Add a period if there isn't one
  if (!cleanText.endsWith('.') && !cleanText.endsWith('?') && !cleanText.endsWith('!')) {
    cleanText += '.';
  }

  // Break the input into sentences
  const sentences = cleanText.split(/(?<=[.!?])\s+/);
  
  // Generate two Milchick-style sentences
  const generatedSentences = [];
  
  // Process up to 2 sentences from the input
  for (let i = 0; i < Math.min(2, sentences.length); i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    // Determine the type of sentence
    const type = determineInputType(sentence);
    
    // Get key terms from the sentence
    const keyTerms = extractKeyTerms(sentence);
    
    // Generate appropriate response based on sentence type
    generatedSentences.push(generateSentenceByType(type, keyTerms));
  }
  
  // If we don't have 2 sentences yet, add generic corporate sentences
  while (generatedSentences.length < 2) {
    generatedSentences.push(generateGenericMilchickSentence());
  }
  
  // Return exactly 2 sentences
  return generatedSentences.slice(0, 2).join(' ');
}

/**
 * Determines the type of input (question, request, complaint, etc.)
 */
function determineInputType(text) {
  const lowerText = text.toLowerCase();
  
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

/**
 * Extracts key terms from a sentence for more relevant responses
 */
function extractKeyTerms(sentence) {
  // Remove common stop words
  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 
                    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 
                    'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must', 
                    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 
                    'this', 'that', 'these', 'those'];
  
  // Extract words, remove punctuation
  const words = sentence.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  
  // Filter out stop words and very short words
  const keyWords = words.filter(word => !stopWords.includes(word) && word.length > 2);
  
  // Take up to 3 key words
  return keyWords.slice(0, 3);
}

/**
 * Generates a sentence based on input type and key terms
 */
function generateSentenceByType(type, keyTerms) {
  // Make terms more corporate
  const corporateTerms = keyTerms.map(corporatize);
  
  // Choose a random term for focus
  const focusTerm = corporateTerms.length > 0 ? getRandomItem(corporateTerms) : 'procedural matter';
  
  switch(type) {
    case 'question':
      return getRandomItem([
        `I'm pleased to provide clarification regarding ${focusTerm} in accordance with departmental communication protocols.`,
        `Your inquiry about ${focusTerm} has been processed through our knowledge transfer system with optimal efficacy.`,
        `The ${focusTerm} information you seek is accessible within parameters established by section 4.3 of the handbook.`,
        `I'm authorized to convey that ${focusTerm} falls within the scope of approved operational guidelines as determined by management.`,
        `Our department maintains comprehensive documentation on ${focusTerm} which I'm delighted to verbally summarize for your benefit.`
      ]);
      
    case 'request':
      return getRandomItem([
        `Your request concerning ${focusTerm} has been logged in our procedural management system with appropriate priority designation.`,
        `I've initiated the formal protocol to process your ${focusTerm} requirements through the proper administrative channels.`,
        `Your ${focusTerm} request has been acknowledged and will be allocated appropriate resources in accordance with departmental guidelines.`,
        `The system has registered your ${focusTerm} request which will be addressed according to established workflow optimization procedures.`,
        `I'm pleased to facilitate your ${focusTerm} requirement in accordance with our commitment to interdepartmental harmony.`
      ]);
      
    case 'complaint':
      return getRandomItem([
        `I acknowledge your concerns regarding ${focusTerm} and have initiated a proper investigation through our designated resolution channels.`,
        `Your feedback about ${focusTerm} has been documented as an actionable item in our continuous improvement framework.`,
        `The ${focusTerm} matter you've identified has been escalated to the appropriate team for prompt operational recalibration.`,
        `Our department takes your ${focusTerm} concerns seriously and has implemented appropriate remediation protocols.`,
        `I appreciate you bringing this ${focusTerm} situation to my attention as it enables our quality assurance mechanisms to function optimally.`
      ]);
      
    case 'appreciation':
      return getRandomItem([
        `Your positive acknowledgment of ${focusTerm} contributes significantly to our workplace harmony metrics.`,
        `I'm pleased to document your satisfaction with ${focusTerm} in our departmental performance evaluation system.`,
        `Your appreciation for ${focusTerm} reflects the kind of collaborative spirit that Lumon seeks to cultivate.`,
        `The gratitude you've expressed regarding ${focusTerm} exemplifies the mutually beneficial relationship we strive to maintain.`,
        `I'll ensure your positive feedback about ${focusTerm} is noted in our interdepartmental communications report.`
      ]);
      
    case 'greeting':
      return getRandomItem([
        `I'm delighted to acknowledge your communicative initiation in accordance with established greeting protocols.`,
        `Your engagement with proper interpersonal acknowledgment procedures is most appreciated and duly noted.`,
        `I extend an optimally calibrated welcome response that aligns with our departmental communication standards.`,
        `It's a pleasure to participate in this preliminary verbal exchange that establishes our productive dialog framework.`,
        `I acknowledge your greeting and am prepared to facilitate a productive communicative exchange in accordance with company policy.`
      ]);
      
    case 'statement':
    default:
      return getRandomItem([
        `I appreciate your perspective on ${focusTerm}, which has been documented in our informational database.`,
        `Your observation regarding ${focusTerm} aligns with our department's ongoing strategic initiatives for operational excellence.`,
        `The information you've shared about ${focusTerm} contributes valuable insights to our collective knowledge repository.`,
        `I've noted your statement concerning ${focusTerm} which demonstrates commendable awareness of our procedural frameworks.`,
        `Your commentary on ${focusTerm} has been processed and categorized according to our information management protocols.`
      ]);
  }
}

/**
 * Generates a generic Milchick-style sentence
 */
function generateGenericMilchickSentence() {
  return getRandomItem([
    "This aligns perfectly with our departmental objectives and workplace harmony principles.",
    "Your compliance with procedural guidelines is appreciated and has been noted in your file.",
    "Lumon values your continued engagement with our established workflow optimization framework.",
    "This interaction has been logged in your quarterly evaluation metrics for future reference.",
    "The data refinement process benefits from your participation and procedural adherence.",
    "Your contribution to interdepartmental cohesion is both recognized and appreciated.",
    "This exchange exemplifies the kind of collaborative efficiency that Lumon encourages.",
    "Please be assured that all appropriate protocols are being followed in this matter.",
    "Rest assured that your input has been processed according to established guidelines.",
    "Your continued commitment to operational excellence reflects positively on your department."
  ]);
}

/**
 * Makes a term sound more corporate
 */
function corporatize(term) {
  // Clean the term
  term = term.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Common corporate replacements
  const corporateDict = {
    "eat": "nutritional intake protocol",
    "food": "sustenance resources",
    "lunch": "midday nourishment period",
    "dinner": "evening sustenance allocation",
    "breakfast": "morning productivity fuel",
    "meeting": "collaborative synergy session",
    "talk": "verbal information exchange",
    "help": "procedural assistance",
    "want": "expressed preference",
    "like": "positive alignment indicator",
    "need": "operational requirement",
    "work": "productivity output",
    "problem": "operational challenge",
    "fix": "remediation implementation",
    "break": "temporary workflow cessation",
    "change": "strategic modification",
    "update": "version enhancement",
    "new": "newly implemented resource",
    "old": "legacy system component",
    "big": "substantial-scale element",
    "small": "minimal-footprint component",
    "fast": "high-efficiency process",
    "slow": "deliberate-paced procedure",
    "good": "optimal-status indicator",
    "bad": "sub-optimal condition marker",
    "money": "financial resource allocation",
    "pay": "monetary compensation system",
    "home": "residential endpoint location",
    "office": "productivity environment",
    "computer": "data processing terminal",
    "phone": "communication device",
    "email": "digital correspondence protocol",
    "report": "information aggregation document",
    "manager": "departmental oversight facilitator",
    "team": "collaborative efficiency unit",
    "project": "strategic initiative implementation",
    "deadline": "temporal completion parameter",
    "customer": "external value recipient",
    "product": "market-facing deliverable",
    "service": "value-delivery mechanism",
    "quality": "excellence adherence metric",
    "time": "chronological resource allocation",
    "day": "operational time segment",
    "week": "multi-day productivity cycle",
    "month": "extended planning timeframe",
    "year": "annual performance period",
    "plan": "strategic operational framework",
    "goal": "targeted outcome parameter",
    "result": "procedural consequence metric"
  };
  
  // If we have a direct replacement, use it
  if (corporateDict[term]) {
    return corporateDict[term];
  }
  
  // Otherwise, add a corporate adjective
  const corporateAdjectives = [
    "optimized", "strategic", "aligned", "productivity-focused",
    "sanctioned", "approved", "procedural", "workflow-oriented",
    "metric-driven", "harmonious", "refined", "standardized",
    "integrated", "cross-functional", "value-added", "synergistic",
    "resource-appropriate", "quality-assured", "performance-enhanced",
    "enterprise-level", "efficiency-optimized", "protocol-compliant"
  ];
  
  return `${getRandomItem(corporateAdjectives)} ${term} protocol`;
}

/**
 * Extract meaningful phrases from text
 */
function extractPhrases(text) {
  const lowerText = text.toLowerCase();
  const commonPhrases = [
    "take a break", "need a break", "would like a break", "want a break",
    "go home", "leave work", "leave early",
    "day off", "time off", "vacation day", "sick day",
    "more money", "pay raise", "salary increase", "promotion",
    "new job", "quit job", "resign", "leave company",
    "schedule meeting", "set up meeting", "have meeting",
    "need help", "would like help", "want assistance"
  ];
  
  const foundPhrases = [];
  for (const phrase of commonPhrases) {
    if (lowerText.includes(phrase)) {
      foundPhrases.push(phrase);
    }
  }
  
  return foundPhrases;
}

/**
 * Generate response based on phrases instead of individual words
 */
function generateResponseFromPhrases(phrases, originalText) {
  // Map phrases to more suitable corporate replacements
  const phraseReplacements = {
    "take a break": "temporary productivity pause",
    "need a break": "productivity interval recalibration",
    "would like a break": "brief workflow cessation",
    "want a break": "momentary task suspension",
    "go home": "conclude on-site presence",
    "leave work": "transition to off-site status",
    "leave early": "modified temporal endpoint",
    "day off": "scheduled non-productivity interval",
    "time off": "authorized absence period",
    "vacation day": "extended wellness allocation",
    "sick day": "health restoration protocol",
    "more money": "compensation adjustment",
    "pay raise": "financial incentive enhancement",
    "salary increase": "monetary recognition upgrade",
    "promotion": "vertical role realignment",
    "new job": "position reconfiguration",
    "quit job": "employment relationship conclusion",
    "resign": "professional disengagement process",
    "leave company": "organizational separation",
    "schedule meeting": "collaborative synergy session arrangement",
    "set up meeting": "interpersonal alignment coordination",
    "have meeting": "information exchange assembly",
    "need help": "assistance requirement",
    "would like help": "support service request",
    "want assistance": "facilitation needs"
  };
  
  // Select the most significant phrase
  const mainPhrase = phrases[0];
  const corporatePhrase = phraseReplacements[mainPhrase] || mainPhrase;
  
  // Generate response based on the type of phrase
  if (mainPhrase.includes("break") || mainPhrase.includes("leave") || mainPhrase.includes("home")) {
    return `Your request for a ${corporatePhrase} has been logged in our workflow management system with appropriate priority designation. Please be advised that all temporary productivity adjustments must align with departmental harmony metrics as outlined in section 4.3 of your handbook.`;
  }
  
  if (mainPhrase.includes("off") || mainPhrase.includes("vacation") || mainPhrase.includes("sick")) {
    return `I've submitted your ${corporatePhrase} request to the appropriate administrative channels for procedural review and approval. Lumon values your commitment to advance notification of scheduled non-productivity intervals in alignment with our operational excellence framework.`;
  }
  
  if (mainPhrase.includes("money") || mainPhrase.includes("pay") || mainPhrase.includes("salary") || mainPhrase.includes("promotion")) {
    return `Your ${corporatePhrase} inquiry has been documented and will be addressed during your next quarterly assessment cycle. Please be assured that all compensation adjustments are processed in strict accordance with Lumon's comprehensive performance evaluation metrics.`;
  }
  
  if (mainPhrase.includes("quit") || mainPhrase.includes("resign") || mainPhrase.includes("leave company")) {
    return `I must inform you that ${corporatePhrase} discussions require completion of standard documentation through established channels as outlined in your onboarding materials. Your continued contribution to our collective enterprise remains highly valued by management and the board.`;
  }
  
  if (mainPhrase.includes("meeting") || mainPhrase.includes("schedule")) {
    return `Your request to initiate a ${corporatePhrase} has been registered in our enterprise calendar management protocol. All participants will receive appropriate notification in alignment with our interdepartmental communication guidelines.`;
  }
  
  if (mainPhrase.includes("help") || mainPhrase.includes("assistance")) {
    return `I'm pleased to acknowledge your ${corporatePhrase} and have allocated appropriate resources to address your current needs. Lumon is committed to providing optimized support structures to ensure maximum departmental harmony and productivity.`;
  }
  
  // Default response if no specific category is matched
  return `Your communication regarding ${corporatePhrase} has been processed according to standard protocols. All subsequent actions will proceed in alignment with departmental guidelines and Lumon's operational excellence framework.`;
}

/**
 * Generates a corporate response to a request while preserving key terms
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
 * Generates a corporate response  to a question while preserving key terms
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
    let result;
    
    if (useFallbackMode) {
      // Use enhanced fallback directly in fallback mode
      result = enhancedFallbackMilchickify(inputText);
      apiProvider = 'local';
    } else {
      // In AI mode, try APIs first but with better fallback
      try {
        // First try OpenAI
        apiProvider = 'openai';
        console.log("Trying OpenAI...");
        result = await transformWithOpenAI(inputText);
        
        // If OpenAI fails, try Hugging Face
        if (!result) {
          apiProvider = 'huggingface';
          console.log("OpenAI failed, trying Hugging Face...");
          result = await transformWithHuggingFace(inputText);
        }
      } catch (error) {
        console.error("API Error:", error);
        result = null;
      }
      
      // If APIs fail, use enhanced fallback
      if (!result) {
        apiProvider = 'local';
        console.log("All APIs failed, using enhanced fallback...");
        result = enhancedFallbackMilchickify(inputText);
      }
    }

    outputText.textContent = result;
    
    // Optionally display which API was used
    const apiSource = document.getElementById('apiSource');
    if (apiSource) {
      let sourceText = 'Using enhanced local processing';
      if (!useFallbackMode && apiProvider !== 'local') {
        if (apiProvider === 'openai') sourceText = 'Using OpenAI';
        else if (apiProvider === 'huggingface') sourceText = 'Using Hugging Face';
        else if (apiProvider === 'preset') sourceText = 'Using preset response';
      }
      apiSource.textContent = sourceText;
    }
    
    outputBox.classList.remove('hidden');
  } catch (error) {
    console.error('Error:', error);
    // Always use enhanced fallback on errors
    outputText.textContent = enhancedFallbackMilchickify(inputText);
    
    // Update API source display on error
    const apiSource = document.getElementById('apiSource');
    if (apiSource) {
      apiSource.textContent = 'Using enhanced local processing (fallback)';
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
    toggleBtn.classList.toggle('fallback-mode', useFallbackMode);
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
      sourceIndicator.textContent = 'Using local processing';
      outputBox.appendChild(sourceIndicator);
    }
  }
});