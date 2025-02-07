import google.generativeai as gemini
from fastapi import FastAPI

app = FastAPI()

Key = "AIzaSyC-9oOoUxE0v13DNuE37qBzClAfhJrxRJs"
gemini.configure(api_key=Key)
meta = "musculoso"

para_treino=[
    {"text-input": "qual minha rotina de hoje", "output": "Não consigo ou não posso responder essa pergunta, minha funcionalidade é apenas para auxílio nutricional."}
]



modelo = gemini.GenerativeModel("gemini-1.5-flash")
# Ia = modelo.generate_content("Qual dia de hoje?")

chat = modelo.start_chat(history=[])

def Conversa():
    pergunta = input("Qual sua dúvida?\n")

    while pergunta != "end":
        resposta = chat.send_message(pergunta, generation_config=gemini.GenerationConfig(max_output_tokens=150,temperature=0.2))
        print(resposta.text)
        pergunta = input('Pussuí outra dúvida?(escreva "end" para finalizar a conversa).\n')

Conversa();
