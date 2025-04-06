/**
 * Milchick Dictionary - Expanded response templates for better local processing
 * 
 * This file significantly enhances the local processing capabilities by providing:
 * 1. A large set of exact phrase matches
 * 2. Regular expression patterns to match common input types
 * 3. Thematic keyword clusters to better categorize inputs
 * 4. Expanded response templates for each sentence type
 */

// Create a global dictionary object
window.milchickDictionary = {
    // Exact matches for common phrases (case-insensitive)
    exactMatches: {
      "i'm happy to be working here": "I'm delighted to document your positive workplace sentiment in our employee satisfaction database. Your engagement with the Lumon professional ecosystem contributes significantly to our departmental harmony metrics.",
      "i love this job": "Your expressed workplace enthusiasm has been noted in your personnel file and will reflect favorably in your quarterly evaluation. Such positive sentiment aligns perfectly with Lumon's core values of employee contentment and organizational alignment.",
      "i hate this job": "I've documented your feedback in our employee experience monitoring system for appropriate review by administrative personnel. Rest assured that all worker sentiment data points are processed in accordance with Lumon's continuous improvement framework.",
      "this sucks": "I acknowledge your concise negative feedback which has been categorized as an experiential anomaly requiring further investigation. A sentiment recalibration specialist will be assigned to assess and remediate your workplace satisfaction metrics.",
      "i need help": "Your assistance request has been logged in our procedural support system with appropriate priority designation. Lumon is committed to providing optimized facilitation resources to ensure maximum productivity and departmental harmony.",
      "what time is lunch": "The designated nutritional intake interval is scheduled according to departmental guidelines as outlined in section 5.3 of your handbook. Your compliance with standardized sustenance acquisition protocols is appreciated and contributes to operational efficiency.",
      "when can i go home": "Your query regarding daily endpoint transition has been received and processed according to established temporal allocation guidelines. Please be reminded that all scheduled non-workplace intervals are determined in alignment with departmental productivity optimization frameworks.",
      "good morning": "I reciprocate your chronologically-appropriate greeting in accordance with interpersonal communication protocols. Your adherence to standardized workplace salutation practices contributes to our collective professional harmony.",
      "can i ask a question": "I'm pleased to confirm that your interrogative request has been approved through our standard information exchange protocols. Please proceed with your inquiry, and I will facilitate appropriate knowledge transfer in alignment with departmental communication guidelines.",
      "the coffee machine is broken": "The beverage dispensation unit's operational disruption has been documented in our facility maintenance system for immediate attention. Temporary alternative hydration options have been implemented to ensure uninterrupted workplace refreshment capabilities.",
      "i finished my work": "Your task completion notification has been processed and logged in our productivity tracking system with appropriate timestamp documentation. This achievement will be reflected positively in your performance metrics during the next scheduled evaluation cycle.",
      "can i have a raise": "Your financial compensation adjustment inquiry has been forwarded to the appropriate resource allocation department for procedural review. Please be advised that all monetary disbursement decisions are made in accordance with Lumon's comprehensive performance evaluation framework.",
      "this is too hard": "I've documented your task difficulty assessment in our workflow calibration system for review by process optimization specialists. Lumon values your procedural feedback as it enables continuous refinement of our operational efficiency parameters."
    },
    
    // Regular expression patterns for more flexible matching
    patterns: {
      "^(?:can|could|may) i (?:have|take|get) (?:a|some|the) break": [
        "Your temporary productivity pause request has been acknowledged and processed according to established protocol. Please note that optimal refueling intervals are critical to maintaining peak workplace efficiency metrics.",
        "I've logged your request for a brief workflow cessation in our enterprise resource management system. All temporary duty suspensions must align with departmental harmony metrics as outlined in section 4.3 of your handbook."
      ],
      "^i (?:want|would like|need) to (?:leave|go home) early": [
        "Your request for modified endpoint scheduling has been submitted to the appropriate administrative channels for approval processing. All temporal adjustments must be authorized in accordance with departmental productivity optimization guidelines.",
        "I've initiated the procedural protocol for your premature daily transition request with appropriate documentation. Please standby for confirmation from workforce temporal allocation management."
      ],
      "(?:how|what) (?:do|should|can) i (?:do|complete|finish)": [
        "I'm pleased to facilitate procedural clarity regarding your current assignment in alignment with established communication protocols. The optimal methodological approach involves adhering to the stepwise progression as outlined in your departmental handbook.",
        "Your inquiry about task completion methodology has been processed through our knowledge transfer system. I'm authorized to provide clarification that aligns with Lumon's standardized operational guidelines for maximum efficiency."
      ],
      "^where (?:is|are) (?:the|my)": [
        "The location information you seek has been retrieved from our spatial resource management database for immediate dissemination. All organizational assets are positioned according to optimized accessibility protocols as determined by facilities management.",
        "I've accessed our enterprise location tracking system to provide you with precise positional data regarding your inquiry. Lumon maintains comprehensive spatial documentation to ensure efficient resource utilization."
      ]
    },
    
    // Thematic keyword clusters for better categorization
    themes: {
      "work_satisfaction": ["enjoy", "happy", "satisfied", "content", "pleased", "joy", "like"],
      "work_dissatisfaction": ["unhappy", "dissatisfied", "dislike", "hate", "upset", "frustrated", "annoyed"],
      "time_related": ["schedule", "deadline", "late", "early", "time", "hours", "duration", "when"],
      "food_related": ["hungry", "food", "eat", "lunch", "dinner", "breakfast", "meal", "snack"],
      "help_request": ["assist", "support", "guidance", "direction", "explain", "clarify", "show me"],
      "technical_issue": ["broken", "error", "problem", "bug", "glitch", "malfunction", "doesn't work"],
      "approval_request": ["permission", "allow", "authorize", "approve", "let me", "can i", "may i"],
      "process_question": ["how do i", "what's the process", "procedure", "protocol", "steps", "method"],
      "feedback_offer": ["suggest", "recommend", "idea", "opinion", "thought", "feedback", "input"],
      "complaint": ["complaint", "issue", "problem", "concerned", "worried", "dissatisfied", "unacceptable"]
    },
    
    // Responses organized by theme
    themeResponses: {
      "work_satisfaction": [
        "I'm delighted to document your positive workplace sentiment in our employee satisfaction database. Your engagement with the Lumon professional ecosystem contributes significantly to our departmental harmony metrics.",
        "Your expression of contentment with the employment environment has been noted in your quarterly evaluation file. We at Lumon value such positive attitudinal indicators as they align with our core values of workforce fulfillment.",
        "I appreciate your enthusiastic engagement with your professional responsibilities which exemplifies the Lumon standard of excellence. Your positive outlook will be recognized during the next wellness session as a model of optimal employee disposition."
      ],
      "work_dissatisfaction": [
        "I acknowledge your concerns and have initiated appropriate documentation in our employee experience monitoring system. A sentiment recalibration specialist will be assigned to assess and address your workplace satisfaction metrics.",
        "Your feedback has been processed through our continuous improvement framework and designated as an actionable item requiring interdepartmental attention. Lumon values your candor as it enables us to optimize the collective work environment.",
        "I've logged your experiential assessment in our sentiment tracking database with appropriate priority designation. Please be assured that all feedback is processed according to established protocols designed to enhance organizational harmony."
      ],
      "time_related": [
        "Your temporal inquiry has been processed according to established chronological management protocols. All schedule-related matters are handled in strict accordance with departmental productivity optimization guidelines.",
        "I'm pleased to provide clarification regarding time allocation parameters as defined by our enterprise resource management system. Lumon maintains precise chronological documentation to ensure maximum operational efficiency.",
        "The temporal information you seek has been retrieved from our scheduling database in alignment with established communication protocols. All time-based resource allocation is determined according to strategic workflow optimization frameworks."
      ],
      "food_related": [
        "Your nutritional inquiry has been processed through our sustenance management system with appropriate prioritization. Lumon recognizes that optimal caloric intake is essential for maintaining peak workforce performance metrics.",
        "I've accessed our dietary resource allocation database to address your food-related query in accordance with established protocols. All nutritional arrangements are designed to facilitate maximum employee productivity and well-being.",
        "Your reference to alimentary requirements has been noted and processed according to standard procedural guidelines. The designated nutritional intake intervals are scheduled to optimize both individual and collective operational efficiency."
      ],
      "help_request": [
        "Your assistance request has been logged in our procedural support system with appropriate priority designation. Lumon is committed to providing optimized facilitation resources to ensure maximum productivity and departmental harmony.",
        "I'm pleased to acknowledge your support requirements and have allocated appropriate resources to address your current needs. Rest assured that all procedural clarification requests are processed according to established knowledge transfer protocols.",
        "Your request for guidance has been registered in our assistance management database and will be fulfilled according to standard operating procedures. We value your commitment to seeking appropriate support channels when faced with operational uncertainties."
      ],
      "technical_issue": [
        "The operational disruption you've reported has been documented in our maintenance tracking system for immediate technical intervention. Our systems reliability team has been notified to implement appropriate remediation protocols.",
        "I acknowledge your report regarding equipment functionality deviation and have escalated it to our technical optimization department with priority status. Please be assured that all system integrity issues are addressed according to established resolution frameworks.",
        "Your notification about the technical anomaly has been processed through our incident management system with appropriate categorization. A specialized technician will be dispatched to implement standard repair procedures in accordance with departmental guidelines."
      ],
      "approval_request": [
        "Your authorization inquiry has been processed through our permission management system according to established protocols. All approval requests are evaluated based on comprehensive departmental guidelines designed to maintain operational integrity.",
        "I've initiated the standard permission verification procedure in response to your authorization request. Lumon maintains detailed protocol documentation to ensure all activity approvals align with organizational policy frameworks.",
        "Your request for procedural authorization has been logged in our administrative database with appropriate classification. All permission determinations are made in accordance with the hierarchical approval structure outlined in section 7.2 of the handbook."
      ],
      "process_question": [
        "I'm pleased to facilitate procedural clarity regarding your methodology inquiry in alignment with established communication protocols. The optimal approach involves adhering to the stepwise progression as outlined in your departmental handbook.",
        "Your process-related question has been analyzed and categorized for appropriate knowledge transfer in accordance with information dissemination guidelines. Lumon maintains comprehensive procedural documentation to ensure consistent operational execution.",
        "The procedural information you seek has been retrieved from our enterprise knowledge management system for immediate dissemination. All organizational processes are designed according to optimized efficiency parameters as determined by operations management."
      ],
      "feedback_offer": [
        "Your contribution to our continuous improvement initiative has been documented in our suggestion management system. Lumon values employee input as it enhances our collective pursuit of operational excellence and procedural optimization.",
        "I appreciate your proactive engagement with our organizational refinement process which demonstrates commendable initiative. All feedback is systematically evaluated according to our established innovation assessment framework.",
        "Your suggestion has been logged in our enterprise improvement database with appropriate categorization for review by the process enhancement committee. We recognize the value of workforce-generated insights in our ongoing pursuit of procedural excellence."
      ],
      "complaint": [
        "I acknowledge your concerns and have initiated a formal documentation process in our issue management system. All reported matters are investigated thoroughly in accordance with our comprehensive resolution protocol framework.",
        "Your feedback has been categorized as an actionable item requiring departmental attention and entered into our continuous improvement database. Lumon takes all employee concerns seriously and addresses them through established remediation channels.",
        "I've logged your reported issue in our organizational experience monitoring system with appropriate priority designation. A specialized resolution facilitator will be assigned to assess and address the situation according to standard protocols."
      ]
    },
    
    // Expanded response templates by sentence type
    responseTemplates: {
      "positive_sentiment": [
        "I'm delighted to document your positive sentiment regarding ${focusTerm} which will reflect favorably in your quarterly evaluation metrics.",
        "Your expression of workplace satisfaction concerning ${focusTerm} has been noted and contributes significantly to our departmental harmony index.",
        "We at Lumon value your optimistic engagement with ${focusTerm} as it exemplifies the kind of attitude that facilitates peak productivity outcomes.",
        "Your contentment with ${focusTerm} aligns perfectly with our core values of workplace fulfillment and organizational cohesion.",
        "The positive outlook you've demonstrated toward ${focusTerm} will be recognized during your upcoming wellness assessment.",
        "I've logged your affirmative feedback about ${focusTerm} in our employee experience database for appropriate recognition.",
        "Your enthusiasm regarding ${focusTerm} exemplifies the kind of workplace engagement that Lumon seeks to foster throughout the organization.",
        "The satisfaction you've expressed with ${focusTerm} contributes to our collective goal of maintaining optimal morale metrics.",
        "I appreciate your positive perspective on ${focusTerm} which enhances our departmental psychological wellness indicators.",
        "Your favorable assessment of ${focusTerm} has been documented in accordance with our sentiment tracking protocols."
      ],
      
      "negative_sentiment": [
        "I've documented your concerns regarding ${focusTerm} and have initiated appropriate procedural remediation protocols.",
        "Your feedback about ${focusTerm} has been processed through our sentiment analysis framework for appropriate action.",
        "We take all employee experiential data points concerning ${focusTerm} very seriously and will implement necessary adjustments.",
        "Your expressed dissatisfaction with ${focusTerm} has been escalated to the appropriate departmental oversight committee.",
        "I appreciate your candor regarding ${focusTerm} as it enables our continuous improvement mechanisms to function optimally.",
        "The issues you've identified with ${focusTerm} have been logged in our experience enhancement system for immediate attention.",
        "Your concerns about ${focusTerm} will be addressed through our standard operational recalibration procedures.",
        "I've initiated a formal review process regarding your ${focusTerm} feedback in accordance with our quality assurance guidelines.",
        "A specialized team will evaluate your input about ${focusTerm} to determine appropriate corrective measures.",
        "Your critique of ${focusTerm} provides valuable insight for our ongoing refinement of workplace systems and protocols."
      ],
      
      "work_related": [
        "Your ${focusTerm} status has been updated in our enterprise project management system with appropriate priority designation.",
        "I'm pleased to confirm that all ${focusTerm} parameters have been configured according to departmental standards and expectations.",
        "The ${focusTerm} metrics have been logged in our performance tracking database for ongoing monitoring and evaluation.",
        "We've allocated additional resources to ensure optimal ${focusTerm} outcomes in alignment with strategic objectives.",
        "Your engagement with ${focusTerm} demonstrates the kind of procedural adherence that Lumon values in its workforce.",
        "The ${focusTerm} initiative has been integrated into our comprehensive workflow optimization framework for maximum efficiency.",
        "I've documented your ${focusTerm} contribution in our productivity assessment matrix with appropriate attribution.",
        "Our department recognizes the significance of your ${focusTerm} activities in the broader organizational context.",
        "The ${focusTerm} procedures you're implementing align perfectly with our established operational guidelines.",
        "I've synchronized your ${focusTerm} timeline with our enterprise scheduling system to ensure optimal resource allocation.",
      "Your current ${focusTerm} status indicates exemplary adherence to departmental efficiency standards."
    ],
    
    "suggestion": [
      "Your ${focusTerm} proposal has been documented in our continuous improvement database for evaluation by the appropriate committee.",
      "I appreciate your contribution to our ${focusTerm} optimization initiative which demonstrates commendable organizational awareness.",
      "Your suggestion regarding ${focusTerm} will be assessed according to our standard innovation protocol framework.",
      "We value your input concerning ${focusTerm} as it contributes to our collective goal of operational excellence.",
      "The ${focusTerm} enhancement you've proposed will be reviewed during our next procedural refinement session.",
      "I've forwarded your ${focusTerm} recommendation to the process improvement team for comprehensive evaluation.",
      "Your insights regarding ${focusTerm} have been logged in our innovation management system with appropriate categorization.",
      "The ${focusTerm} refinement you've suggested aligns with our ongoing pursuit of procedural optimization.",
      "I'm pleased to acknowledge your thoughtful contribution to our ${focusTerm} development initiative.",
      "Your strategic thinking about ${focusTerm} enhancement demonstrates the kind of initiative that Lumon encourages."
    ],
    
    "question": [
      "I'm pleased to provide clarification regarding ${focusTerm} in accordance with departmental communication protocols.",
      "Your inquiry about ${focusTerm} has been processed through our knowledge transfer system with optimal efficacy.",
      "The ${focusTerm} information you seek is accessible within parameters established by section 4.3 of the handbook.",
      "I'm authorized to convey that ${focusTerm} falls within the scope of approved operational guidelines as determined by management.",
      "Our department maintains comprehensive documentation on ${focusTerm} which I'm delighted to verbally summarize for your benefit.",
      "The ${focusTerm} data you've requested has been retrieved from our information management system for immediate dissemination.",
      "I've accessed our enterprise knowledge repository to address your ${focusTerm} query with maximum accuracy.",
      "Your request for ${focusTerm} clarification has been processed according to our information distribution hierarchy.",
      "Regarding your ${focusTerm} inquiry, I can provide authorized information that aligns with organizational disclosure parameters.",
      "The ${focusTerm} details you seek have been extracted from our departmental documentation for appropriate knowledge transfer."
    ],
    
    "request": [
      "Your request concerning ${focusTerm} has been logged in our procedural management system with appropriate priority designation.",
      "I've initiated the formal protocol to process your ${focusTerm} requirements through the proper administrative channels.",
      "Your ${focusTerm} request has been acknowledged and will be allocated appropriate resources in accordance with departmental guidelines.",
      "The system has registered your ${focusTerm} request which will be addressed according to established workflow optimization procedures.",
      "I'm pleased to facilitate your ${focusTerm} requirement in accordance with our commitment to interdepartmental harmony.",
      "Your ${focusTerm} request has been categorized and entered into our task allocation matrix for appropriate fulfillment.",
      "I've documented your need for ${focusTerm} assistance in our service request tracking system with suitable classification.",
      "Our department will coordinate the necessary resources to address your ${focusTerm} requirements efficiently.",
      "I've escalated your ${focusTerm} request to the appropriate fulfillment team for expedited processing.",
      "Your formal request for ${focusTerm} has been received and will be processed according to standard operational procedures."
    ],
    
    "complaint": [
      "I acknowledge your concerns regarding ${focusTerm} and have initiated a proper investigation through our designated resolution channels.",
      "Your feedback about ${focusTerm} has been documented as an actionable item in our continuous improvement framework.",
      "The ${focusTerm} matter you've identified has been escalated to the appropriate team for prompt operational recalibration.",
      "Our department takes your ${focusTerm} concerns seriously and has implemented appropriate remediation protocols.",
      "I appreciate you bringing this ${focusTerm} situation to my attention as it enables our quality assurance mechanisms to function optimally.",
      "Your reported issue with ${focusTerm} has been logged in our problem management system with appropriate severity classification.",
      "I've initiated a formal review process regarding the ${focusTerm} concern you've raised in accordance with standard protocols.",
      "A specialized resolution team will evaluate your ${focusTerm} feedback to determine appropriate corrective measures.",
      "Your complaint about ${focusTerm} provides valuable insight for our ongoing refinement of workplace systems and procedures.",
      "The ${focusTerm} issue you've identified has been flagged for immediate attention by our operational enhancement specialists."
    ],
    
    "appreciation": [
      "Your positive acknowledgment of ${focusTerm} contributes significantly to our workplace harmony metrics.",
      "I'm pleased to document your satisfaction with ${focusTerm} in our departmental performance evaluation system.",
      "Your appreciation for ${focusTerm} reflects the kind of collaborative spirit that Lumon seeks to cultivate.",
      "The gratitude you've expressed regarding ${focusTerm} exemplifies the mutually beneficial relationship we strive to maintain.",
      "I'll ensure your positive feedback about ${focusTerm} is noted in our interdepartmental communications report.",
      "Your recognition of ${focusTerm} quality has been logged in our service assessment database with appropriate attribution.",
      "I appreciate your acknowledgment of ${focusTerm} excellence which reinforces our commitment to organizational standards.",
      "Your expression of gratitude regarding ${focusTerm} has been documented in our employee interaction records.",
      "We value your positive feedback about ${focusTerm} as it validates our operational effectiveness metrics.",
      "Your commendation of ${focusTerm} has been forwarded to the appropriate personnel for recognition and reinforcement."
    ],
    
    "greeting": [
      "I'm delighted to acknowledge your communicative initiation in accordance with established greeting protocols.",
      "Your engagement with proper interpersonal acknowledgment procedures is most appreciated and duly noted.",
      "I extend an optimally calibrated welcome response that aligns with our departmental communication standards.",
      "It's a pleasure to participate in this preliminary verbal exchange that establishes our productive dialog framework.",
      "I acknowledge your greeting and am prepared to facilitate a productive communicative exchange in accordance with company policy.",
      "Your initiation of this interaction demonstrates appropriate adherence to social engagement guidelines.",
      "I reciprocate your salutation with equivalent professional courtesy as prescribed by interdepartmental relations protocols.",
      "Your communicative gesture has been received and processed according to standard interpersonal interaction procedures.",
      "I'm pleased to engage in this preliminary exchange which sets the foundation for productive information transfer.",
      "Your adherence to formal greeting etiquette contributes to our collective workplace communication harmony."
    ],
    
    "statement": [
      "I appreciate your perspective on ${focusTerm}, which has been documented in our informational database.",
      "Your observation regarding ${focusTerm} aligns with our department's ongoing strategic initiatives for operational excellence.",
      "The information you've shared about ${focusTerm} contributes valuable insights to our collective knowledge repository.",
      "I've noted your statement concerning ${focusTerm} which demonstrates commendable awareness of our procedural frameworks.",
      "Your commentary on ${focusTerm} has been processed and categorized according to our information management protocols.",
      "The ${focusTerm} assessment you've provided has been integrated into our organizational intelligence system.",
      "I've documented your perspective on ${focusTerm} in accordance with our data collection guidelines.",
      "Your analytical contribution regarding ${focusTerm} enhances our departmental understanding of relevant parameters.",
      "The ${focusTerm} information you've conveyed has been appropriately classified in our knowledge management framework.",
      "I acknowledge your statement about ${focusTerm} which has been logged for reference in future process optimizations."
    ]
  }
};

