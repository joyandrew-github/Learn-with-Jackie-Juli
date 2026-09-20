import math
import os
import subprocess
import numpy as np
from PIL import Image, ImageFilter

BASE_IMG_PATH = "public/hero-bg.jpg"
OUTPUT_MP4 = "public/hero-bg.mp4"
OUTPUT_WEBM = "public/hero-bg.webm"

WIDTH, HEIGHT = 1376, 768
FPS = 30
DURATION = 6.0  # 6-second seamless loop
TOTAL_FRAMES = int(FPS * DURATION)

def create_particle_system(num_particles=65, seed=42):
    np.random.seed(seed)
    particles = []
    for _ in range(num_particles):
        x0 = np.random.uniform(50, WIDTH - 50)
        y0 = np.random.uniform(0, HEIGHT)
        radius = np.random.uniform(1.8, 4.2)
        speed = np.random.uniform(35, 75)
        wobble_amp = np.random.uniform(12, 30)
        wobble_freq = np.random.choice([1, 2, 3])
        phase = np.random.uniform(0, 2 * math.pi)
        
        # Color: crimson/coral with bright hot center
        tint_choice = np.random.uniform(0, 1)
        if tint_choice < 0.6:
            color = (255, np.random.randint(40, 80), np.random.randint(50, 90))
        elif tint_choice < 0.85:
            color = (255, np.random.randint(100, 160), np.random.randint(110, 170))
        else:
            color = (255, 220, 220)  # spark white
            
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

