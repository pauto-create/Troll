import os
import sys

def reassemble_html(output_file=None):
    # Read the original file path
    with open('chunk/original_file.txt', 'r', encoding='utf-8') as f:
        original_file = f.read().strip()
    
    # Read the selector used
    with open('chunk/selector.txt', 'r', encoding='utf-8') as f:
        selector = f.read().strip()
    
    # Read the full original content
    with open('chunk/full_content.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get all match files
    match_files = sorted([f for f in os.listdir('chunk') if f.endswith('_match.html')])
    
    # Read all modified chunks
    modified_chunks = []
    for file in match_files:
        with open(f'chunk/{file}', 'r', encoding='utf-8') as f:
            modified_chunks.append(f.read())
    
    # Replace each original match with its modified version
    original_matches = extract_elements(content, selector)
    final_content = content
    
    for original, modified in zip(original_matches, modified_chunks):
        final_content = final_content.replace(original, modified)
    
    # Write to output file or original file
    output_file = output_file or original_file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_content)
    
    print(f"Reassembled HTML saved to {output_file}")

def extract_elements(content, selector):
    """Extract elements based on selector type:
    - For IDs: #my-id
    - For classes: .my-class
    - For tags: div, section, etc.
    """
    import re
    
    if selector.startswith('#'):
        # ID selector
        pattern = f'(<[^>]+id=[\'"]{selector[1:]}[\'"][^>]*>.*?</[^>]+>)'
    elif selector.startswith('.'):
        # Class selector
        pattern = f'(<[^>]+class=[\'"][^\'"]*{selector[1:]}[^\'"]*[\'"][^>]*>.*?</[^>]+>)'
    else:
        # Tag selector
        pattern = f'(<{selector}[^>]*>.*?</{selector}>)'
    
    return re.findall(pattern, content, re.DOTALL | re.IGNORECASE)

def print_help():
    print("""
Usage: python reassemble_html.py [output_file]

If output_file is not provided, the original file will be updated.
    """)

if __name__ == '__main__':
    if len(sys.argv) > 2:
        print_help()
        sys.exit(1)
    
    output_file = sys.argv[1] if len(sys.argv) == 2 else None
    reassemble_html(output_file)
