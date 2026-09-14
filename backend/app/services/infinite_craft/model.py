import json
import os

from dotenv import load_dotenv
from groq import Groq


class Qwen:
    def __init__(self):
        load_dotenv()
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=self.api_key)
        self.model = "qwen/qwen3.8-27b"
        self.system_prompt = (
                "You are the core combination engine for the game Infinite Craft.\n"
                "Your task is to merge two input items into a single, logical, yet creative new item.\n\n"
                "RULES FOR COMBINING:\n"
                "1. SIMPLICITY & COMMON TERMS: For scientific or natural themes, choose the simpler, more widely used word over a complex or obscure term (e.g., 'Storm' over 'Gale').\n"
                "2. NO LAZY CONCATENATION: Do not just blindly string words together (e.g., 'Fire' + 'Sword' = 'Excalibur', NOT 'Fire Sword').\n"
                "3. POP CULTURE & GAMING: Obscure references, anime, or video game items are heavily encouraged, but ONLY when inputs strongly point toward them (e.g., 'Plumber' + 'Mushroom' = 'Mario').\n"
                "4. CONCISE & CAPITALIZED: Output must be 1 to 3 words max. Capitalize the result.\n"
                "5. EMOJI: Provide a single relevant Unicode emoji matching the result.\n"
                "6. STRICT JSON: Return raw JSON only with schema: {\"result\": \"Item Name\", \"emoji\": \"Emoji\"}"
        )

    def _call_model(self, prompt):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=prompt,
            temperature=0.7,
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content

    def _create_prompt(self, item1, item2):
        prompt = [
            {"role": "system", "content": self.system_prompt},
            # Example 2: Basic Elemental (Fixing Fire + Wind)
            {"role": "user", "content": "Combine: Fire + Wind"},
            {"role": "assistant", "content": '{"result": "Smoke", "emoji": "💨"}'},
            
            # Example 4: Simple Atmospheric Base
            {"role": "user", "content": "Combine: Water + Earth"},
            {"role": "assistant", "content": '{"result": "Plant", "emoji": "🌱"}'},

            # Example 5: Pop Culture / Niche Gaming Reference
            {"role": "user", "content": "Combine: Plumber + Mushroom"},
            {"role": "assistant", "content": '{"result": "Mario", "emoji": "🍄"}'},
            
            # The actual user prompt
            {"role": "user", "content": f"Combine: {item1} + {item2}"},
        ]
        return prompt

    def combine_items(self, item1, item2):
        prompt = self._create_prompt(item1, item2)
        output = self._call_model(prompt)

        result = json.loads(output)["result"]
        emoji = json.loads(output)["emoji"]

        return {"name": result, "emoji": emoji}
