// Update the determineInputType function to be more specific
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

  // Standard checks from the original code
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

// Add this function to improve keyword extraction based on input type
function getImprovedKeywords(text, type) {
  let lowerText = text.toLowerCase();
  let keywords = [];
  
  // Extract keywords specific to the input type
  switch(type) {
    case 'positive_sentiment':
      if (lowerText.match(/happy|glad|enjoy|like|love/)) {
        keywords.push('employee_satisfaction');
      }
      if (lowerText.match(/work|job|role|position/)) {
        keywords.push('work_environment');
      }
      if (lowerText.match(/team|colleague|coworker|department/)) {
        keywords.push('team_dynamics');
      }
      if (lowerText.match(/project|task|assignment/)) {
        keywords.push('productivity');
      }
      break;
      
    case 'negative_sentiment':
      if (lowerText.match(/unhappy|sad|dislike|hate/)) {
        keywords.push('employee_concern');
      }
      if (lowerText.match(/work|job|role|position/)) {
        keywords.push('work_environment');
      }
      if (lowerText.match(/team|colleague|coworker|department/)) {
        keywords.push('team_dynamics');
      }
      if (lowerText.match(/project|task|assignment/)) {
        keywords.push('productivity');
      }
      break;
      
    case 'work_related':
      if (lowerText.match(/project|assignment|task/)) {
        keywords.push('deliverable');
      }
      if (lowerText.match(/deadline|time|schedule/)) {
        keywords.push('timeline');
      }
      if (lowerText.match(/team|collaborate|help/)) {
        keywords.push('teamwork');
      }
      if (lowerText.match(/finish|complete|done/)) {
        keywords.push('completion');
      }
      break;
    
    case 'suggestion':
      if (lowerText.match(/suggest|idea|think/)) {
        keywords.push('innovation');
      }
      if (lowerText.match(/improve|better|enhance/)) {
        keywords.push('optimization');
      }
      if (lowerText.match(/process|procedure|system/)) {
        keywords.push('workflow');
      }
      break;
  }
  
  // If we didn't find specialized keywords, use the generic extraction
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

// Update the enhancedFallbackMilchickify function to use our improved keywords
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
  
  // Check if the text matches any template in our dictionary
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
  
  // Generate two Milchick-style sentences
  const generatedSentences = [];
  
  // Process up to 2 sentences from the input
  for (let i = 0; i < Math.min(2, sentences.length); i++) {
    const sentence = sentences[i].trim();
    if (!sentence) continue;
    
    // Determine the type of sentence
    const type = determineInputType(sentence);
    
    // Get improved keywords based on the type
    const keyTerms = getImprovedKeywords(sentence, type);
    
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

// Update generateSentenceByType to include the new sentence types
function generateSentenceByType(type, keyTerms) {
  // Make terms more corporate
  const corporateTerms = keyTerms.map(corporatize);
  
  // Choose a random term for focus
  const focusTerm = corporateTerms.length > 0 ? getRandomItem(corporateTerms) : 'procedural matter';
  
  // Access our expanded response templates if they're available
  if (window.milchickDictionary && window.milchickDictionary.responseTemplates && 
      window.milchickDictionary.responseTemplates[type]) {
    return getRandomItem(window.milchickDictionary.responseTemplates[type])
      .replace('${focusTerm}', focusTerm);
  }
  
  // Fall back to original templates if dictionary not loaded
  switch(type) {
    case 'positive_sentiment':
      return getRandomItem([
        `I'm delighted to document your positive sentiment regarding ${focusTerm} which will reflect favorably in your quarterly evaluation metrics.`,
        `Your expression of workplace satisfaction concerning ${focusTerm} has been noted and contributes significantly to our departmental harmony index.`,
        `We at Lumon value your optimistic engagement with ${focusTerm} as it exemplifies the kind of attitude that facilitates peak productivity outcomes.`,
        `Your contentment with ${focusTerm} aligns perfectly with our core values of workplace fulfillment and organizational cohesion.`,
        `The positive outlook you've demonstrated toward ${focusTerm} will be recognized during your upcoming wellness assessment.`
      ]);
      
    case 'negative_sentiment':
      return getRandomItem([
        `I've documented your concerns regarding ${focusTerm} and have initiated appropriate procedural remediation protocols.`,
        `Your feedback about ${focusTerm} has been processed through our sentiment analysis framework for appropriate action.`,
        `We take all employee experiential data points concerning ${focusTerm} very seriously and will implement necessary adjustments.`,
        `Your expressed dissatisfaction with ${focusTerm} has been escalated to the appropriate departmental oversight committee.`,
        `I appreciate your candor regarding ${focusTerm} as it enables our continuous improvement mechanisms to function optimally.`
      ]);
      
    case 'work_related':
      return getRandomItem([
        `Your ${focusTerm} status has been updated in our enterprise project management system with appropriate priority designation.`,
        `I'm pleased to confirm that all ${focusTerm} parameters have been configured according to departmental standards and expectations.`,
        `The ${focusTerm} metrics have been logged in our performance tracking database for ongoing monitoring and evaluation.`,
        `We've allocated additional resources to ensure optimal ${focusTerm} outcomes in alignment with strategic objectives.`,
        `Your engagement with ${focusTerm} demonstrates the kind of procedural adherence that Lumon values in its workforce.`
      ]);
      
    case 'suggestion':
      return getRandomItem([
        `Your ${focusTerm} proposal has been documented in our continuous improvement database for evaluation by the appropriate committee.`,
        `I appreciate your contribution to our ${focusTerm} optimization initiative which demonstrates commendable organizational awareness.`,
        `Your suggestion regarding ${focusTerm} will be assessed according to our standard innovation protocol framework.`,
        `We value your input concerning ${focusTerm} as it contributes to our collective goal of operational excellence.`,
        `The ${focusTerm} enhancement you've proposed will be reviewed during our next procedural refinement session.`
      ]);
      
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