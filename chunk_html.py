import os

def chunk_file(filename, chunk_size=1000):
    """Chunks a file into smaller parts."""

    if not os.path.exists(filename):
        print(f"Error: File '{filename}' not found.")
        return

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    chunks = []
    for i in range(0, len(content), chunk_size):
        chunk = content[i:i + chunk_size]
        chunks.append(chunk)

    for i, chunk in enumerate(chunks):
        chunk_filename = f"{filename}.part{i+1}"
        with open(chunk_filename, 'w', encoding='utf-8') as outfile:
            outfile.write(chunk)

    print(f"File '{filename}' chunked into {len(chunks)} parts.")


if __name__ == "__main__":
    filename = "index.html"  # Replace with the actual filename
    chunk_size = 10000       # Adjust chunk size as needed (characters)
    chunk_file(filename, chunk_size)

