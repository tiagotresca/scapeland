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
# desktop: native 1080p, high quality
ffmpeg -y -i .assets-tmp/motion-src.mp4 -an \
  -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow -profile:v high -movflags +faststart \
  assets/media/motion.mp4
# mobile: lighter rendition, swapped in by main.js on small screens
ffmpeg -y -i .assets-tmp/motion-src.mp4 -an \
  -vf "scale=960:-2" -c:v libx264 -crf 25 -preset slow -movflags +faststart \
  assets/media/motion-mobile.mp4

# ————— motion section still: House 01 twilight facade —————
drive 19Iher5FGsC9_KFWUJnS8L-ifG5qQfRdC .assets-tmp/motion-bg.png
img .assets-tmp/motion-bg.png assets/img/motion-bg.jpg 2400

# ————— Solid section: hand sketch (GLT factory photos are committed directly) —————
drive 1N5-OSMeyoocQ9jrjXz4GmV7IaVUHkkl8 .assets-tmp/sketch.png
img .assets-tmp/sketch.png assets/img/sketch.jpg 1800

# ————— the family: Campo (Drive render of the first build), Serra, Costa.
#        Vale is hidden for now; its generated image stays fetchable below. —————
drive 1yCmp1zahATveG3RwnD6pZEuiOIxdOEec .assets-tmp/campo.png
img .assets-tmp/campo.png assets/img/model-campo.jpg 1600
fetch "$HF/hf_20260901_130125_c240c74e-085b-4252-9f8b-a0cc2dd81cd1.png" .assets-tmp/serra.png
img .assets-tmp/serra.png assets/img/model-serra.jpg 1600
fetch "$HF/hf_20260901_130125_051bd85e-87ad-48d3-9aa4-096f14e886de.png" .assets-tmp/costa.png
img .assets-tmp/costa.png assets/img/model-costa.jpg 1600
fetch "$HF/hf_20260901_130125_d534a029-8c44-4b4a-b3ea-ce050980ee03.png" .assets-tmp/vale.png
img .assets-tmp/vale.png assets/img/model-vale.jpg 1600

# ————— House 01 gallery (Drive renders) —————
drive 1SZew0p1wBgvoDWBYyIvmcohrswNfdk47 .assets-tmp/h01a.png
img .assets-tmp/h01a.png assets/img/house01-a.jpg 1600
drive 1l3dkqbJ_XD4wjt0Qu92bvmf5PRw2xUki .assets-tmp/h01proj.png
img .assets-tmp/h01proj.png assets/img/house01-project.jpg 1800
drive 10tLBNkcCJx6_cA_xBkodybHwS_bwIH1M .assets-tmp/h01c.png
img .assets-tmp/h01c.png assets/img/house01-c.jpg 1600

# ————— wellbeing: pavilion, interiors, farm garden (3D set) —————
fetch "$HF/hf_20260901_192016_758b4344-9af1-44e5-b94f-22e4ff3ad052.png" .assets-tmp/wpav.png
img .assets-tmp/wpav.png assets/img/well-pavilion.jpg 1600
fetch "$HF/hf_20260901_185754_61946e90-22a6-4c39-87ab-d9bcc2a848f4.png" .assets-tmp/wrel.png
img .assets-tmp/wrel.png assets/img/well-relax.jpg 1600
fetch "$HF/hf_20260901_185754_2e799310-9928-4da4-ae65-ce9ced51134d.png" .assets-tmp/wgym.png
img .assets-tmp/wgym.png assets/img/well-gym.jpg 1600
fetch "$HF/hf_20260901_185754_d8f4363f-0175-4e67-b3bc-d1ccdc6bb0dc.png" .assets-tmp/wgar.png
img .assets-tmp/wgar.png assets/img/well-garden.jpg 1600

# ————— kept (owner's service page): arrival kitchen + services —————
fetch "$HF/hf_20260902_143830_5fb47911-1723-485c-b11d-7f9c5cdda16e.png" .assets-tmp/kept.png
img .assets-tmp/kept.png assets/img/kept-arrival.jpg 1600
fetch "$HF/hf_20260902_145933_5de31a2f-ee9e-4941-81dc-4575d936d2b7.png" .assets-tmp/kmud.png
img .assets-tmp/kmud.png assets/img/kept-mud.jpg 1400
fetch "$HF/hf_20260902_145932_6057a9b7-a65d-43b4-a53e-dc43e85192b9.png" .assets-tmp/kpil.png
img .assets-tmp/kpil.png assets/img/kept-pilates.jpg 1400
fetch "$HF/hf_20260902_145932_3e4216ce-c680-46ca-bbf9-e00f280eda1e.png" .assets-tmp/kmas.png
img .assets-tmp/kmas.png assets/img/kept-massage.jpg 1400
fetch "$HF/hf_20260902_145932_cd74c034-8c50-43c2-ae1f-3afe148472db.png" .assets-tmp/knut.png
img .assets-tmp/knut.png assets/img/kept-nutrition.jpg 1400

# ————— bleed + inhabit (editorial set) —————
fetch "$HF/hf_20260901_103633_5e7a2fce-d6c8-4f4c-8116-57c268aa1be6.png" .assets-tmp/walk.png
img .assets-tmp/walk.png assets/img/walk.jpg 2400
fetch "$HF/hf_20260901_103633_c96171a9-c2e6-4c0b-b587-cc4d649d161b.png" .assets-tmp/inhabit.png
img .assets-tmp/inhabit.png assets/img/inhabit.jpg 1800
