from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

tokenizer = AutoTokenizer.from_pretrained("openai-community/gpt2")
model = AutoModelForCausalLM.from_pretrained("openai-community/gpt2")

@app.post("/milchikify")
async def milchikify(request: Request):
    body = await request.json()
    input_text = body.get("text", "")
    
    inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    output = model.generate(inputs, max_length=200, num_return_sequences=1, no_repeat_ngram_size=2, temperature=0.7)
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
    
    return JSONResponse(content={"output": generated_text})
