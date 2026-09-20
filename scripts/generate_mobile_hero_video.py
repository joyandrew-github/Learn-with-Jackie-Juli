import math
import os
import subprocess
import numpy as np
from PIL import Image, ImageFilter

BASE_IMG_PATH = "public/hero-bg.jpg"
OUTPUT_MP4 = "public/hero-bg-mobile.mp4"
OUTPUT_WEBM = "public/hero-bg-mobile.webm"
OUTPUT_POSTER = "public/hero-bg-mobile.jpg"

MOB_W, MOB_H = 720, 1280
FPS = 30
DURATION = 6.0  # 6-second seamless loop
TOTAL_FRAMES = int(FPS * DURATION)

def create_particle_system(num_particles=80, seed=101):
    np.random.seed(seed)
    particles = []
    for _ in range(num_particles):
        x0 = np.random.uniform(20, MOB_W - 20)
        y0 = np.random.uniform(0, MOB_H)
        radius = np.random.uniform(1.8, 4.0)
        speed = np.random.uniform(40, 85)
        wobble_amp = np.random.uniform(10, 26)
        wobble_freq = np.random.choice([1, 2, 3])
        phase = np.random.uniform(0, 2 * math.pi)
        
        # Color: crimson/coral with bright hot center
        tint_choice = np.random.uniform(0, 1)
        if tint_choice < 0.65:
            color = (255, np.random.randint(40, 80), np.random.randint(50, 90))
        elif tint_choice < 0.85:
            color = (255, np.random.randint(110, 170), np.random.randint(120, 180))
        else:
            color = (255, 230, 230)  # spark white
            
        base_alpha = np.random.uniform(0.35, 0.85)
        particles.append({
            'x0': x0,
            'y0': y0,
            'r': radius,
            'speed': speed,
            'w_amp': wobble_amp,
            'w_freq': wobble_freq,
            'phase': phase,
            'color': color,
            'alpha': base_alpha
        })
    return particles

def build_mobile_base(base_img):
    """
    Creates a 720x1280 mobile portrait composition:
    - Upper half: Crop centered on the circular cyber team frame (Jackie & Juli).
    - Lower half: Seamlessly blended with dark cyberpunk server atmosphere and soft gradient to #09070b.
    """
    w, h = base_img.size  # 1376 x 768
    
    # We crop the right side circle (x from 620 to 1340, y from 10 to 730)
    # Circle diameter ~ 700px.
    circle_crop = base_img.crop((630, 15, 1340, 725))  # 710 x 710
    circle_crop = circle_crop.resize((680, 680), Image.Resampling.LANCZOS)
    
    # Left server background texture to fill the canvas
    server_bg = base_img.crop((0, 0, 700, 768)).resize((MOB_W, MOB_H), Image.Resampling.BILINEAR)
    # Darken server background slightly so text and foreground pop
    server_arr = np.array(server_bg, dtype=np.float32) * 0.45
    
    # Canvas
    canvas = np.zeros((MOB_H, MOB_W, 3), dtype=np.float32)
    # Fill with deep obsidian cyber tone
    canvas[:, :, 0] = 9.0
    canvas[:, :, 1] = 7.0
    canvas[:, :, 2] = 11.0
    
    # Blend server texture in the upper 800px
    for y in range(MOB_H):
        alpha = max(0.0, min(1.0, (850 - y) / 600.0))
        canvas[y, :, :] = canvas[y, :, :] * (1.0 - alpha) + server_arr[y, :, :] * alpha

    # Paste the circle crop onto the upper canvas (top offset ~ 40px, centered horizontally)
    cw, ch = circle_crop.size
    cx_offset = (MOB_W - cw) // 2  # ~ 20px
    cy_offset = 35                 # 35px from top
    
    circle_arr = np.array(circle_crop, dtype=np.float32)
    
    # Circular soft mask for the team emblem so edges blend smoothly into the dark room
    mask = Image.new("L", (cw, ch), 0)
    mask_draw = np.zeros((ch, cw), dtype=np.float32)
    cy_c, cx_c = ch / 2.0, cw / 2.0
    rad = min(cy_c, cx_c) - 4.0
    
    y_idx, x_idx = np.ogrid[:ch, :cw]
    dist = np.sqrt((x_idx - cx_c)**2 + (y_idx - cy_c)**2)
    # Soft circular edge
    soft_mask = np.clip((rad - dist) / 6.0, 0.0, 1.0)
    
    for c in range(3):
        canvas[cy_offset:cy_offset+ch, cx_offset:cx_offset+cw, c] = (
            canvas[cy_offset:cy_offset+ch, cx_offset:cx_offset+cw, c] * (1.0 - soft_mask) +
            circle_arr[:, :, c] * soft_mask
        )
        
    # Vertical readability gradient for hero copy over the lower 65%
    # From y=480 down to y=1280:
    for y in range(480, MOB_H):
        fade = min(1.0, (y - 480) / 450.0)
        dark_target = np.array([9.0, 7.0, 11.0], dtype=np.float32)
        canvas[y, :, :] = canvas[y, :, :] * (1.0 - fade * 0.92) + dark_target * (fade * 0.92)

    mobile_base = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8))
    return mobile_base, (cx_offset, cy_offset, cw, ch)

