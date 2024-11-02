import os

def reassemble_html(output_file):
    # Get all files in chunk directory
    chunk_files = os.listdir('chunk')
    
    # Initialize the reassembled content
    content = []
    
    # Add header first
    if '00_header.html' in chunk_files:
        with open('chunk/00_header.html', 'r', encoding='utf-8') as f:
            content.append(f.read())
    
    # Add body start
    if 'body_start.html' in chunk_files:
        with open('chunk/body_start.html', 'r', encoding='utf-8') as f:
            content.append(f.read())
    
    # Add all content chunks in order
    content_files = sorted([f for f in chunk_files if f.endswith('_content.html')])
    for file in content_files:
        with open(f'chunk/{file}', 'r', encoding='utf-8') as f:
            content.append(f.read())
    
    # Add body end
    if 'body_end.html' in chunk_files:
        with open('chunk/body_end.html', 'r', encoding='utf-8') as f:
            content.append(f.read())
    
    # Write the reassembled content to the output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(content))

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        print("Usage: python reassemble_html.py <output_html_file>")
        sys.exit(1)
    
    reassemble_html(sys.argv[1])
    print(f"HTML chunks have been reassembled into {sys.argv[1]}")
