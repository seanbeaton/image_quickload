Slowload is a image slow/lazy loading sandbox module, with a low quality prerender for better UX.

It provides a page for configuration of image style pairs. If a "preload" (low quality) image style is provided for a given "main" (high quality, normal) image style, the preload one will be loaded first, then replaced with the main image style once the image is fully loaded and in the viewport.

Main image styles should be the one you'd normally use.
Preload image styles should be the same aspect ratio as the main image style they correspond to, but much smaller. For example, if a main image style is a scale 650x650px, then the preload could be scale 8x8px. If the main image style were scale and crop 1920x1080, then the preload could be 16x9px.
