#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path

def find_broken_links():
    """Find all broken internal links in markdown files"""
    broken_links = []
    all_files = []
    
    # Get all markdown files
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                all_files.append(filepath)
    
    # Create a set of all existing files (without .md extension for links)
    existing_pages = set()
    for filepath in all_files:
        # Convert file path to potential link path
        rel_path = os.path.relpath(filepath, '.')
        if rel_path == 'README.md':
            existing_pages.add('/')
            existing_pages.add('')
        else:
            # Remove .md extension and convert to URL path
            page_path = rel_path.replace('.md', '').replace('\\', '/')
            existing_pages.add('/' + page_path)
            existing_pages.add(page_path)
    
    print(f"Found {len(all_files)} markdown files")
    print(f"Existing pages: {sorted(existing_pages)[:10]}...")  # Show first 10
    
    # Check each file for broken links
    for filepath in all_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find all markdown links [text](url)
        links = re.findall(r'\[([^\]]*)\]\(([^)]*)\)', content)
        
        for link_text, link_url in links:
            # Skip external links, anchors, and empty links
            if (link_url.startswith('http') or 
                link_url.startswith('#') or 
                link_url.startswith('mailto:') or
                not link_url.strip() or
                link_url == '()'):
                continue
                
            # Check if internal link exists
            clean_url = link_url.split('#')[0]  # Remove anchor
            if clean_url and clean_url not in existing_pages:
                broken_links.append({
                    'file': filepath,
                    'link_text': link_text,
                    'link_url': link_url,
                    'line': content[:content.find(f'[{link_text}]({link_url})')].count('\n') + 1
                })
    
    return broken_links

if __name__ == '__main__':
    broken = find_broken_links()
    
    print(f"\n=== BROKEN LINKS AUDIT ===")
    print(f"Found {len(broken)} broken internal links:\n")
    
    for link in broken:
        print(f"File: {link['file']}")
        print(f"  Line {link['line']}: [{link['link_text']}]({link['link_url']})")
        print()
    
    # Save to JSON for processing
    with open('broken_links.json', 'w') as f:
        json.dump(broken, f, indent=2)
    
    print(f"Results saved to broken_links.json")
