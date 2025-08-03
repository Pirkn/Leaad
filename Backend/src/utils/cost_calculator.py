import tiktoken
from typing import List, Dict, Any

class GeminiCostCalculator:
    """Cost calculator for Gemini models with current pricing"""
    
    GEMINI_PRICING = {
        "gemini-2.5-flash": {
            "input": 0.3 / 1_000_000,  # $0.3 per 1M tokens
            "output": 2.5 / 1_000_000,   # $2.5 per 1M tokens
        },
    }
    
    def __init__(self, model: str = "gemini-2.5-flash"):
        self.model = model
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in a text string"""
        return len(self.tokenizer.encode(text))
    
    def count_messages_tokens(self, messages: List[Dict[str, Any]]) -> int:
        """Count tokens in a list of messages (for chat completions)"""
        total_tokens = 0
        for message in messages:
            content = message.get("content", "")
            if isinstance(content, str):
                total_tokens += self.count_tokens(content)
            elif isinstance(content, list):
                # Handle multimodal content
                for item in content:
                    if item.get("type") == "text":
                        total_tokens += self.count_tokens(item.get("text", ""))
        return total_tokens
    
    def calculate_cost(self, 
                      input_tokens: int = 0, 
                      output_tokens: int = 0,
                      messages: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Calculate the cost for a Gemini API call"""
        
        # If messages provided, count input tokens
        if messages:
            input_tokens = self.count_messages_tokens(messages)
        
        # Get pricing for the model
        if self.model not in self.GEMINI_PRICING:
            raise ValueError(f"Model {self.model} not supported")
        
        pricing = self.GEMINI_PRICING[self.model]
        
        # Calculate costs
        input_cost = input_tokens * pricing["input"]
        output_cost = output_tokens * pricing["output"]
        total_cost = input_cost + output_cost
        
        return {
            "model": self.model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "input_cost": input_cost,
            "output_cost": output_cost,
            "total_cost": total_cost,
            "total_cost_usd": f"${total_cost:.6f}"
        }
    
    def estimate_completion_cost(self, 
                               messages: List[Dict[str, Any]], 
                               estimated_output_tokens: int = 100) -> Dict[str, Any]:
        """Estimate cost before making an API call"""
        return self.calculate_cost(
            messages=messages,
            output_tokens=estimated_output_tokens
        ) 