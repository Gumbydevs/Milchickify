// Environment variables template for the Milchickify app
window.ENV = {
    // API keys - will be set by deployment platform
    API_KEY: process.env.NEXT_PUBLIC_OpenAI || '', 
    HF_KEY: process.env.NEXT_PUBLIC_HuggingFace || '',
    
    // Configuration settings
    MODEL: "gpt-3.5-turbo",
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7,
    
    // Endpoint configuration
    ENDPOINT: "https://api.openai.com/v1/chat/completions"
};

// Load environment variables from meta tags if available
document.addEventListener('DOMContentLoaded', () => {
    const openAiMeta = document.querySelector('meta[name="openai-key"]');
    const hfMeta = document.querySelector('meta[name="huggingface-key"]');
    
    if (openAiMeta) {
        window.ENV.API_KEY = openAiMeta.getAttribute('content');
    }
    if (hfMeta) {
        window.ENV.HF_KEY = hfMeta.getAttribute('content');
    }
    
    // Debug logging
    console.log('Environment loading status:', {
        OpenAI: !!window.ENV.API_KEY ? 'Present' : 'Missing',
        HuggingFace: !!window.ENV.HF_KEY ? 'Present' : 'Missing'
    });
});