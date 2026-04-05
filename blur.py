from PIL import Image, ImageFilter
import os

images = [
    ("/home/user/.gemini/antigravity/brain/78a3d06e-dad2-4dae-ae6f-9da451340f60/new_sources_1775373767137.png", "assets/visha-training-dashboard.png"),
    ("/home/user/.gemini/antigravity/brain/78a3d06e-dad2-4dae-ae6f-9da451340f60/new_kpi_1775373798022.png", "assets/visha-insights-dashboard.png"),
    ("/home/user/.gemini/antigravity/brain/78a3d06e-dad2-4dae-ae6f-9da451340f60/new_kg_1775373812602.png", "assets/kg_dashboard.png")
]

for src, dest in images:
    if not os.path.exists(src):
        print(f"File not found: {src}")
        continue

    img = Image.open(src)
    w, h = img.size
    
    # Blur Top Left (Workspace Name)
    box1 = (0, 0, 260, 100)
    ic1 = img.crop(box1)
    for _ in range(3): # Multiple passes for heavier blur
        ic1 = ic1.filter(ImageFilter.GaussianBlur(15))
    img.paste(ic1, box1)

    # Blur Bottom Left (Profile Email & Name)
    box2 = (0, h - 150, 260, h)
    ic2 = img.crop(box2)
    for _ in range(3):
        ic2 = ic2.filter(ImageFilter.GaussianBlur(15))
    img.paste(ic2, box2)

    img.save(dest)
    print(f"Processed and saved to {dest}")
