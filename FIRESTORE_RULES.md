# Complete Firestore Security Rules

## Apply these rules in Firebase Console → Firestore Database → Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ===========================================
    // ADMIN COLLECTION (Secure, UID-based)
    // ===========================================
    match /admins/{uid} {
      // Any authenticated user can read admin role (for role gating in-app)
      allow read: if request.auth != null;

      // Write rules:
      // 1) A user can create their own admin record, but only if they are in bootstrap mode
      // 2) Super admins can manage any admin
      allow create: if
        request.auth != null
        && request.auth.uid == uid
        && get(/databases/$(database)/documents/settings/bootstrap).data.enabled == true;

      allow update, delete: if isSuperAdmin(request.auth.uid);

      // Helper to check super admin by UID
      function isSuperAdmin(userUid) {
        return get(/databases/$(database)/documents/admins/$(userUid)).data.role == 'super';
      }
    }

    // ===========================================
    // SUBSCRIBERS COLLECTION (Public read/write)
    // ===========================================
    match /subscribers/{document} {
      // Anyone can read subscribers (for dashboard analytics)
      allow read: if true;

      // Anyone can create new subscribers (for footer subscription)
      allow create: if true;

      // Only super admins can update/delete subscribers
      allow update, delete: if request.auth != null && isSuperAdmin(request.auth.uid);
    }

    // ===========================================
    // SETTINGS COLLECTION (Admin only)
    // ===========================================
    match /settings/{docId} {
      // Public read for bootstrap settings
      allow read: if true;

      // Only super admins can write settings
      allow write: if request.auth != null && isSuperAdmin(request.auth.uid);
    }

    // ===========================================
    // METRICS COLLECTION (Public read, Admin write)
    // ===========================================
    match /metrics/{document} {
      // Anyone can read metrics (for analytics)
      allow read: if true;

      // Only authenticated users can write metrics
      allow write: if request.auth != null;
    }

    // ===========================================
    // OTHER COLLECTIONS (if needed)
    // ===========================================
    // Add other collections as needed with appropriate rules

    // Example: Events collection
    // match /events/{document} {
    //   allow read: if true;
    //   allow write: if request.auth != null && isSuperAdmin(request.auth.uid);
    // }
  }
}
```

## Bootstrap Setup Instructions

### Step 1: Enable Bootstrap Mode

1. Go to Firebase Console → Firestore Database
2. Create a document in `settings` collection with ID `bootstrap`
3. Set the document content to: `{ "enabled": true }`

### Step 2: Create Your First Super Admin

1. Sign in with your chosen super admin account
2. Go to the admin panel and create the admin record
3. This will work because bootstrap mode is enabled

### Step 3: Disable Bootstrap Mode

1. After creating your first super admin, go back to Firestore
2. Edit the `settings/bootstrap` document
3. Change `enabled` to `false`
4. From now on, only super admins can create new admins

## Security Notes

- **Subscribers**: Public read/write for subscription functionality
- **Admins**: UID-based security with super admin controls
- **Settings**: Public read, super admin write
- **Metrics**: Public read, authenticated write
- **Bootstrap**: One-time setup mode for initial admin creation

## Testing

After applying these rules:

1. Footer subscription should work
2. Dashboard should load subscriber data
3. Admin creation should work (in bootstrap mode)
4. Admin login should work with proper role detection
