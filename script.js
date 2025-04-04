function milchickify() {
    const input = document.getElementById('inputText').value.trim();
    if (!input) return;
  
    // Fake translation for now – plug GPT here later
    const output = `Ah, yes. What a delightfully concise sentiment: "${input}". Might I elevate it thusly…`;
  
    document.getElementById('outputText').innerText = output;
    document.getElementById('outputBox').classList.remove('hidden');
  }
  
  function copyOutput() {
    const text = document.getElementById('outputText').innerText;
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }
  