# Pluto: The NASA Space Search Engine

Pluto is a NASA space search engine that allows users to explore NASA’s open source data through search, filtering, and user-based features.

## Features

### Login / Authentication
- Uses Firebase to authenticate users  
- Firestore stores user data and pulls it into the relevant pages (persistent sessions) 
- Remember me keeps a user logged in 
- Users can register using email and password (minimal security for first release)  

### Search Objects / Images
- Uses NASA's collection of open source APIs to display search results  
- Users can filter by start date, end date, and which space station the image was taken from  

### Image Gallery
- Displays all NASA images tagged or containing the word planet  

### Favouriting Entries
- Users can tag searches as favourites  
- Stored in Firestore and can be viewed in the favorites tab or in the profile tab  

### User Notes
- Users can select entries and write notes in the notes section  
- Uses Firestore to cache notes and pull when needed  
- Entries with notes are tagged with note  

### Dark Mode
- The app is styled in Tailwind CSS with a dark mode for a space theme  

## Technology Stack
- Next.js  
- Tailwind CSS  
- Firebase Authentication  
- Firebase Firestore  
- NASA APIs  
  - Solar System Objects  
  - Images Library  

## How to use 

- Go to https://pluto-rouge.vercel.app/

