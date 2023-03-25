# Note: you need to be using OpenAI Python v0.27.0 for the code below to work
# pip install openai --user
# pip install gTTS --user
import openai
from gtts import gTTS
import os

openai.api_key = "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"

prompt=input("input prompt: ")

response=(openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": prompt}
  ]
))

# The text that you want to convert to audio
response_message = response['choices'][0]['message']['content']
print(response_message)

# Language in which you want to convert
language = 'en'

# Passing the text and language to the engine,
# here we have marked slow=False. Which tells
# the module that the converted audio should
# have a high speed
myobj = gTTS(text=response_message, lang=language, slow=False)

# Saving the converted audio in a mp3 file named
# welcome
myobj.save("gpt_response.mp3")

# Playing the converted file
os.system("gpt_response.mp3")