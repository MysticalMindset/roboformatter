import sys
import re

def format_kukas(content: str) -> str:
    formatted_lines = []
    fold_level = 0  # track nested folds

    for line in content.splitlines():
        stripped_line = line.strip()

        # Remove system metadata lines
        if stripped_line.startswith("&"):
            continue

        # Remove specific INIT macros
        if stripped_line.upper() in ["BASISTECH INI", "USER INI"]:
            continue

        # Start of a FOLD block
        if stripped_line.startswith(";FOLD"):
            # Only keep top-level FOLD label (like "PTP HOME ...")
            if fold_level == 0:
                match = re.match(r";FOLD\s+([^\;%]+)", stripped_line)
                if match:
                    formatted_lines.append(match.group(1).strip())
            fold_level += 1
            continue

        # End of a FOLD block
        if stripped_line.startswith(";ENDFOLD"):
            fold_level = max(fold_level - 1, 0)
            continue

        # Skip everything inside any fold level
        if fold_level > 0:
            continue

        # Remove commented PE metadata lines
        if stripped_line.startswith(";%{PE}"):
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
