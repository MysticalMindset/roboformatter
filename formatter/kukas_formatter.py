import sys
import re

def format_kukas(content: str) -> str:
    formatted_lines = []
    skip_fold = False

    for line in content.splitlines():
        stripped_line = line.strip()

        # Remove system metadata lines
        if stripped_line.startswith("&ACCESS") or stripped_line.startswith("&REL") or stripped_line.startswith("&PARAM"):
            continue

        # Handle start of fold block
        if stripped_line.startswith(";FOLD"):
            # Try to extract the readable name
            fold_label = re.match(r";FOLD\s+([^\;%]+)", stripped_line)
            if fold_label:
                formatted_lines.append(fold_label.group(1).strip())  # Keep only the label
            skip_fold = True
            continue

        # Handle end of fold block
        if stripped_line.startswith(";ENDFOLD"):
            skip_fold = False
            continue

        # Remove commented PE metadata lines
        if stripped_line.startswith(";%{PE}"):
            continue

        # Skip everything inside the fold block
        if skip_fold:
            continue

        # Convert keywords to uppercase
        keywords = r"\b(def|end|if|then|else|endif|loop|endloop|exit|decl|global|interrupt|do|when)\b"
        stripped_line = re.sub(keywords, lambda match: match.group(1).upper(), stripped_line, flags=re.IGNORECASE)

        # Add spacing around operators
        stripped_line = re.sub(r"([=<>+\-*/]+)", r" \1 ", stripped_line)

        formatted_lines.append(stripped_line)


    return "\n".join(formatted_lines)

if __name__ == "__main__":
    input_text = sys.stdin.read()
    print(format_kukas(input_text))
