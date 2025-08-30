---
description: Contributing to BondMCP Health AI Platform development and documentation
---

# Contributing Guide

Welcome to the BondMCP contributing guide! We appreciate your interest in helping improve our health AI platform.

## Ways to Contribute

### Documentation
- **Improve existing docs**: Fix typos, clarify explanations, add examples
- **Create new guides**: Write tutorials, use cases, or integration guides
- **Translate content**: Help make our docs accessible in multiple languages

### Code Examples
- **SDK examples**: Create examples for Python, JavaScript, Go, or CLI
- **Integration patterns**: Share real-world integration scenarios
- **Best practices**: Document lessons learned from production deployments

### Community Support
- **Answer questions**: Help other developers in our community forum
- **Share use cases**: Write about how you're using BondMCP
- **Provide feedback**: Report bugs, suggest features, or share ideas

## Getting Started

### Documentation Contributions

1. **Fork the repository**: [github.com/bondmcp/mcp](https://github.com/bondmcp/mcp)
2. **Create a branch**: `git checkout -b improve-docs`
3. **Make your changes**: Edit markdown files in the appropriate directories
4. **Test locally**: Ensure your changes render correctly
5. **Submit a pull request**: Include a clear description of your changes

### Code Example Contributions

1. **Choose a category**: Basic usage, integration patterns, or best practices
2. **Write clear code**: Include comments and error handling
3. **Add documentation**: Explain what the example does and when to use it
4. **Test thoroughly**: Ensure examples work with current API versions

## Documentation Standards

### Writing Style
- **Clear and concise**: Use simple language and short sentences
- **Action-oriented**: Start with verbs and focus on what users should do
- **Inclusive**: Use inclusive language and avoid jargon
- **Consistent**: Follow our style guide and terminology

### Code Examples
```python
# Good: Clear, commented, with error handling
import bondmcp

def get_health_info(query):
    """Get health information from BondMCP API."""
    try:
        client = bondmcp.Client(api_key="your-api-key")
        response = client.ask(query)
        return response.answer
    except bondmcp.APIError as e:
        print(f"Error: {e.message}")
        return None

# Usage
info = get_health_info("What are the symptoms of diabetes?")
if info:
    print(info)
```

### Markdown Guidelines
- Use descriptive headings with proper hierarchy (H1, H2, H3)
- Include frontmatter with description for all pages
- Use code blocks with language specification
- Add alt text for images and diagrams
- Link to related documentation where relevant

## Review Process

### Pull Request Guidelines
1. **Descriptive title**: Clearly describe what your PR does
2. **Detailed description**: Explain the changes and why they're needed
3. **Link issues**: Reference any related issues or discussions
4. **Test changes**: Ensure documentation builds and renders correctly

### Review Criteria
- **Accuracy**: Information must be technically correct and up-to-date
- **Clarity**: Content should be easy to understand for the target audience
- **Completeness**: Examples should be complete and runnable
- **Style**: Must follow our documentation standards and style guide

## Community Guidelines

### Code of Conduct
We are committed to providing a welcoming and inclusive environment for all contributors. Please:
- **Be respectful**: Treat all community members with respect and kindness
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone has different experience levels
- **Be collaborative**: Work together to improve the platform for everyone

### Communication Channels
- **GitHub Issues**: For bug reports and feature requests
- **Pull Requests**: For code and documentation contributions
- **Community Forum**: For questions and discussions
- **Email**: [community@bondmcp.com](mailto:community@bondmcp.com) for sensitive matters

## Recognition

### Contributor Recognition
We recognize and appreciate all contributions:
- **Contributors list**: All contributors are listed in our documentation
- **Special mentions**: Significant contributions are highlighted in release notes
- **Swag and rewards**: Active contributors receive BondMCP merchandise
- **Beta access**: Contributors get early access to new features

### Becoming a Maintainer
Regular contributors may be invited to become maintainers with:
- **Review permissions**: Help review and merge pull requests
- **Triage access**: Help manage issues and community questions
- **Feature input**: Participate in planning and roadmap discussions
- **Direct access**: Collaborate directly with the BondMCP team

## Getting Help

### For Contributors
- **Documentation questions**: Ask in GitHub issues or community forum
- **Technical help**: Email [developers@bondmcp.com](mailto:developers@bondmcp.com)
- **Process questions**: Check this guide or ask in the community forum

### Resources
- **Style Guide**: [Contributing Style Guide](docs-style.md)
- **API Guidelines**: [API Documentation Guidelines](api-guidelines.md)
- **Community Forum**: [community.bondmcp.com](https://community.bondmcp.com)
- **Developer Chat**: Join our Slack workspace for real-time discussions

Thank you for contributing to BondMCP! Your efforts help make health AI more accessible and useful for everyone.
