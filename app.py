import os
import subprocess
import shutil
from flask import Flask, request, send_file, jsonify, send_from_directory, Response
from flask_cors import CORS
from jinja2 import Environment, FileSystemLoader

app = Flask(__name__)
CORS(app)  # Allow Vercel frontend to call the API

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
OUTPUT_DIR = os.path.join(BASE_DIR, 'output')
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Path to pdflatex. Default to system PATH (works in Docker/Linux via apt-get).
PDFLATEX_PATH = 'pdflatex'
# Local Windows fallback check for MiKTeX.
windows_miktex_path = os.path.join(
    os.path.expanduser('~'),
    'AppData', 'Local', 'Programs', 'MiKTeX', 'miktex', 'bin', 'x64', 'pdflatex.exe'
)
if os.path.exists(windows_miktex_path) and os.name == 'nt':
    PDFLATEX_PATH = windows_miktex_path


def escape_latex(value):
    """Escape LaTeX special characters in user input."""
    if not isinstance(value, str):
        return value
    replacements = [
        ('\\', r'\textbackslash{}'),
        ('&', r'\&'),
        ('%', r'\%'),
        ('$', r'\$'),
        ('#', r'\#'),
        ('_', r'\_'),
        ('{', r'\{'),
        ('}', r'\}'),
        ('~', r'\textasciitilde{}'),
        ('^', r'\textasciicircum{}'),
    ]
    for old, new in replacements:
        value = value.replace(old, new)
    return value


def escape_data(data):
    """Recursively escape all string values in the data."""
    if isinstance(data, str):
        return escape_latex(data)
    elif isinstance(data, list):
        return [escape_data(item) for item in data]
    elif isinstance(data, dict):
        return {key: escape_data(value) for key, value in data.items()}
    return data


# Jinja2 environment with LaTeX-friendly delimiters
latex_env = Environment(
    loader=FileSystemLoader(TEMPLATE_DIR),
    block_start_string=r'\BLOCK{',
    block_end_string='}',
    variable_start_string=r'\VAR{',
    variable_end_string='}',
    comment_start_string=r'\#{',
    comment_end_string='}',
    autoescape=False,
)


@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(FRONTEND_DIR, filename)


@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Escape all LaTeX special characters
        safe_data = escape_data(data)

        # Determine which template to use (default to 'template' for backward compatibility)
        template_id = data.get('template_id', 'template')
        template_filename = f"{template_id}.tex"

        try:
            # Load and render LaTeX template
            template = latex_env.get_template(template_filename)
        except Exception:
            return jsonify({'error': f"Template '{template_id}' not found in templates directory"}), 400
        rendered = template.render(**safe_data)

        # Write rendered LaTeX to output directory
        tex_path = os.path.join(OUTPUT_DIR, 'resume.tex')
        pdf_path = os.path.join(OUTPUT_DIR, 'resume.pdf')

        # Clean ALL old output files before compiling
        for ext in ['pdf', 'aux', 'log', 'out', 'toc', 'nav', 'snm']:
            old_file = os.path.join(OUTPUT_DIR, f'resume.{ext}')
            if os.path.exists(old_file):
                os.remove(old_file)

        with open(tex_path, 'w', encoding='utf-8') as f:
            f.write(rendered)

        # First compile — may trigger MiKTeX package/font installation
        result1 = subprocess.run(
            [PDFLATEX_PATH, '-interaction=nonstopmode', '-output-directory', OUTPUT_DIR, tex_path],
            capture_output=True,
            text=True,
            timeout=120,
        )

        # Second compile — resolves references and produces final output
        result2 = subprocess.run(
            [PDFLATEX_PATH, '-interaction=nonstopmode', '-output-directory', OUTPUT_DIR, tex_path],
            capture_output=True,
            text=True,
            timeout=120,
        )

        if not os.path.exists(pdf_path):
            details = result2.stdout or result1.stdout or result2.stderr or result1.stderr
            return jsonify({
                'error': 'PDF compilation failed',
                'details': details[-2000:] if details else 'No output from pdflatex'
            }), 500

        # Read PDF as bytes
        with open(pdf_path, 'rb') as pdf_file:
            pdf_data = pdf_file.read()

        # Verify PDF integrity — must end with %%EOF
        if not pdf_data or len(pdf_data) < 1000 or b'%%EOF' not in pdf_data[-128:]:
            # Try one more compile if PDF seems truncated
            subprocess.run(
                [PDFLATEX_PATH, '-interaction=nonstopmode', '-output-directory', OUTPUT_DIR, tex_path],
                capture_output=True,
                text=True,
                timeout=120,
            )
            with open(pdf_path, 'rb') as pdf_file:
                pdf_data = pdf_file.read()
            if not pdf_data or len(pdf_data) < 1000 or b'%%EOF' not in pdf_data[-128:]:
                return jsonify({'error': 'PDF compilation produced an invalid file. Please try again.'}), 500

        return Response(
            pdf_data,
            mimetype='application/pdf',
            headers={
                'Content-Disposition': 'attachment; filename=resume.pdf',
                'Content-Length': str(len(pdf_data)),
            }
        )

    except subprocess.TimeoutExpired:
        return jsonify({'error': 'LaTeX compilation timed out'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
