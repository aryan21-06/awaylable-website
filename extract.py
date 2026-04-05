import cv2
import numpy as np
import os

img_path = 'assets/designs.png'
img = cv2.imread(img_path)

if img is None:
    print("Could not read image")
    exit(1)

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

# morphological close to merge parts of the same drawing
kernel = np.ones((25,25), np.uint8)
closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

idx = 1
for c in contours:
    x, y, w, h = cv2.boundingRect(c)
    if w > 80 and h > 80:
        pad = 15
        y1 = max(0, y - pad)
        y2 = min(img.shape[0], y + h + pad)
        x1 = max(0, x - pad)
        x2 = min(img.shape[1], x + w + pad)
        
        cropped = img[y1:y2, x1:x2]
        rgba = cv2.cvtColor(cropped, cv2.COLOR_BGR2BGRA)
        
        # Distance from white
        dist = np.sqrt(np.sum((rgba[:,:,:3] - [255,255,255])**2, axis=-1))
        # Fade alpha based on how close to white it is
        alpha = np.where(dist < 50, dist / 50 * 255, 255).astype(np.uint8)
        rgba[:,:,3] = alpha
        
        out_path = f'assets/ornament_{idx}.png'
        cv2.imwrite(out_path, rgba)
        idx += 1

print(f"Extracted {idx-1} ornaments.")