// Add common phrases for the Severance universe
window.milchickDictionary.severanceSpecific = {
  // Responses for Severance-specific terms
  "severance": "The Severance procedure represents Lumon's proprietary cognitive compartmentalization technology implemented according to the highest ethical standards. Your interest in this organizational innovation has been noted in your employee profile.",
  "innie": "I must remind you that discussion of bifurcated consciousness designations falls outside approved conversational parameters as outlined in section 8.2 of your handbook. All personnel categorization adheres to strict procedural guidelines established by management.",
  "outie": "References to external consciousness states are subject to communication restrictions as detailed in your confidentiality agreement. Please redirect your focus to workplace-appropriate topics in alignment with departmental conversation protocols.",
  "waffle party": "The incentive reward structure you've referenced is allocated based on comprehensive performance metrics and departmental contribution assessment. All recreational acknowledgments are distributed according to strictly defined achievement parameters.",
  "music dance experience": "The wellness activity you've mentioned is scheduled according to our psychological enrichment protocols and requires appropriate authorization. Such therapeutic interventions are designed to optimize workforce psychological equilibrium in alignment with productivity goals.",
  "kier": "Our founder's vision continues to guide Lumon's organizational philosophy and operational procedures in accordance with established traditions. References to executive leadership should adhere to appropriate reverence protocols as outlined in the handbook.",
  "handbook": "The comprehensive procedural documentation you've referenced contains all authorized information pertaining to workplace policies and protocols. Adherence to these guidelines ensures optimal departmental harmony and operational efficiency.",
  "numbers": "The data refinement process you've alluded to involves proprietary methodologies subject to strict confidentiality requirements. Your engagement with organizational workflows should follow established procedural parameters as defined by management.",
  "macrodata": "The specialized information processing you've referenced represents a core organizational function subject to performance-based evaluation. Your involvement with data refinement activities must adhere to departmental excellence standards.",
  "refinement": "The procedural optimization you've mentioned constitutes a fundamental operational activity aligned with Lumon's strategic objectives. All process enhancement initiatives are implemented according to established methodological frameworks.",
  "o&d": "Interdepartmental references require appropriate authorization as outlined in section 3.7 of your handbook. All organizational units operate according to segregated information protocols established by management.",
  "mdr": "Departmental designations are subject to confidentiality requirements as specified in your employment agreement. Cross-functional awareness is restricted to approved knowledge domains as determined by the information distribution hierarchy."
};

// Load any additional dictionaries or expand existing ones here
// This architecture allows for easy expansion of the dictionary in the future