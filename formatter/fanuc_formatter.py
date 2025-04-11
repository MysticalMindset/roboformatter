import re
import sys

def fanuc_formatter(code: str) -> str:
    formatted_lines = []
    inside_comment_block = False

    for line in code.splitlines():
        line = line.strip()

        # Skip comment blocks or handle logic
        if line.startswith('//') or line == '':
            continue

        # Normalize spacing
        line = re.sub(r'\s+', ' ', line)

        # Handle standard formatting (e.g., commands uppercase)
        line = line.upper()

        formatted_lines.append(line)

    return '\n'.join(formatted_lines)


if __name__ == "__main__":
    with open(sys.argv[1], 'r') as f:
        content = f.read()
    formatted = fanuc_formatter(content)
print(formatted)