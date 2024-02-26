from transformers import AutoModelForSeq2SeqLM
from transformers import AutoTokenizer

text = """Parkinson’s disease (PD) is one of the long-term regressive disorders of the central nervous
system that mainly affects the nervous system in humans due to which there is the recurrent
occurrence of falls which might even lead to death or put them in a serious situation. For
solving this issue,  we have proposed an idea that detects patient fall and reports to the
caretaker or family member utilizing message/call/Alarm thereby avoiding deaths. Our
work focuses on developing and apply the wearable fall -detection system for Parkinson’s
disease long -suffers formed on a Wi -Fi module. Patient falls were precisely traced on the
outcome of an accelerometer, oximeter, and pressure sensors which were sent to the cloud
via NodeMCU -ESP32. Furthermore, Node MCU ESP32 is planned for attaining smooth
communication between the fall detection device and the system for obtaining and
processing the data anytime and anywhere until we have a Wi -Fi connection. In
consequence, the cloud will perform the calculations based on SVM which is the Support
Vector Machine. In t urn, it sends the fall detection outcomes to the MIT application. This
WFDS turns out to be the best among the existing models in terms of fall detection
sensitivity, specificity, and accuracy. The fall of direction in PD can be performed
accurately based on the fall detection algorithm at the receiver end. The preliminary
outcomes show that the wearable fall -detection system attains eighty -. eight percent
accuracy in identifying the patient’s fall."""
tokenizer = AutoTokenizer.from_pretrained("stevhliu/my_awesome_billsum_model")

inputs = tokenizer(text, return_tensors="pt").input_ids
model = AutoModelForSeq2SeqLM.from_pretrained("stevhliu/my_awesome_billsum_model")
outputs = model.generate(inputs,max_length=1000, do_sample=False)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))