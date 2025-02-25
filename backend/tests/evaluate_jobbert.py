from transformers import AutoTokenizer, AutoModelForMaskedLM
import torch
import json

def evaluate_jobbert_accuracy(test_cases_file='test_cases.json'):
    # Load test cases
    with open(test_cases_file, 'r') as f:
        test_cases = json.load(f)

    tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert-base-cased")
    model = AutoModelForMaskedLM.from_pretrained("jjzha/jobbert-base-cased")

    correct_predictions = 0
    total_predictions = 0

    for case in test_cases:
        input_text = case['input']
        expected = case['expected']
        
        # Tokenize input
        inputs = tokenizer(input_text, return_tensors="pt")
        
        # Get model predictions
        with torch.no_grad():
            outputs = model(**inputs)
            predictions = outputs.logits.argmax(dim=-1)
        
        # Convert predictions to tokens
        predicted_tokens = tokenizer.batch_decode(predictions)
        
        # Compare with expected output
        if predicted_tokens == expected:
            correct_predictions += 1
        total_predictions += 1
        
        print(f"\nTest Case {total_predictions}:")
        print(f"Input: {input_text}")
        print(f"Expected: {expected}")
        print(f"Predicted: {predicted_tokens}")
        print(f"Correct: {'Yes' if predicted_tokens == expected else 'No'}")

    accuracy = correct_predictions / total_predictions
    print(f"\nOverall Accuracy: {accuracy:.2%}")
    return accuracy

# Sample test cases
test_cases = [
    {
        "input": "The candidate has [MASK] years of Python experience.",
        "expected": ["5"]
    },
    {
        "input": "The developer is skilled in [MASK] programming.",
        "expected": ["Python"]
    },
    # Add more test cases
]

# Save test cases
with open('test_cases.json', 'w') as f:
    json.dump(test_cases, f, indent=2)

if __name__ == "__main__":
    evaluate_jobbert_accuracy()
