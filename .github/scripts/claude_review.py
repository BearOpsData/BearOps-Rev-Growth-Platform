#!/usr/bin/env python3
"""
Claude PR Code Review Script
Calls Claude API to review code changes in a pull request.
"""

import os
import sys
import json
import subprocess
from pathlib import Path


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
    import requests
    
    if not diff_content.strip():
        return "No code changes detected in this PR."
    
    # Truncate diff if too long (Claude has token limits)
    max_diff_length = 50000  # Leave room for prompt and response
    if len(diff_content) > max_diff_length:
        diff_content = diff_content[:max_diff_length] + "\n\n... (diff truncated due to length)"
    
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

    url = "https://api.anthropic.com/v1/messages"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    payload = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 4000,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        return result['content'][0]['text']
    except requests.exceptions.RequestException as e:
        return f"Error calling Claude API: {str(e)}"
    except (KeyError, IndexError) as e:
        return f"Error parsing Claude API response: {str(e)}"


def main():
    base_ref = os.environ.get('GITHUB_BASE_REF', 'main')
    head_ref = os.environ.get('GITHUB_HEAD_REF', '')
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)
    
    # For PR events, GITHUB_HEAD_REF should be set
    # If not, try to get from GITHUB_REF
    if not head_ref:
        github_ref = os.environ.get('GITHUB_REF', '')
        if github_ref.startswith('refs/pull/'):
            # This is a PR ref, extract the branch
            pr_number = github_ref.split('/')[2]
            # We'll need to fetch the PR branch differently
            head_ref = f"pr/{pr_number}/merge"
        else:
            head_ref = github_ref.replace('refs/heads/', '')
    
    if not head_ref:
        print("Error: Could not determine head ref", file=sys.stderr)
        sys.exit(1)
    
    diff_content = get_diff(base_ref, head_ref)
    review = call_claude_api(diff_content, api_key)
    
    # Output review for GitHub Actions
    print(review)


if __name__ == "__main__":
    main()

