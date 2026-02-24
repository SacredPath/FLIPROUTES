# Shipment Images Folder

This folder contains images used for shipment tracking displays.

## Usage

Place your shipment images in this folder. Images will be accessible at `/images/[filename]`.

## Current Images

- `trucking.png` - Default trucking/shipping image
- `air-freight.png` - Air freight shipment image
- `Ocean-freight.jpg` - Ocean freight shipment image

## Adding New Images

1. Add your image file to this folder
2. Update the `image_url` field in the database for shipments
3. Use the path format: `/images/your-image-name.jpg`

## Supported Formats

- PNG
- JPG/JPEG
- WebP
- AVIF

## Image Recommendations

- Recommended size: 1920x1080 or larger
- Aspect ratio: 16:9 works well for banner displays
- File size: Keep under 2MB for optimal loading

