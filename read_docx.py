import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            text = []
            for paragraph in tree.findall('.//w:p', ns):
                para_text = "".join([node.text for node in paragraph.findall('.//w:t', ns) if node.text])
                if para_text:
                    text.append(para_text)
            return '\n'.join(text)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    file_path = sys.argv[1]
    print(read_docx(file_path))
