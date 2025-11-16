
# Patient Doctor Booking System - User Guide

This guide was written by Thush to help users and administrators get the most out of the medical appointment booking system. If you have questions or need support, please contact Thush directly.

## Overview

MediBook is a comprehensive medical appointment booking system that connects patients with doctors. The system features separate interfaces for patients and administrators, with robust authentication and appointment management capabilities.

## Getting Started

### First Time Setup

1. **Register an Account**
   - Navigate to the login page
   - Click on the "Register" tab
   - Enter a username (letters, numbers, and underscores only)
   - Create a password (minimum 6 characters)
   - Confirm your password
   - Click "Create Account"
   - **Note:** The first registered user automatically becomes an administrator

2. **Login**
   - Enter your username
   - Enter your password
   - Click "Login"

## Patient Features

### Browse Doctors

1. Navigate to the "Doctors" page from the main menu
2. Use the search bar to find doctors by name
3. Filter doctors by medical specialty using the dropdown
4. View doctor information including:
   - Name and specialty
   - Contact information (email and phone)
   - Availability schedule

### Book an Appointment

1. From the Doctors page, click "Book Appointment" on your preferred doctor's card
2. Select an appointment date (cannot be in the past)
3. Choose an appointment time
4. Optionally add notes about your concerns
5. Click "Confirm Appointment"
6. Your appointment will be created with "Pending" status

### Manage Your Appointments

1. Navigate to "My Appointments" from the main menu
2. View all your appointments with status indicators:
   - **Pending**: Awaiting confirmation
   - **Confirmed**: Approved by admin
   - **Completed**: Appointment finished
   - **Cancelled**: Appointment cancelled
3. Cancel pending appointments if needed

### Update Your Profile

1. Click on your avatar in the top-right corner
2. Select "Profile" from the dropdown menu
3. Update your information:
   - Full name
   - Email address
   - Phone number
   - Preferred medical specialty
4. Click "Save Changes"

## Administrator Features

### Access Admin Panel

- Click on your avatar in the top-right corner
- Select "Admin Panel" from the dropdown menu
- Or navigate directly to any admin page from the header menu

### Admin Dashboard

The dashboard provides an overview of:
- Total users in the system
- Total doctors registered
- Total appointments booked
- Pending appointments count
- Recent appointment activity

### Manage Doctors

#### Add a Doctor Manually

1. Navigate to "Manage Doctors"
2. Click "Add Doctor"
3. Fill in the doctor's information:
   - Name (required)
   - Specialty (required)
   - Email
   - Phone
   - Availability schedule
4. Click "Add Doctor"

#### Import Doctors via CSV

1. Navigate to "Manage Doctors"
2. Click "Import CSV"
3. Prepare a CSV file with the following columns:
   - `name` (required)
   - `specialty` (required - must match existing specialty names)
   - `email` (optional)
   - `phone` (optional)
   - `availability` (optional)
4. Example CSV format:
   ```
   name,specialty,email,phone,availability
   Dr. John Smith,Cardiology,john@example.com,555-0101,Mon-Fri 9AM-5PM
   Dr. Jane Doe,Dermatology,jane@example.com,555-0102,Mon-Wed 10AM-4PM
   ```
5. Select your CSV file and click "Upload"
6. The system will import all valid entries and report any errors

#### Edit a Doctor

1. Navigate to "Manage Doctors"
2. Find the doctor in the list
3. Click the edit icon (pencil)
4. Update the information
5. Click "Update Doctor"

#### Delete a Doctor

1. Navigate to "Manage Doctors"
2. Find the doctor in the list
3. Click the delete icon (trash)
4. Confirm the deletion
5. **Warning:** This action cannot be undone

### Manage Users

1. Navigate to "Manage Users"
2. View all registered users with their information
3. Change user roles:
   - **Promote to Admin**: Give a patient administrator privileges
   - **Revoke Admin**: Remove administrator privileges from a user
4. Confirm role changes when prompted

### Manage All Appointments

1. Navigate to "All Appointments"
2. View all appointments in the system
3. Filter appointments by status using the dropdown
4. Update appointment status:
   - Change from "Pending" to "Confirmed"
   - Mark appointments as "Completed"
   - Cancel appointments if needed
5. View patient and doctor information for each appointment

## Medical Specialties

The system includes the following specialties:
- Cardiology (Heart and cardiovascular system)
- Dermatology (Skin, hair, and nail care)
- Orthopedics (Bone, joint, and muscle)
- Pediatrics (Children's health)
- Neurology (Brain and nervous system)
- Ophthalmology (Eye care)
- Psychiatry (Mental health)
- General Practice (Primary care)
- Gynecology (Women's reproductive health)
- Dentistry (Oral health)

## Tips and Best Practices

### For Patients

- Keep your profile information up to date for better communication
- Book appointments in advance to secure your preferred time slots
- Add detailed notes when booking to help doctors prepare
- Check your appointments regularly for status updates
- Cancel appointments you cannot attend to free up slots for others

### For Administrators

- Regularly review and confirm pending appointments
- Keep doctor information accurate and up to date
- Use CSV import for bulk doctor additions to save time
- Monitor user roles and adjust as needed
- Review the dashboard regularly for system insights

## Troubleshooting

### Cannot Login

- Verify your username is correct (no spaces, only letters, numbers, and underscores)
- Check that your password is correct
- Ensure you've registered an account first

### Cannot Book Appointment

- Make sure you're logged in
- Verify the date is not in the past
- Check that you've selected both date and time

### CSV Import Errors

- Ensure specialty names match exactly (case-insensitive)
- Check that required columns (name, specialty) are present
- Verify CSV format is correct with proper commas

### Missing Admin Features

- Only administrators can access admin pages
- The first registered user becomes admin automatically
- Contact an existing admin to promote your account

## Security Notes

- Never share your login credentials
- Use a strong password with a mix of characters
- Administrators have full system access - use privileges responsibly
- Patient data is protected and only visible to the patient and administrators

## Support

For additional help or to report issues, please contact your system administrator.
