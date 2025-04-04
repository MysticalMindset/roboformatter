import sys
import re

def format_krl(content: str) -> str:
    formatted_lines = []
    inside_fold_block = False

    for line in content.splitlines():
        stripped_line = line.strip()

        # Remove system metadata lines
        if stripped_line.startswith("&ACCESS") or stripped_line.startswith("&REL") or stripped_line.startswith("&PARAM"):
            continue  # Skip these lines

        # Remove FOLD blocks
        if stripped_line.startswith(";FOLD"):
            inside_fold_block = True
            continue  # Skip this line

        if inside_fold_block:
            if stripped_line.startswith(";ENDFOLD"):
                inside_fold_block = False  # End of fold block
            continue  # Skip lines inside the fold block

        # Convert keywords to uppercase
        keywords = r"\b(def|end|if|then|else|endif|loop|endloop|exit|decl|global|interrupt|do|when)\b"
        stripped_line = re.sub(keywords, lambda match: match.group(1).upper(), stripped_line, flags=re.IGNORECASE)

        # Add spaces around assignment and comparison operators
        stripped_line = re.sub(r"([=<>+\-*/]+)", r" \1 ", stripped_line)

        formatted_lines.append(stripped_line)

    return "\n".join(formatted_lines)

if __name__ == "__main__":
    input_text = sys.stdin.read()
    print(format_krl(input_text))
