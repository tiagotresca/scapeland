# Asset manifest — sourced by fetch-assets.sh.
# drive <file-id> <tmp>            downloads from the shared Drive folder
# img   <tmp> <dest> <max-width>   optimizes into assets/img/
# Sources: Google Drive folder 1wC7ynlvq9xE8bBm141OR3V3P0alfZiXA (final brand
# renders/sketches/footage) + Higgsfield editorial photography set (Sep 2026).

HF=https://d8j0ntlcm91z4.cloudfront.net/user_3DHR71Nhb8BxDxiD3b5RHP9REhm

# ————— hero: House 01 at dusk, behind tall dry grass (Drive render) —————
drive 1ewv6F4fDF5l6NJ1_PsPoOP4fA5Ljptk0 .assets-tmp/hero.png
img .assets-tmp/hero.png assets/img/hero.jpg 2400

# ————— hero/motion loop: aerial drone over the montado (Drive v1) —————
fetch "https://drive.usercontent.google.com/download?id=1pLeMb5ifd767ODI4QA7ZZjlnNtlRY8jl&export=download&confirm=t" .assets-tmp/motion-src.mp4
ffmpeg -y -i .assets-tmp/motion-src.mp4 -t 30 -an \
  -vf "scale=1600:-2" -c:v libx264 -crf 27 -preset slow -movflags +faststart \
  assets/media/motion.mp4

# ————— motion section still: House 01 twilight facade —————
drive 19Iher5FGsC9_KFWUJnS8L-ifG5qQfRdC .assets-tmp/motion-bg.png
img .assets-tmp/motion-bg.png assets/img/motion-bg.jpg 2400

# ————— Solid section: hand sketch (GLT factory photos are committed directly) —————
drive 1N5-OSMeyoocQ9jrjXz4GmV7IaVUHkkl8 .assets-tmp/sketch.png
img .assets-tmp/sketch.png assets/img/sketch.jpg 1800

# ————— the family: the same Scapeland house in four settings —————
fetch "$HF/hf_20260901_130125_d534a029-8c44-4b4a-b3ea-ce050980ee03.png" .assets-tmp/vale.png
img .assets-tmp/vale.png assets/img/model-vale.jpg 1600
fetch "$HF/hf_20260901_130125_c240c74e-085b-4252-9f8b-a0cc2dd81cd1.png" .assets-tmp/serra.png
img .assets-tmp/serra.png assets/img/model-serra.jpg 1600
fetch "$HF/hf_20260901_130125_051bd85e-87ad-48d3-9aa4-096f14e886de.png" .assets-tmp/costa.png
img .assets-tmp/costa.png assets/img/model-costa.jpg 1600
fetch "$HF/hf_20260901_130125_9439cdef-bdf9-440d-9422-19ade3e8ffe6.png" .assets-tmp/campo.png
img .assets-tmp/campo.png assets/img/model-campo.jpg 1600

# ————— House 01 gallery (Drive renders) —————
drive 1SZew0p1wBgvoDWBYyIvmcohrswNfdk47 .assets-tmp/h01a.png
img .assets-tmp/h01a.png assets/img/house01-a.jpg 1600
drive 1yCmp1zahATveG3RwnD6pZEuiOIxdOEec .assets-tmp/h01b.png
img .assets-tmp/h01b.png assets/img/house01-b.jpg 1600
drive 10tLBNkcCJx6_cA_xBkodybHwS_bwIH1M .assets-tmp/h01c.png
img .assets-tmp/h01c.png assets/img/house01-c.jpg 1600

# ————— bleed + inhabit (editorial set) —————
fetch "$HF/hf_20260901_103633_5e7a2fce-d6c8-4f4c-8116-57c268aa1be6.png" .assets-tmp/walk.png
img .assets-tmp/walk.png assets/img/walk.jpg 2400
fetch "$HF/hf_20260901_103633_c96171a9-c2e6-4c0b-b587-cc4d649d161b.png" .assets-tmp/inhabit.png
img .assets-tmp/inhabit.png assets/img/inhabit.jpg 1800
