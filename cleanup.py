import os

def final_cleanup():
    for filename in os.listdir('.'):
        if filename.endswith('.html'):
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remove the old, now broken/empty sticky banner
            import re
            content = re.sub(r'<!-- Educational Disclaimer Banner -->.*?</div>', '', content, flags=re.DOTALL)
            
            # Ensure the new banner is clean
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)

if __name__ == "__main__":
    final_cleanup()
