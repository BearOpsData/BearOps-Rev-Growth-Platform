# GitHub Actions - Claude PR Review

This repository includes an automated code review workflow that uses Claude AI to review all pull requests.

## Setup

### 1. Add Anthropic API Key

You need to add your Anthropic API key as a GitHub secret:

1. Go to your repository settings: `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key (get it from https://console.anthropic.com/)
5. Click `Add secret`

### 2. How It Works

The workflow automatically:
- Triggers on all pull requests (opened, updated, or reopened)
- Works across all branches (main, DEV, STAGE, feature branches, etc.)
- Analyzes code changes using Claude AI
- Posts a comprehensive code review as a PR comment

### 3. What Gets Reviewed

The workflow reviews:
- Code quality
- Potential bugs
- Security concerns
- Best practices
- Performance considerations
- Overall recommendations

## Workflow File

- `.github/workflows/claude-pr-review.yml` - Main workflow definition
- `.github/scripts/claude_review.py` - Python script that calls Claude API

## Requirements

- Anthropic API key (stored as `ANTHROPIC_API_KEY` secret)
- Python 3.11+ (automatically set up in the workflow)

