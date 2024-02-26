import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F

def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0] #First element of model_output contains all token embeddings
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min=1e-9)

sentences = [
    "I like rainy days because they make me feel relaxed.",
    "I like rainy days because they make me feel relaxed."
]

tokenizer = AutoTokenizer.from_pretrained('dmlls/all-mpnet-base-v2-negation')
model = AutoModel.from_pretrained('dmlls/all-mpnet-base-v2-negation')

encoded_input = tokenizer(sentences, padding=True, truncation=True, return_tensors='pt')

with torch.no_grad():
    model_output = model(**encoded_input)

sentence_embeddings = mean_pooling(model_output, encoded_input['attention_mask'])

sentence_embeddings = F.normalize(sentence_embeddings, p=2, dim=1)
similarity_matrix = cosine_similarity(sentence_embeddings, sentence_embeddings)

similarity_score = np.triu(similarity_matrix, k=1).mean()

print("Similarity score:", similarity_score)