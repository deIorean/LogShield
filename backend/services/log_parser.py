import re

def parse_log_content(content: str) -> list:
    """
    Extracts raw lines from a log file.
    Supports plain text, Apache/Nginx style logs.
    """
    lines = content.strip().split("\n")
    parsed = []

    for line in lines:
        line = line.strip()
        if line:
            parsed.append(line)

    return parsed