def main():
    print(f"Loading base image from {BASE_IMG_PATH}...")
    base_img = Image.open(BASE_IMG_PATH).convert("RGB")
    
    print("Building mobile portrait composition (720x1280)...")
    mobile_base_img, circle_rect = build_mobile_base(base_img)
    base_arr = np.array(mobile_base_img, dtype=np.float32)
    
    # Save the initial poster image
    mobile_base_img.save(OUTPUT_POSTER, quality=92)
    print(f"Saved mobile poster: {OUTPUT_POSTER}")
    
    # Precompute neon mask for holograms in mobile canvas
    r = base_arr[:, :, 0]
    g = base_arr[:, :, 1]
    b = base_arr[:, :, 2]
    neon_mask = (r > 130) & (r > g * 1.3) & (r > b * 1.3)
    neon_mask_img = Image.fromarray((neon_mask * 255).astype(np.uint8))
    neon_glow_img = neon_mask_img.filter(ImageFilter.GaussianBlur(radius=6))
    neon_glow_arr = np.array(neon_glow_img, dtype=np.float32) / 255.0

    particles = create_particle_system(85)
    
    # Setup ffmpeg pipeline for MP4
    mp4_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{MOB_W}x{MOB_H}",
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
    
    print(f"Starting ffmpeg pipeline for {OUTPUT_MP4} ({TOTAL_FRAMES} frames)...")
    proc = subprocess.Popen(mp4_cmd, stdin=subprocess.PIPE)
    
    center_x = MOB_W / 2.0
    center_y = circle_rect[1] + circle_rect[3] / 2.0  # Center around the team
    
    for f in range(TOTAL_FRAMES):
        t = f / FPS
        tau = 2.0 * math.pi * (t / DURATION)
        
        # 1. Subtle camera breathing zoom & micro-float
        zoom = 1.0 + 0.012 * (0.5 - 0.5 * math.cos(tau))
        shift_y = 1.2 * math.sin(tau)
        
        crop_w = MOB_W / zoom
        crop_h = MOB_H / zoom
        crop_x = (center_x - crop_w / 2.0)
        crop_y = (center_y - crop_h / 2.0) + shift_y
        
        crop_x = max(0, min(MOB_W - crop_w, crop_x))
        crop_y = max(0, min(MOB_H - crop_h, crop_y))
        
        frame_pil = mobile_base_img.crop((crop_x, crop_y, crop_x + crop_w, crop_y + crop_h)).resize((MOB_W, MOB_H), Image.Resampling.BILINEAR)
        frame_arr = np.array(frame_pil, dtype=np.float32)
        
        # 2. Dynamic Neon Pulse
        pulse_main = 0.5 - 0.5 * math.cos(2.0 * tau)
        pulse_sec = 0.5 - 0.5 * math.cos(3.0 * tau)
        glow_boost = 0.16 * pulse_main + 0.09 * pulse_sec
        
        frame_arr[:, :, 0] += neon_glow_arr * (glow_boost * 150.0)
        frame_arr[:, :, 1] += neon_glow_arr * (glow_boost * 30.0)
        
        # 3. Laptop Screen Typing Micro-Flicker in mobile canvas coordinates
        # Circle is placed at cy_offset=35, cx_offset=20
        # Jackie's laptop is approximately at y in [490, 640], x in [300, 480]
        flicker = 1.0 + 0.08 * math.sin(6.0 * tau) + 0.05 * math.sin(10.0 * tau)
        sy0, sy1 = 490, 640
        sx0, sx1 = 300, 480
        screen_sub = frame_arr[sy0:sy1, sx0:sx1]
        frame_arr[sy0:sy1, sx0:sx1, 0] = np.clip(screen_sub[:, :, 0] * flicker, 0, 255)
        frame_arr[sy0:sy1, sx0:sx1, 1] = np.clip(screen_sub[:, :, 1] * (1.0 + (flicker - 1.0) * 0.4), 0, 255)

        # 4. Holographic Laser Sheen Sweep across the circular frame
        sweep_progress = (t / DURATION)
        sweep_y = (sweep_progress * 2.0) % 1.0
        beam_cy = 100.0 + sweep_y * 650.0
        
        # Angled beam: y - x * 0.35
        beam_dist = np.abs((np.arange(MOB_H)[:, None] - np.arange(MOB_W)[None, :] * 0.35) - beam_cy)
        beam_mask = np.exp(-(beam_dist ** 2) / (2.0 * (40.0 ** 2)))
        sheen_fade = math.sin(tau) ** 2
        
        # Restrict sheen primarily to the circle area (y < 720)
        y_limit = np.clip((720.0 - np.arange(MOB_H)[:, None]) / 80.0, 0.0, 1.0)
        combined_sheen = beam_mask * y_limit * sheen_fade
        
        frame_arr[:, :, 0] += combined_sheen * 35.0
        frame_arr[:, :, 1] += combined_sheen * 12.0
        frame_arr[:, :, 2] += combined_sheen * 16.0

        # 5. Floating Cyber Particles (Seamless Wrapping across 1280px)
        for p in particles:
            travel = p['speed'] * t
            cur_y = (p['y0'] - travel) % MOB_H
            cur_x = p['x0'] + p['w_amp'] * math.sin(tau * p['w_freq'] + p['phase'])
            cur_x = np.clip(cur_x, 8, MOB_W - 8)
            
            edge_fade = 1.0
            if cur_y < 80:
                edge_fade = cur_y / 80.0
            elif cur_y > MOB_H - 80:
                edge_fade = (MOB_H - cur_y) / 80.0
                
            alpha = p['alpha'] * edge_fade * (0.8 + 0.2 * math.sin(tau * 2.0 + p['phase']))
            
            r_int = int(math.ceil(p['r'] * 2.5))
            iy, ix = int(round(cur_y)), int(round(cur_x))
            y0_b = max(0, iy - r_int)
            y1_b = min(MOB_H, iy + r_int + 1)
            x0_b = max(0, ix - r_int)
            x1_b = min(MOB_W, ix + r_int + 1)
            
            if y1_b > y0_b and x1_b > x0_b:
                grid_y, grid_x = np.ogrid[y0_b - iy:y1_b - iy, x0_b - ix:x1_b - ix]
                dist_sq = grid_y ** 2 + grid_x ** 2
                blob = np.exp(-dist_sq / (2.0 * (p['r'] ** 2))) * alpha
                
                for c_idx in range(3):
                    frame_arr[y0_b:y1_b, x0_b:x1_b, c_idx] += blob * p['color'][c_idx]

        final_frame = np.clip(frame_arr, 0, 255).astype(np.uint8)
        proc.stdin.write(final_frame.tobytes())
        
        if (f + 1) % 30 == 0:
            print(f"Rendered {f + 1}/{TOTAL_FRAMES} mobile frames ({(f + 1) / TOTAL_FRAMES * 100:.1f}%)")

    proc.stdin.close()
    proc.wait()
    print(f"Successfully generated {OUTPUT_MP4} (Code: {proc.returncode})")
    
    # Generate WebM version
    print(f"Generating optimized mobile WebM version: {OUTPUT_WEBM}...")
    webm_cmd = [
        "ffmpeg", "-y",
        "-i", OUTPUT_MP4,
        "-c:v", "libvpx-vp9",
        "-crf", "32",
        "-b:v", "0",
        "-pix_fmt", "yuv420p",
        OUTPUT_WEBM
    ]
    subprocess.run(webm_cmd, check=True)
    print("Mobile video generation complete!")

if __name__ == "__main__":
    main()
