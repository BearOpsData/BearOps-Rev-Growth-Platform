#!/usr/bin/env python3
"""
Claude PR Code Review Script
Calls Claude API to review code changes in a pull request.
"""

import os
import sys
import subprocess


# Default model — override via CLAUDE_MODEL env var
DEFAULT_MODEL = "claude-sonnet-4-20250514"
# Conservative truncation limit (code has higher token density)
MAX_DIFF_CHARS = 30000


def get_diff(base_ref: str, head_ref: str) -> str:
    """Get the diff between base and head refs."""
    try:
        result = subprocess.run(
            ['git', 'diff', f'origin/{base_ref}...origin/{head_ref}'],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error getting diff: {e}", file=sys.stderr)
        return ""


def call_claude_api(diff_content: str, api_key: str) -> str:
    """Call Claude API to review the code."""
    from anthropic import Anthropic, AuthenticationError, APIError

    if not diff_content.strip():
        return "No code changes detected in this PR."

    # Truncate diff if too long (code has higher token density than prose)
    if len(diff_content) > MAX_DIFF_CHARS:
        diff_content = diff_content[:MAX_DIFF_CHARS] + "\n\n... (diff truncated due to length)"

    prompt = f"""Please review the following code changes in this pull request.

Provide a comprehensive code review covering:
1. Code quality assessment
2. Potential bugs or issues
3. Security concerns
4. Best practices suggestions
5. Performance considerations
6. Overall feedback and recommendations

Code diff:
```
{diff_content}
```

Please provide a detailed, actionable code review."""

    model = os.environ.get('CLAUDE_MODEL', DEFAULT_MODEL)

    try:
        client = Anthropic(api_key=api_key)
        message = client.messages.create(
            model=model,
            max_tokens=4000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        return message.content[0].text
    except AuthenticationError as e:
        return f"Authentication error: {str(e)}"
    except APIError as e:
        return f"Error calling Claude API: {str(e)}"


def main():
    base_ref = os.environ.get('GITHUB_BASE_REF', 'main')
    head_ref = os.environ.get('GITHUB_HEAD_REF', '')
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')

    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    if not head_ref:
        print("Error: GITHUB_HEAD_REF not set — cannot determine PR branch", file=sys.stderr)
        sys.exit(1)

    diff_content = get_diff(base_ref, head_ref)
    review = call_claude_api(diff_content, api_key)

    # Output review for GitHub Actions
    print(review)


if __name__ == "__main__":
    main()
