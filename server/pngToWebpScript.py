
import sys
from pathlib import Path
from PIL import Image

def convert_images_to_webp(source_dir, output_dir):
    source_path = Path(source_dir)
    output_path = Path(output_dir)

    if not source_path.exists():
        print(f"Le dossier source '{source_dir}' n'existe pas.")
        return

    for png_path in source_path.rglob("*.png"):  # Recherche récursive des fichiers .png
        relative_path = png_path.relative_to(source_path)
        webp_path = output_path / relative_path.with_suffix(".webp")  # Conserver la structure du dossier

        webp_path.parent.mkdir(parents=True, exist_ok=True)  # Créer les dossiers si nécessaire

        if webp_path.exists():
            print(f"{webp_path} existe déjà, saut de la conversion.")
            continue

        try:
            with Image.open(png_path) as img:
                img.save(webp_path, "WEBP", quality=80)  # Qualité ajustable
                print(f"Converti: {png_path} -> {webp_path}")
        except Exception as e:
            print(f"Erreur lors de la conversion de {png_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert.py <source_directory> <output_directory>")
    else:
        source_directory = sys.argv[1]
        output_directory = sys.argv[2]
        convert_images_to_webp(source_directory, output_directory)
