import requests
from bs4 import BeautifulSoup
import re

def get_website_content(product_website_link):
    # ===== Get Product Description =====
    response = requests.get(product_website_link)
    product_website = response.text

    # Parse HTML content
    soup = BeautifulSoup(product_website, 'html.parser')

    # Extract title
    title = soup.find('title')
    title_text = title.get_text().strip() if title else "No title found"

    # Extract headings with their associated content in markdown format
    markdown_content = []

    # Find all heading elements and their following content
    for tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        for heading in soup.find_all(tag):
            heading_text = heading.get_text().strip()
            
            # Get the content that follows this heading until the next heading
            content = []
            current = heading.next_sibling
            
            while current and not (hasattr(current, 'name') and current.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                if hasattr(current, 'get_text'):
                    text = current.get_text().strip()
                    if text:
                        content.append(text)
                current = current.next_sibling
            
            # Clean up the content
            if content:
                content_text = ' '.join(content)
                # Clean up whitespace
                content_text = re.sub(r'\s+', ' ', content_text).strip()
                # Fix concatenated words
                content_text = re.sub(r'([a-z])([A-Z])', r'\1 \2', content_text)
                
                # Convert to markdown format based on heading level
                heading_level = int(tag[1])  # h1 -> 1, h2 -> 2, etc.
                markdown_heading = '#' * heading_level + ' ' + heading_text
                
                markdown_content.append({
                    'heading': markdown_heading,
                    'content': content_text
                })

    website_content = f"# {title_text}\n\n"
    for item in markdown_content:
        website_content += f"{item['heading']}\n {item['content']}\n"

    return website_content