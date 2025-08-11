# Hero Video Setup Guide

## Overview

The hero section includes a responsive video background with proper accessibility, performance optimizations, and fallbacks.

## Video Requirements

### File Location

Place your hero video file at: `public/assets/videos/hero-video.mp4`

### Video Specifications

- **Format**: MP4 (primary) and WebM (optional for better compression)
- **Resolution**: 1920x1080 (Full HD) or higher
- **Aspect Ratio**: 16:9 recommended
- **Duration**: 10-30 seconds (looping)
- **File Size**: Keep under 10MB for optimal performance
- **Codec**: H.264 for MP4, VP9 for WebM

### Optimization Tips

1. **Compress the video** using tools like HandBrake or FFmpeg
2. **Use a lower bitrate** (1-2 Mbps for 1080p)
3. **Consider creating multiple formats**:
   - `hero-video.mp4` (H.264)
   - `hero-video.webm` (VP9, smaller file size)

## Fallback Image

The component uses a fallback image when:

- Video fails to load
- User prefers reduced motion
- Browser doesn't support video

Current fallback: Unsplash art image

## Features Implemented

### ✅ Accessibility

- ARIA labels and roles
- Screen reader support
- Focus management
- Color contrast compliance
- Reduced motion support

### ✅ Performance

- Lazy loading with `preload="metadata"`
- Optimized video compression
- Progressive enhancement
- Graceful degradation

### ✅ Responsive Design

- Mobile-first approach
- Adaptive video sizing
- Touch-friendly controls
- Bandwidth optimization

### ✅ Browser Support

- Modern browsers with video support
- Fallback for older browsers
- Mobile browser compatibility
- Safari-specific optimizations

## Usage

The `HeroSection` component automatically:

1. Detects user's motion preferences
2. Loads video with metadata preloading
3. Shows fallback image if video fails
4. Provides loading states
5. Handles errors gracefully

## Customization

### Changing the Video

1. Replace `public/assets/videos/hero-video.mp4`
2. Update the component if using different file names
3. Test across different devices and browsers

### Modifying the Gradient

The gradient overlay uses:

```css
bg-gradient-to-b from-[rgba(10,30,90,0.5)] to-[rgba(0,0,0,0.9)]
```

### Adjusting Content

The hero content includes:

- Main headline
- Description text
- Call-to-action buttons
- Accessibility descriptions

## Testing Checklist

- [ ] Video loads on desktop browsers
- [ ] Video loads on mobile devices
- [ ] Fallback image shows when video fails
- [ ] Reduced motion preference is respected
- [ ] Screen readers announce content properly
- [ ] Focus indicators are visible
- [ ] Performance is acceptable on slow connections
- [ ] No layout shift occurs during loading

## Troubleshooting

### Video Not Playing

1. Check file path and format
2. Verify video codec compatibility
3. Test with different browsers
4. Check browser console for errors

### Performance Issues

1. Compress video further
2. Consider using WebM format
3. Reduce video resolution
4. Implement lazy loading

### Accessibility Issues

1. Ensure sufficient color contrast
2. Test with screen readers
3. Verify keyboard navigation
4. Check ARIA attributes

## Example Video Creation

Using FFmpeg to create an optimized video:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart public/assets/videos/hero-video.mp4
```

Creating WebM version:

```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus public/assets/videos/hero-video.webm
```
