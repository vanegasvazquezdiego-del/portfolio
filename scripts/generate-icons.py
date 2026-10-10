"""Generate public/icon-192.png and icon-512.png (Pillow only, no extra assets)."""
from PIL import Image, ImageDraw

def make(size, path):
    img = Image.new("RGBA", (size, size), (5, 7, 15, 255))
    d = ImageDraw.Draw(img)
    m = int(size * 0.09)
    d.rounded_rectangle([m, m, size - m, size - m], radius=int(size * 0.2), outline=(16, 185, 129, 255), width=max(2, size // 64))
    d.text((size / 2, size / 2), "</>", fill=(16, 185, 129, 255), anchor="mm")
    img.save(path)
    print("wrote", path)

make(192, "public/icon-192.png")
make(512, "public/icon-512.png")
