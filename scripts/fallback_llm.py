# scripts/fallback_llm.py
import os
import requests
import subprocess
import json

# CONFIGURATION - Le LLM de secours
MISTRAL_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

def get_last_failed_context():
   """Récupère le contexte d'échec à partir des fichiers de doc."""
   context = ""
   try:
       with open("ARCHITECTURE.md", 'r') as f:
           context += f.read()
       with open("TODO.md", 'r') as f:
           context += f.read()
       if os.path.exists("status.json"):
           with open("status.json", 'r') as f:
               context += "\nDERNIER ÉTAT DE WORKSPACE:\n" + f.read()
   except FileNotFoundError as e:
       print(f"Avertissement: Fichier de contexte non trouvé: {e}")
       return "Contexte incomplet. Reprise basée sur le dernier commit."

   return context


def generate_with_mistral(prompt):
   """Fait une requête à l'API Mistral (Hugging Face)"""
   hf_token = os.environ.get("HUGGING_FACE_TOKEN")
   if not hf_token:
       print("Erreur: HUGGING_FACE_TOKEN n'est pas configuré dans les secrets.")
       return None

   headers = {"Authorization": f"Bearer {hf_token}"}
   payload = {"inputs": prompt, "parameters": {"max_new_tokens": 2000, "temperature": 0.7}}

   response = requests.post(MISTRAL_API_URL, headers=headers, json=payload)
   if response.status_code == 200:
       return response.json()[0]['generated_text']
   else:
       print(f"Erreur de l'API Mistral ({response.status_code}): {response.text}")
       return None


def continue_work():
   """Fonction principale pour reprendre le travail"""
   print("--- ⚠️ Démarrage du processus de secours LLM (Mistral) ⚠️ ---")

   context = get_last_failed_context()

   system_prompt = (
       "Vous êtes le LLM de secours (Mistral). Le LLM principal a échoué. "
       "Vous devez analyser le contexte et la tâche prioritaire dans TODO.md. "
       "Générez le code complet et corrigé pour la prochaine tâche. "
       "Répondez UNIQUEMENT avec le bloc de code complet pour le fichier concerné. "
       f"\n\nCONTEXTE ACTUEL DU PROJET: \n{context}"
       "\n\nProchaine action à entreprendre : Effectuer la première tâche non cochée dans TODO.md."
       "Générez le code complet et corrigé pour le fichier requis par cette tâche."
   )

   print("Envoi du contexte et de la tâche à Mistral...")
   mistral_output = generate_with_mistral(system_prompt)

   if mistral_output:
       print("Code/Action généré(e) par Mistral. Le LLM doit maintenant l'intégrer.")
       print("\n--- Sortie de Mistral (Code de la prochaine itération) ---\n")
       print(mistral_output)
       print("\n--------------------------")

       with open("ARCHITECTURE.md", "a") as f:
           f.write(f"\n\n## Reprise par Mistral\nAction: Génération de code pour la prochaine tâche. Le code est dans les logs.\n")

   print("--- Fin du processus de secours. ---")

if __name__ == "__main__":
   subprocess.run(["git", "pull", "origin", "main"], check=False)
   continue_work()
