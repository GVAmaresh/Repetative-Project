import PyPDF2
from PIL import Image
from pytesseract import pytesseract

def extract_text_from_pdf(pdf_file_path):
    text = ""
    try:
        
        with open(pdf_file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            for i in range(num_pages):
                page_text = pdf_reader.pages[i].extract_text()
                # page = pdf_reader.pages[i]
                # img = page.to_pil()
                # text += extract_text_from_image_pil(img) + "\n"
                text += page_text + "\n"
    except Exception as e:
        print("An error occurred:", e)
    with open('./text.txt', 'w', encoding='utf-8') as output_file:
        output_file.write(text)
    return text

# def extract_text_from_images(pdf_file_path):
#     text = ""
#     try:
#         with open(pdf_file_path, 'rb') as file:
#             pdf_reader = PyPDF2.PdfReader(file)
#             num_pages = len(pdf_reader.pages)
#             for i in range(num_pages):
#                 page_image = pdf_reader.pages[i].to_image(resolution=300)
#                 page_image_path = f"page_{i+1}.png"
#                 page_image.save(page_image_path)
#                 page_text = extract_text_from_image(page_image_path)
#                 print(f"Page {i+1} text:")
#                 print(page_text)
#                 text += page_text + "\n"
#     except Exception as e:
#         print("An error occurred:", e)
#     return text

# def extract_text_from_image(image_path):
#     path_to_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
#     pytesseract.tesseract_cmd = path_to_tesseract
#     img = Image.open(image_path)
#     text = pytesseract.image_to_string(img)
#     return text[:-1] 

pdf_file_path = './report.pdf'
text_from_pdf = extract_text_from_pdf(pdf_file_path)
# print(text_from_pdf)

# text_from_images = extract_text_from_images(pdf_file_path)
# print("Full text from images:")
# print(text_from_images)
