#!/usr/bin/env python3
"""Scapeland photographic grade — warm vintage film look applied to every
site image by the asset pipeline, so the whole set reads as one camera.

Recipe: lifted blacks and soft highlights (film curve), warm cast in the
midtones, gently muted saturation with greens pulled toward sage, fine
luminance grain.

Usage: grade.py <image> [more images...]  (edits in place, keeps quality)
"""
import sys

import numpy as np
from PIL import Image, ImageEnhance


def film_curve(x, lift, ceil):
    """Map 0..255 to lift..ceil with a soft S easing."""
    t = x / 255.0
    t = t * t * (3.0 - 2.0 * t) * 0.30 + t * 0.70  # mild S-curve
    return lift + t * (ceil - lift)


def grade(path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)

    # 1. film curve: lifted blacks, soft ceiling — slightly different per
    #    channel for a warm, faded print feel
    a[..., 0] = film_curve(a[..., 0], 30.0, 248.0)  # R keeps most range
    a[..., 1] = film_curve(a[..., 1], 28.0, 242.0)
    a[..., 2] = film_curve(a[..., 2], 36.0, 224.0)  # B lifted + capped: warm

    # 2. warm midtone cast
    a[..., 0] *= 1.045
    a[..., 1] *= 1.015
    a[..., 2] *= 0.945

    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

    # 3. mute saturation a touch
    im = ImageEnhance.Color(im).enhance(0.80)
    im = ImageEnhance.Contrast(im).enhance(0.94)

    # 4. fine luminance grain
    a = np.asarray(im).astype(np.float32)
    rng = np.random.default_rng(7)
    noise = rng.normal(0.0, 3.2, a.shape[:2])[..., None]
    a = np.clip(a + noise, 0, 255)

    Image.fromarray(a.astype(np.uint8)).save(
        path, quality=84, progressive=True
    )


if __name__ == "__main__":
    for p in sys.argv[1:]:
        grade(p)
        print("graded", p)
