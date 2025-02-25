import os
import sys
from transformers import AutoTokenizer, AutoModelForMaskedLM
import torch
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_jobbert():
    try:
        logger.info("Loading JobBERT model...")
        tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert-base-cased")
        model = AutoModelForMaskedLM.from_pretrained("jjzha/jobbert-base-cased")
        
        # Test sentences
        test_sentences = [
            "A software engineer should know [MASK] programming.",
            "The job requires [MASK] years of experience.",
            "Candidates must have a [MASK] degree.",
            "Experience with [MASK] development is required."
        ]
        
        for i, text in enumerate(test_sentences, 1):
            logger.info(f"\nTest {i}: {text}")
            
            # Tokenize and get predictions
            inputs = tokenizer(text, return_tensors="pt")
            mask_token_index = torch.where(inputs["input_ids"] == tokenizer.mask_token_id)[1]
            
            with torch.no_grad():
                outputs = model(**inputs)
                predictions = outputs.logits[0, mask_token_index]
                top_5_tokens = torch.topk(predictions, 5, dim=1).indices[0].tolist()
                predicted_words = [tokenizer.decode([token]).strip() for token in top_5_tokens]
            
            logger.info(f"Top 5 predictions: {predicted_words}")
            
            # Calculate confidence scores
            probabilities = torch.nn.functional.softmax(predictions, dim=1)
            top_probs = torch.topk(probabilities, 5, dim=1).values[0].tolist()
            
            logger.info("Confidence scores:")
            for word, prob in zip(predicted_words, top_probs):
                logger.info(f"{word}: {prob:.2%}")

        # Test custom sentence
        custom_text = "This candidate's skills include [MASK]."
        logger.info(f"\nTesting custom sentence: {custom_text}")
        
        inputs = tokenizer(custom_text, return_tensors="pt")
        mask_token_index = torch.where(inputs["input_ids"] == tokenizer.mask_token_id)[1]
        
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = outputs.logits[0, mask_token_index]
            top_5_tokens = torch.topk(predictions, 5, dim=1).indices[0].tolist()
            predicted_words = [tokenizer.decode([token]).strip() for token in top_5_tokens]
            
            probabilities = torch.nn.functional.softmax(predictions, dim=1)
            top_probs = torch.topk(probabilities, 5, dim=1).values[0].tolist()
            
            logger.info("Results for custom sentence:")
            for word, prob in zip(predicted_words, top_probs):
                logger.info(f"{word}: {prob:.2%}")

    except Exception as e:
        logger.error(f"Error during JobBERT testing: {str(e)}")
        logger.error("Stack trace:", exc_info=True)

if __name__ == "__main__":
    logger.info("Starting JobBERT model testing...")
    test_jobbert()
    logger.info("Testing complete.")
