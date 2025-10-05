# Event Management System

A comprehensive event management system built with React, Firebase, and Tailwind CSS.

## Features

### Admin Features (EventPromotionForm.jsx)

- ✅ **Add New Events** with complete details
- ✅ **Event Title** and **Short Description**
- ✅ **Full Description Paragraphs** (multiple paragraphs supported)
- ✅ **Event Date & Time** (used for countdown timer)
- ✅ **YouTube/TikTok Video Links** (automatically embedded)
- ✅ **Image Upload** to Cloudinary or direct URL input
- ✅ **Location/Venue** information
- ✅ **Organizer Name** and **Contact Links**
- ✅ **Update and Delete** existing events
- ✅ **Real-time validation** and error handling

### User Features (Events.jsx)

- ✅ **Automatic Firebase Integration** - fetches events in real-time
- ✅ **Beautiful Modern Layout** with responsive design
- ✅ **Live Countdown Timer** showing Days, Hours, Minutes, Seconds
- ✅ **"Event Started"** status when countdown reaches zero
- ✅ **Image Carousel** using Swiper library
- ✅ **Video Embedding** for YouTube and TikTok videos
- ✅ **Event Categories** with filtering
- ✅ **Upcoming vs Past Events** sections
- ✅ **Event Details Modal** with full information
- ✅ **Contact Links** and registration buttons

## Technical Implementation

### Dependencies Added

- `swiper` - For image carousel functionality
- `react-hot-toast` - For toast notifications

### Firebase Integration

- **Collection**: `events`
- **Fields**: title, shortDescription, fullDescription[], eventDate, eventTime, videoLink, images[], location, organizerName, contactLink, category, createdAt, updatedAt

### Components Created

1. **CountdownTimer.jsx** - Live countdown with "Event Started" status
2. **VideoEmbed.jsx** - YouTube/TikTok video embedding
3. **ImageCarousel.jsx** - Swiper-based image carousel
4. **EventPromotionForm.jsx** - Enhanced admin form with all features
5. **eventUtils.js** - Firebase CRUD operations

### Key Features

- **Real-time Updates**: Events automatically sync with Firebase
- **Image Management**: Upload to Cloudinary or use direct URLs
- **Video Support**: Automatic YouTube/TikTok embedding
- **Responsive Design**: Works on all device sizes
- **Toast Notifications**: User feedback for all actions
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth user experience

## Usage

### For Admins

1. Navigate to `/admin/events`
2. Click "Add New Event" or edit existing events
3. Fill in all required fields
4. Upload images or add image URLs
5. Add video links (YouTube/TikTok)
6. Save the event

### For Users

1. Navigate to `/events`
2. View upcoming events with live countdown
3. Filter by category
4. Click "Learn More" for full details
5. Register for upcoming events

## File Structure

```
src/
├── components/
│   ├── CountdownTimer.jsx
│   ├── VideoEmbed.jsx
│   ├── ImageCarousel.jsx
│   └── admin/
│       └── EventPromotionForm.jsx
├── pages/
│   ├── Events.jsx
│   └── admin/
│       └── AdminEvents.jsx
├── utils/
│   ├── eventUtils.js
│   └── uploadImage.js
└── firebase.js
```

## Configuration Required

1. **Firebase**: Ensure Firebase is properly configured in `firebase.js`
2. **Cloudinary**: Update `uploadImage.js` with your Cloudinary credentials
3. **Firestore Rules**: Allow read/write access to the `events` collection

## Future Enhancements

- Event registration system
- Email notifications
- Event analytics dashboard
- Social media integration
- Event calendar view
- Attendee management
