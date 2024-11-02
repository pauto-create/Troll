import os
import re

def chunk_html(input_file):
    # Create chunks directory if it doesn't exist
    if not os.path.exists('chunk'):
        os.makedirs('chunk')

    # Read the HTML file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split into head and body sections
    head_match = re.search(r'(<head.*?>.*?</head>)', content, re.DOTALL | re.IGNORECASE)
    body_match = re.search(r'(<body.*?>)(.*?)(</body>)', content, re.DOTALL | re.IGNORECASE)

    if head_match:
        # Save header section
        with open('chunk/00_header.html', 'w', encoding='utf-8') as f:
            doctype = '<!DOCTYPE html>\n' if '<!DOCTYPE' in content else ''
            html_start = '<html>\n' if '<html' in content else ''
            f.write(doctype + html_start + head_match.group(1))

    if body_match:
        # Save body start tag
        with open('chunk/body_start.html', 'w', encoding='utf-8') as f:
            f.write(body_match.group(1))

        # Split body content into chunks based on major elements
        body_content = body_match.group(2)
        chunks = re.findall(r'(<(?:div|section|article|header|footer|nav|main|aside).*?>.*?</(?:div|section|article|header|footer|nav|main|aside)>)', body_content, re.DOTALL)
        
        # Save each chunk
        for i, chunk in enumerate(chunks, 1):
            with open(f'chunk/{i:02d}_content.html', 'w', encoding='utf-8') as f:
                f.write(chunk)

        # Save remaining content that wasn't caught in chunks
        remaining = body_content
        for chunk in chunks:
            remaining = remaining.replace(chunk, '')
        if remaining.strip():
            with open(f'chunk/{len(chunks)+1:02d}_content.html', 'w', encoding='utf-8') as f:
                f.write(remaining)

        # Save body end
        with open('chunk/body_end.html', 'w', encoding='utf-8') as f:
            f.write(body_match.group(3) + '\n</html>')

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        print("Usage: python chunk_html.py <input_html_file>")
        sys.exit(1)
    
    chunk_html(sys.argv[1])
    print("HTML file has been split into chunks in the 'chunk' directory")
