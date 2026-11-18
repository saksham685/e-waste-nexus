from PIL import Image, ImageDraw, ImageFont
import os
import zipfile
import base64

def generate_block_diagram():
    # Create high-res block diagram image
    img = Image.new("RGB", (1000, 360), color="#ffffff")
    draw = ImageDraw.Draw(img)

    # Box coordinates
    boxes = [
        ("Citizen\nConsignor", 40, 110, 220, 230, "#e8f5e9", "#2e7d32"),
        ("Logistics Partner\n(Weighbridge)", 280, 110, 460, 230, "#e0f7fa", "#00838f"),
        ("Certified Smelter\n(Refining)", 520, 110, 700, 230, "#fff8e1", "#f57f17"),
        ("CPCB Admin &\nEPR Exchange", 760, 110, 950, 230, "#ffebee", "#c62828")
    ]

    for title, x1, y1, x2, y2, fill, stroke in boxes:
        draw.rounded_rectangle([x1, y1, x2, y2], radius=12, fill=fill, outline=stroke, width=3)
        # Split text into lines
        lines = title.split("\n")
        total_h = len(lines) * 22
        cur_y = (y1 + y2) // 2 - total_h // 2
        for line in lines:
            bbox = draw.textbbox((0, 0), line)
            w = bbox[2] - bbox[0]
            draw.text(((x1 + x2) // 2 - w // 2, cur_y), line, fill="#111111")
            cur_y += 22

    # Draw arrows between boxes
    arrow_pairs = [
        ((220, 170), (280, 170), "Pickup Request"),
        ((460, 170), (520, 170), "Weighed Consignment"),
        ((700, 170), (760, 170), "Form-6 & Credits")
    ]

    for (start, end, label) in arrow_pairs:
        draw.line([start, end], fill="#333333", width=3)
        # arrowhead
        ex, ey = end
        draw.polygon([(ex, ey), (ex - 10, ey - 6), (ex - 10, ey + 6)], fill="#333333")
        # label
        bbox = draw.textbbox((0, 0), label)
        lw = bbox[2] - bbox[0]
        draw.text(((start[0] + end[0]) // 2 - lw // 2, start[1] - 24), label, fill="#555555")

    img.save("block_diagram.png", "PNG")
    print("Block diagram generated successfully!")

if __name__ == "__main__":
    generate_block_diagram()
