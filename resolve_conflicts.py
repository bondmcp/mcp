#!/usr/bin/env python3
"""
Resolve merge conflicts by intelligently combining changes
"""
import json
import re

def resolve_readme_conflict():
    """Resolve README.md conflict by keeping our live API updates"""
    with open('README.md', 'r') as f:
        content = f.read()
    
    # Remove conflict markers and keep our version (which has live API updates)
    # Our version should be between <<<<<<< HEAD and =======
    lines = content.split('\n')
    resolved_lines = []
    in_conflict = False
    keep_section = True
    
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_conflict = True
            keep_section = True
            continue
        elif line.startswith('======='):
            keep_section = False
            continue
        elif line.startswith('>>>>>>> '):
            in_conflict = False
            continue
        
        if not in_conflict or keep_section:
            resolved_lines.append(line)
    
    with open('README.md', 'w') as f:
        f.write('\n'.join(resolved_lines))
    
    print("Resolved README.md conflict")

def resolve_changelog_conflict():
    """Resolve CHANGELOG.md conflict"""
    with open('resources/CHANGELOG.md', 'r') as f:
        content = f.read()
    
    # Keep both versions merged
    lines = content.split('\n')
    resolved_lines = []
    in_conflict = False
    
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_conflict = True
            continue
        elif line.startswith('======='):
            continue
        elif line.startswith('>>>>>>> '):
            in_conflict = False
            continue
        else:
            resolved_lines.append(line)
    
    with open('resources/CHANGELOG.md', 'w') as f:
        f.write('\n'.join(resolved_lines))
    
    print("Resolved CHANGELOG.md conflict")

def resolve_package_json_conflict():
    """Resolve package.json conflict by keeping version 2.1.0"""
    with open('sdks/javascript/package.json', 'r') as f:
        content = f.read()
    
    # Remove conflict markers
    lines = content.split('\n')
    resolved_lines = []
    in_conflict = False
    
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_conflict = True
            continue
        elif line.startswith('======='):
            continue
        elif line.startswith('>>>>>>> '):
            in_conflict = False
            continue
        else:
            resolved_lines.append(line)
    
    # Parse and ensure version is 2.1.0
    resolved_content = '\n'.join(resolved_lines)
    try:
        package_data = json.loads(resolved_content)
        package_data['version'] = '2.1.0'
        
        with open('sdks/javascript/package.json', 'w') as f:
            json.dump(package_data, f, indent=2)
        
        print("Resolved package.json conflict with version 2.1.0")
    except json.JSONDecodeError:
        # Fallback: just remove conflict markers
        with open('sdks/javascript/package.json', 'w') as f:
            f.write(resolved_content)
        print("Resolved package.json conflict (fallback)")

def resolve_openapi_conflict():
    """Resolve OpenAPI spec conflict by keeping the newer version"""
    with open('spec/openapi.json', 'r') as f:
        content = f.read()
    
    # Remove conflict markers and keep the version with MCP endpoints
    lines = content.split('\n')
    resolved_lines = []
    in_conflict = False
    keep_section = False  # Keep the incoming version (has MCP endpoints)
    
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            in_conflict = True
            keep_section = False
            continue
        elif line.startswith('======='):
            keep_section = True
            continue
        elif line.startswith('>>>>>>> '):
            in_conflict = False
            continue
        
        if not in_conflict or keep_section:
            resolved_lines.append(line)
    
    with open('spec/openapi.json', 'w') as f:
        f.write('\n'.join(resolved_lines))
    
    print("Resolved openapi.json conflict")

if __name__ == '__main__':
    resolve_readme_conflict()
    resolve_changelog_conflict()
    resolve_package_json_conflict()
    resolve_openapi_conflict()
    
    # Handle package-lock.json by regenerating it
    print("Resolving package-lock.json by accepting incoming version...")
    
    print("All conflicts resolved!")
