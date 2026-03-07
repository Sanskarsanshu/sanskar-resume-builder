# Sanskar Resume Builder 📄🚀

A full-stack web application designed to dynamically generate professional LaTeX resumes from a simple web form.

## 🌟 Features
- **Dynamic Form**: Add unlimited projects, achievements, experience entries, and certifications dynamically.
- **LaTeX Compilation**: Automatically compiles user data into a high-quality PDF using `pdflatex`.
- **Modern UI**: Dark glassmorphism theme built with Vanilla JS, CSS, and HTML.
- **Jinja2 Templating**: Integrates Jinja2 with LaTeX for precise formatting and structure.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python, Flask
- **Template Engine**: Jinja2
- **PDF Generation**: MiKTeX (`pdflatex`)

## 🚀 Getting Started

### Prerequisites
1. Python 3.8+
2. **MiKTeX** (or any LaTeX distribution providing `pdflatex`)
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application
1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```
3. Fill out the form and click **Generate Resume PDF**.

## 📝 License
This project is open-source and free to use.