def main():
    print(f"Loading base image from {BASE_IMG_PATH}...")
    base_img = Image.open(BASE_IMG_PATH).convert("RGB")
    base_arr = np.array(base_img, dtype=np.float32)
    
    # Precompute neon mask for holograms and glowing elements
    # High red saturation areas
    r = base_arr[:, :, 0]
    g = base_arr[:, :, 1]
    b = base_arr[:, :, 2]
    
    neon_mask = (r > 140) & (r > g * 1.35) & (r > b * 1.35)
    neon_mask_img = Image.fromarray((neon_mask * 255).astype(np.uint8))
    # Gaussian blur for soft organic glow bloom
    neon_glow_img = neon_mask_img.filter(ImageFilter.GaussianBlur(radius=7))
    neon_glow_arr = np.array(neon_glow_img, dtype=np.float32) / 255.0
    
    # Precompute server rack LED blink points on the left (x < 550)
    led_mask = (neon_mask) & (np.arange(WIDTH)[None, :] < 550)
    led_points = np.argwhere(led_mask)
    # Pick a subset of 30 distinct LED cluster centers
    np.random.seed(123)
    if len(led_points) > 30:
        chosen_indices = np.random.choice(len(led_points), 30, replace=False)
        led_clusters = led_points[chosen_indices]
    else:
        led_clusters = led_points

    particles = create_particle_system(70)
    
    # Setup ffmpeg process for MP4
    mp4_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        OUTPUT_MP4
    ]
    
    print(f"Starting ffmpeg pipeline for {OUTPUT_MP4} ({TOTAL_FRAMES} frames)...")
    proc = subprocess.Popen(mp4_cmd, stdin=subprocess.PIPE)
    
    # Coordinate grids for particle rasterization
    center_x, center_y = 960.0, 420.0
    
    for f in range(TOTAL_FRAMES):
        t = f / FPS
        tau = 2.0 * math.pi * (t / DURATION)
        
        # 1. Subtle camera breathing (zoom 1.0 to 1.016 and subtle float)
        # Cosine ensures frame 0 and frame TOTAL_FRAMES match perfectly!
        zoom = 1.0 + 0.014 * (0.5 - 0.5 * math.cos(tau))
        shift_x = 1.5 * math.sin(tau)
        shift_y = 1.0 * math.sin(2.0 * tau)
        
        # We can apply the zoom and shift using affine transformation or PIL resize/crop
        # For smooth performance, crop and resize
        crop_w = WIDTH / zoom
        crop_h = HEIGHT / zoom
        crop_x = (center_x - crop_w / 2.0) + shift_x
        crop_y = (center_y - crop_h / 2.0) + shift_y
        
        # Keep inside bounds
        crop_x = max(0, min(WIDTH - crop_w, crop_x))
        crop_y = max(0, min(HEIGHT - crop_h, crop_y))
        
        # Base frame transformed
        frame_pil = base_img.crop((crop_x, crop_y, crop_x + crop_w, crop_y + crop_h)).resize((WIDTH, HEIGHT), Image.Resampling.BILINEAR)
        frame_arr = np.array(frame_pil, dtype=np.float32)
        
        # 2. Dynamic Hologram & Circular Frame Neon Pulse
        # Main neon pulse (2 cycles per 6s loop = smooth 3s harmonic)
        pulse_main = 0.5 - 0.5 * math.cos(2.0 * tau)  # range [0, 1]
        pulse_sec = 0.5 - 0.5 * math.cos(3.0 * tau)   # range [0, 1]
        glow_boost = 0.18 * pulse_main + 0.10 * pulse_sec
        
        # Apply glow boost to red channel and slightly green for warm intensity
        frame_arr[:, :, 0] += neon_glow_arr * (glow_boost * 160.0)
        frame_arr[:, :, 1] += neon_glow_arr * (glow_boost * 35.0)
        
        # 3. Laptop Screen Typing Micro-Flicker
        # Jackie's laptop area: y in [490, 680], x in [720, 930]
        flicker = 1.0 + 0.08 * math.sin(6.0 * tau) + 0.05 * math.sin(10.0 * tau)
        screen_region = frame_arr[490:680, 720:930]
        # boost red and warm light slightly in this zone
        frame_arr[490:680, 720:930, 0] = np.clip(screen_region[:, :, 0] * flicker, 0, 255)
        frame_arr[490:680, 720:930, 1] = np.clip(screen_region[:, :, 1] * (1.0 + (flicker - 1.0) * 0.4), 0, 255)

        # 4. Server Rack Blinking Indicator LEDs
        for idx, (ly, lx) in enumerate(led_clusters):
            # Phase offset for each LED
            led_phase = idx * 0.6
            blink = math.sin(tau * (3.0 + (idx % 3)) + led_phase)
            if blink > 0.65:
                intensity = (blink - 0.65) / 0.35 * 70.0
                y_min, y_max = max(0, ly - 2), min(HEIGHT, ly + 3)
                x_min, x_max = max(0, lx - 2), min(WIDTH, lx + 3)
                frame_arr[y_min:y_max, x_min:x_max, 0] += intensity
                frame_arr[y_min:y_max, x_min:x_max, 1] += intensity * 0.2

        # 5. Holographic Laser Sheen Sweep across the circular frame
        # Sweep passes across frame between t=1.5s and t=4.5s
        sweep_progress = (t / DURATION)  # 0 to 1
        # Two sweeps per loop
        sweep_x = (sweep_progress * 2.0) % 1.0
        # Peak beam center
        beam_cx = 550.0 + sweep_x * 900.0  # from x=550 to x=1450
        # Diagonal beam equation: x - y * 0.45
        beam_dist = np.abs((np.arange(WIDTH)[None, :] - np.arange(HEIGHT)[:, None] * 0.35) - beam_cx)
        beam_mask = np.exp(-(beam_dist ** 2) / (2.0 * (45.0 ** 2)))
        # Only visible within the tech artwork area and with smooth fade at loop boundaries
        sheen_fade = math.sin(tau) ** 2  # smooth zero at t=0 and t=T
        frame_arr[:, :, 0] += beam_mask * (38.0 * sheen_fade)
        frame_arr[:, :, 1] += beam_mask * (12.0 * sheen_fade)
        frame_arr[:, :, 2] += beam_mask * (18.0 * sheen_fade)

        # 6. Floating Cyber Particles (Seamless Wrapping)
        for p in particles:
            # Vertical travel with exact wrapping
            travel = p['speed'] * t
            cur_y = (p['y0'] - travel) % HEIGHT
            
            # Horizontal harmonic drift (sinusoidal with integer frequency -> seamless!)
            cur_x = p['x0'] + p['w_amp'] * math.sin(tau * p['w_freq'] + p['phase'])
            cur_x = np.clip(cur_x, 10, WIDTH - 10)
            
            # Fade out at top and bottom boundaries for seamlessness
            edge_fade = 1.0
            if cur_y < 80:
                edge_fade = cur_y / 80.0
            elif cur_y > HEIGHT - 80:
                edge_fade = (HEIGHT - cur_y) / 80.0
                
            # Particle alpha
            alpha = p['alpha'] * edge_fade * (0.8 + 0.2 * math.sin(tau * 2.0 + p['phase']))
            
            # Rasterize particle (small radial Gaussian blob)
            r_int = int(math.ceil(p['r'] * 2.5))
            iy, ix = int(round(cur_y)), int(round(cur_x))
            y0_box = max(0, iy - r_int)
            y1_box = min(HEIGHT, iy + r_int + 1)
            x0_box = max(0, ix - r_int)
            x1_box = min(WIDTH, ix + r_int + 1)
            
            if y1_box > y0_box and x1_box > x0_box:
                grid_y, grid_x = np.ogrid[y0_box - iy:y1_box - iy, x0_box - ix:x1_box - ix]
                dist_sq = grid_y ** 2 + grid_x ** 2
                blob = np.exp(-dist_sq / (2.0 * (p['r'] ** 2))) * alpha
                
                # Additive blend
                for c_idx in range(3):
                    frame_arr[y0_box:y1_box, x0_box:x1_box, c_idx] += blob * p['color'][c_idx]

        # Clip final frame to valid uint8 range
        final_frame = np.clip(frame_arr, 0, 255).astype(np.uint8)
        proc.stdin.write(final_frame.tobytes())
        
        if (f + 1) % 30 == 0:
            print(f"Rendered {f + 1}/{TOTAL_FRAMES} frames ({(f + 1) / TOTAL_FRAMES * 100:.1f}%)")

    proc.stdin.close()
    proc.wait()
    print(f"Successfully generated {OUTPUT_MP4} (Code: {proc.returncode})")
    
    # Also generate WebM version for ultimate web standards
    print(f"Generating optimized WebM version: {OUTPUT_WEBM}...")
    webm_cmd = [
        "ffmpeg", "-y",
        "-i", OUTPUT_MP4,
        "-c:v", "libvpx-vp9",
        "-crf", "30",
        "-b:v", "0",
        "-pix_fmt", "yuv420p",
        OUTPUT_WEBM
    ]
    subprocess.run(webm_cmd, check=True)
    print("All video renders complete!")

if __name__ == "__main__":
    main()
