import os
import glob

def reassemble_file(filename):
    """Reassembles a chunked file."""

    parts = sorted(glob.glob(f"{filename}.part*"))

    if not parts:
        print(f"Error: No parts found for '{filename}'.")
        return

    reassembled_content = ""
    for part_file in parts:
        try:
            with open(part_file, 'r', encoding='utf-8') as infile:
                reassembled_content += infile.read()
        except FileNotFoundError:
            print(f"Error: Part file '{part_file}' not found.")
            return

    with open(filename, 'w', encoding='utf-8') as outfile:
        outfile.write(reassembled_content)

    print(f"File '{filename}' reassembled from {len(parts)} parts.")


if __name__ == "__main__":
    filename = "index.html"  # Replace with the actual filename
    reassemble_file(filename)

