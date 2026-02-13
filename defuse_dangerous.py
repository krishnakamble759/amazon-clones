import os

def aggressively_defuse_phishing_flags():
    """
    Adds highly visible disclaimers and modifies metadata to ensure 
    automated systems (like Google Safe Browsing) see this as a demo project.
    """
    banner_html = '''
    <!-- AGGRESSIVE DEMO DISCLAIMER -->
    <div style="background: #dc3545; color: #fff; text-align: center; padding: 12px; font-weight: bold; position: fixed; top: 0; left: 0; width: 100%; z-index: 100000; font-size: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.5);">
        ATTENTION: THIS IS A STUDENT PROJECT FOR DEMO PURPOSES ONLY. THIS IS NOT THE REAL AMAZON. 
        <br>DO NOT ENTER ANY REAL PASSWORDS OR CREDIT CARD DETAILS.
    </div>
    <div style="height: 60px;"></div> <!-- Spacer -->
    '''
    
    # Modal for first-time visitors
    modal_script = '''
    <script>
    if (!localStorage.getItem('demo_acknowledged')) {
        const modal = document.createElement('div');
        modal.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 200000; display: flex; align-items: center; justify-content: center; padding: 20px;";
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; text-align: center; font-family: sans-serif;">
                <h2 style="color: #d9534f; margin-top: 0;">⚠️ EDUCATIONAL DEMO ⚠️</h2>
                <p>This website is a <strong>student project</strong> developed for portfolio purposes.</p>
                <p style="background: #f8d7da; padding: 10px; border: 1px solid #f5c6cb; color: #721c24;">
                    <strong>Security Warning:</strong> This is NOT the real Amazon.in. <br>
                    Please <strong>NEVER</strong> enter real account credentials or payment information here.
                </p>
                <button id="ackBtn" style="background: #febd69; border: 1px solid #a88734; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 15px;">
                    I Understand (Proceed to Demo)
                </button>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('ackBtn').onclick = () => {
            localStorage.setItem('demo_acknowledged', 'true');
            modal.remove();
        };
    }
    </script>
    '''

    for filename in os.listdir('.'):
        if filename.endswith('.html'):
            print(f"Aggressively defusing {filename}...")
            with open(filename, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            new_lines = []
            for line in lines:
                # 1. Update Title
                if '<title>' in line:
                    line = '    <title>DEMO STORE - Educational Portfolio Project (NOT FOR REAL SHOPPING)</title>\n'
                
                # 2. Update Robots
                if '<meta name="robots"' in line:
                    line = '    <meta name="robots" content="noindex, nofollow, noarchive">\n'
                
                # 3. Add Banner after <body>
                if '<body' in line:
                    new_lines.append(line)
                    new_lines.append(banner_html)
                    continue
                
                # 4. Remove previous banner if any (simple check)
                if 'EDUCATIONAL PROJECT: This is NOT the real Amazon' in line:
                    continue
                
                # 5. Add Modal Script before </body>
                if '</body>' in line:
                    new_lines.append(modal_script)
                    new_lines.append(line)
                    continue
                
                # 6. Change navbar logo domain if present
                if '<span class="logo-domain">' in line:
                    line = line.replace('.in', ' (DEMO PROJECT)')
                
                new_lines.append(line)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)

if __name__ == "__main__":
    aggressively_defuse_phishing_flags()
