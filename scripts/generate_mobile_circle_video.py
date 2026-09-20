import math
import os
import subprocess
import numpy as np
from PIL import Image, ImageFilter

BASE_IMG_PATH = "public/hero-bg.jpg"
OUTPUT_MP4 = "public/hero-circle-mobile.mp4"
OUTPUT_WEBM = "public/hero-circle-mobile.webm"
OUTPUT_POSTER = "public/hero-circle-mobile.jpg"

SIZE = 720
FPS = 30
DURATION = 6.0  # 6-second seamless loop
TOTAL_FRAMES = int(FPS * DURATION)

# Crop coordinates for the 720x720 team circle from public/hero-bg.jpg
CROP_BOX = (635, 10, 1355, 730)

def create_particles(num_particles=45, seed=42):
    np.random.seed(seed)
    particles = []
    for _ in range(num_particles):
        x0 = np.random.uniform(40, SIZE - 40)
        y0 = np.random.uniform(0, SIZE)
        radius = np.random.uniform(1.5, 3.5)
        speed = np.random.uniform(35, 70)
        w_amp = np.random.uniform(8, 22)
        w_freq = np.random.choice([1, 2, 3])
        phase = np.random.uniform(0, 2 * math.pi)

        tint = np.random.uniform(0, 1)
        if tint < 0.65:
            color = (255, np.random.randint(45, 85), np.random.randint(55, 95))
        elif tint < 0.88:
            color = (255, np.random.randint(110, 175), np.random.randint(120, 185))
        else:
            color = (255, 235, 235)  # white-hot spark

        particles.append({
            'x0': x0,
            'y0': y0,
            'r': radius,
            'speed': speed,
            'w_amp': w_amp,
            'w_freq': w_freq,
            'phase': phase,
            'color': color,
            'alpha': np.random.uniform(0.4, 0.9)
        })
    return particles

def main():
    print(f"Loading {BASE_IMG_PATH}...")
    full_img = Image.open(BASE_IMG_PATH).convert("RGB")
    crop_img = full_img.crop(CROP_BOX)
    crop_arr = np.array(crop_img, dtype=np.float32)

    # Save initial poster image
    crop_img.save(OUTPUT_POSTER, quality=95)
    print(f"Saved poster: {OUTPUT_POSTER} ({SIZE}x{SIZE})")

    # Detect glowing red/crimson neon elements (holograms, dragon logos)
    r = crop_arr[:, :, 0]
    g = crop_arr[:, :, 1]
    b = crop_arr[:, :, 2]
    neon_mask = (r > 130) & (r > g * 1.35) & (r > b * 1.35)
    neon_img = Image.fromarray((neon_mask * 255).astype(np.uint8))
    neon_glow_img = neon_img.filter(ImageFilter.GaussianBlur(radius=6))
    neon_glow = np.array(neon_glow_img, dtype=np.float32) / 255.0

    particles = create_particles(45)

    # Setup ffmpeg process for MP4
    mp4_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{SIZE}x{SIZE}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        OUTPUT_MP4
    ]

    print(f"Streaming {TOTAL_FRAMES} frames to ffmpeg ({OUTPUT_MP4})...")
    proc = subprocess.Popen(mp4_cmd, stdin=subprocess.PIPE)

    for i in range(TOTAL_FRAMES):
        t = i / FPS
        norm_t = (2.0 * math.pi * i) / TOTAL_FRAMES

        # 1. Subtle breathing zoom (1.000 to 1.015)
        zoom = 1.0 + 0.012 * (0.5 - 0.5 * math.cos(norm_t))
        if zoom > 1.001:
            zw = int(SIZE / zoom)
            zh = int(SIZE / zoom)
            zx = (SIZE - zw) // 2
            zy = (SIZE - zh) // 2
            cropped_sub = crop_arr[zy:zy+zh, zx:zx+zw, :]
            sub_img = Image.fromarray(cropped_sub.astype(np.uint8)).resize((SIZE, SIZE), Image.Resampling.BILINEAR)
            frame_arr = np.array(sub_img, dtype=np.float32)
        else:
            frame_arr = crop_arr.copy()

        # 2. Neon hologram pulsing (2 full sine cycles per 6s)
        pulse = 0.5 + 0.5 * math.sin(norm_t * 2.0)
        glow_intensity = 0.18 + 0.22 * pulse
        # Add crimson-tinted glow boost
        frame_arr[:, :, 0] += neon_glow * (glow_intensity * 80.0)
        frame_arr[:, :, 1] += neon_glow * (glow_intensity * 20.0)
        frame_arr[:, :, 2] += neon_glow * (glow_intensity * 25.0)

        # 3. Particle sparks floating up
        for p in particles:
            py = (p['y0'] - p['speed'] * t) % SIZE
            px = p['x0'] + p['w_amp'] * math.sin(norm_t * p['w_freq'] + p['phase'])

            # Soft vertical alpha fade near top/bottom
            fade = min(1.0, py / 80.0) * min(1.0, (SIZE - py) / 80.0)
            cur_alpha = p['alpha'] * fade

            if cur_alpha <= 0.02 or px < 2 or px >= SIZE - 2 or py < 2 or py >= SIZE - 2:
                continue

            ix, iy = int(px), int(py)
            ir = int(p['r']) + 1
            y_min, y_max = max(0, iy - ir), min(SIZE, iy + ir + 1)
            x_min, x_max = max(0, ix - ir), min(SIZE, ix + ir + 1)

            for yy in range(y_min, y_max):
                for xx in range(x_min, x_max):
                    d2 = (xx - px)**2 + (yy - py)**2
                    if d2 <= (p['r'] + 0.5)**2:
                        edge_fade = max(0.0, 1.0 - math.sqrt(d2) / (p['r'] + 0.5))
                        blended = cur_alpha * edge_fade
                        for c in range(3):
                            frame_arr[yy, xx, c] = frame_arr[yy, xx, c] * (1.0 - blended) + p['color'][c] * blended

        np.clip(frame_arr, 0, 255, out=frame_arr)
        proc.stdin.write(frame_arr.astype(np.uint8).tobytes())

        if (i + 1) % 30 == 0 or i == TOTAL_FRAMES - 1:
            print(f"Rendered frame {i+1}/{TOTAL_FRAMES} ({(i+1)*100//TOTAL_FRAMES}%)")

    proc.stdin.close()
    proc.wait()
    print("MP4 generation complete!")

    # Now create WebM version from MP4
    print("Converting to WebM (VP9)...")
    webm_cmd = [
        "ffmpeg", "-y",
        "-i", OUTPUT_MP4,
        "-c:v", "libvpx-vp9",
        "-crf", "26",
        "-b:v", "0",
        OUTPUT_WEBM
    ]
    subprocess.run(webm_cmd, check=True)
    print("WebM generation complete!")

if __name__ == "__main__":
    main()
