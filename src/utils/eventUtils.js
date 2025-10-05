import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { uploadImage } from './uploadImage';

// Collection reference
const eventsCollection = collection(db, 'events');

// Add a new event
export const addEvent = async (eventData) => {
  try {
    // Upload images to Cloudinary if they are files
    const uploadedImages = [];
    if (eventData.images && eventData.images.length > 0) {
      for (const image of eventData.images) {
        if (image instanceof File) {
          const imageUrl = await uploadImage(image);
          uploadedImages.push(imageUrl);
        } else if (typeof image === 'string') {
          // It's already a URL
          uploadedImages.push(image);
        }
      }
    }

    // Prepare event data for Firebase
    const eventToSave = {
      title: eventData.title,
      shortDescription: eventData.shortDescription,
      fullDescription: eventData.fullDescription, // Array of paragraphs
      eventDate: eventData.eventDate,
      eventTime: eventData.eventTime,
      videoLink: eventData.videoLink || '',
      images: uploadedImages,
      location: eventData.location,
      organizerName: eventData.organizerName,
      contactLink: eventData.contactLink || '',
      category: eventData.category || 'event',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(eventsCollection, eventToSave);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding event:', error);
    return { success: false, error: error.message };
  }
};

// Get all events
export const getEvents = async () => {
  try {
    const q = query(eventsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, events };
  } catch (error) {
    console.error('Error getting events:', error);
    return { success: false, error: error.message };
  }
};

// Get upcoming events
export const getUpcomingEvents = async () => {
  try {
    const now = new Date();
    const q = query(
      eventsCollection, 
      where('eventDate', '>=', now.toISOString().split('T')[0]),
      orderBy('eventDate', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const events = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, events };
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    return { success: false, error: error.message };
  }
};

// Get past events
export const getPastEvents = async () => {
  try {
    const now = new Date();
    const q = query(
      eventsCollection, 
      where('eventDate', '<', now.toISOString().split('T')[0]),
      orderBy('eventDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const events = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, events };
  } catch (error) {
    console.error('Error getting past events:', error);
    return { success: false, error: error.message };
  }
};

// Update an event
export const updateEvent = async (eventId, eventData) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    
    // Upload new images if they are files
    const uploadedImages = [];
    if (eventData.images && eventData.images.length > 0) {
      for (const image of eventData.images) {
        if (image instanceof File) {
          const imageUrl = await uploadImage(image);
          uploadedImages.push(imageUrl);
        } else if (typeof image === 'string') {
          uploadedImages.push(image);
        }
      }
    }

    const updateData = {
      title: eventData.title,
      shortDescription: eventData.shortDescription,
      fullDescription: eventData.fullDescription,
      eventDate: eventData.eventDate,
      eventTime: eventData.eventTime,
      videoLink: eventData.videoLink || '',
      images: uploadedImages,
      location: eventData.location,
      organizerName: eventData.organizerName,
      contactLink: eventData.contactLink || '',
      category: eventData.category || 'event',
      updatedAt: serverTimestamp()
    };

    await updateDoc(eventRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating event:', error);
    return { success: false, error: error.message };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: error.message };
  }
};

// Get event by ID
export const getEventById = async (eventId) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (eventSnap.exists()) {
      return { 
        success: true, 
        event: { id: eventSnap.id, ...eventSnap.data() } 
      };
    } else {
      return { success: false, error: 'Event not found' };
    }
  } catch (error) {
    console.error('Error getting event:', error);
    return { success: false, error: error.message };
  }
};

// Utility function to extract YouTube video ID
export const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Utility function to extract TikTok video ID
export const extractTikTokId = (url) => {
  if (!url) return null;
  const regExp = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};
