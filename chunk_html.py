import os
import re
import sys

def extract_elements(content, selector):
    """Extract elements based on selector type:
    - For IDs: #my-id
    - For classes: .my-class
    - For tags: div, section, etc.
    """
    if selector.startswith('#'):
        # ID selector
        pattern = f'(<[^>]+id=[\'"]{selector[1:]}[\'"][^>]*>.*?</[^>]+>)'
    elif selector.startswith('.'):
        # Class selector
        pattern = f'(<[^>]+class=[\'"][^\'"]*{selector[1:]}[^\'"]*[\'"][^>]*>.*?</[^>]+>)'
    else:
        # Tag selector
        pattern = f'(<{selector}[^>]*>.*?</{selector}>)'
    
    matches = re.findall(pattern, content, re.DOTALL | re.IGNORECASE)
    return matches

def chunk_html(input_file, selector):
    # Create chunks directory if it doesn't exist
    if not os.path.exists('chunk'):
        os.makedirs('chunk')
    
    # Read the HTML file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract matching elements
    matches = extract_elements(content, selector)
    
    if not matches:
        print(f"No elements found matching '{selector}'")
        return
    
    # Save the original file path for reassembly
    with open('chunk/original_file.txt', 'w', encoding='utf-8') as f:
        f.write(input_file)
    
    # Save the selector used
    with open('chunk/selector.txt', 'w', encoding='utf-8') as f:
        f.write(selector)
    
    # Save the full content for reassembly
    with open('chunk/full_content.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Save each matching element as a separate chunk
    for i, match in enumerate(matches, 1):
        with open(f'chunk/{i:02d}_match.html', 'w', encoding='utf-8') as f:
            f.write(match)
        print(f"Saved match {i} to chunk/{i:02d}_match.html")

def print_help():
    print("""
Usage: python chunk_html.py <input_file> <selector>

Selectors:
- For IDs: #my-id
- For classes: .my-class
- For tags: div, section, p, etc.

Examples:
python chunk_html.py index.html .main-content
python chunk_html.py index.html #header
python chunk_html.py index.html article
    """)

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print_help()
        sys.exit(1)
    
    chunk_html(sys.argv[1], sys.argv[2])
