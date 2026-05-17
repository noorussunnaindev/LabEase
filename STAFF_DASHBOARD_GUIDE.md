# Lab Staff Dashboard & Features Guide

## Overview

The Lab Staff dashboard provides a complete workflow management system for laboratory employees to:
- ✅ View and manage customer test bookings
- ✅ Collect and track samples
- ✅ Upload test reports
- ✅ Track booking statuses through the complete workflow

---

## Accessing Lab Staff Dashboard

1. **Go to Login Page:** `http://localhost:5173/login`
2. **Select "Lab Staff" Tab** (Green button)
3. **Click Demo Credentials Button** or enter:
   - Email: `staff@labease.com`
   - Password: `staff123`
4. **Automatic Redirect** to `/staff/dashboard`

---

## Dashboard Overview

### Main Dashboard (`/staff/dashboard`)

The dashboard displays four key metrics:

#### 1. **New Bookings** (Blue Card)
- Count: Number of bookings in `BOOKED` status
- Action: Click to view bookings ready for sample collection
- Status: Customer has booked but sample not yet collected

#### 2. **Samples Collected** (Purple Card)
- Count: Bookings in `SAMPLE_COLLECTED` status
- Action: Click to start processing
- Status: Sample collected, awaiting analysis

#### 3. **Processing** (Yellow Card)
- Count: Tests currently being analyzed
- Action: Click to upload reports
- Status: Test is in laboratory analysis phase

#### 4. **Completed** (Green Card)
- Count: Tests with uploaded reports
- Action: Click to see final reports
- Status: Reports ready for customer download

### Quick Actions

**Manage All Bookings Card**
- Comprehensive view of all bookings
- Full filtering and search capabilities
- Click "View All" to navigate to bookings page

**Upload Reports Card**
- Informational card about report uploads
- Done directly from individual booking management

### Instructions Section

Step-by-step guide on using the dashboard functionality

---

## Bookings Management Page (`/staff/bookings`)

### Features

#### Status Filtering
Filter bookings by current status:
- **All Bookings** - View all bookings
- **🔵 New Bookings** - `BOOKED` status (need sample collection)
- **✓ Samples Collected** - `SAMPLE_COLLECTED` (ready for processing)
- **⏳ Processing** - `PROCESSING` (under analysis)
- **📄 Report Ready** - `REPORT_READY` (completed)

#### Bookings Table

Displays all bookings with columns:

| Column | Description |
|--------|-------------|
| Booking # | Unique booking identifier |
| Customer | Customer name and email |
| Phone | Customer phone number |
| Date | Appointment date |
| Tests | Medical tests ordered (shows first 2, +X more) |
| Status | Current workflow status |
| Amount | Total booking amount |
| Action | Manage button |

#### Table Features
- **Responsive Design** - Works on desktop and mobile
- **Hover Effects** - Visual feedback when hovering over rows
- **Color Coding** - Status badges with color-coded backgrounds
- **Customer Info** - Name, email, and phone number displayed

---

## Booking Management Modal

Click the **Manage** button on any booking to open the detailed management view.

### Modal Sections

#### 1. **Booking Information** (Blue Box)
- Booking Number
- Appointment Date
- Customer Name
- Customer Phone Number

#### 2. **Tests Ordered**
- List of all tests included in booking
- Test name, description, and price for each test
- Shows quantity details

#### 3. **Current Status**
- Large display of current booking status
- Color-coded background

#### 4. **Status Update Section** (varies by current status)

### Status Workflow

The booking goes through these stages:

```
BOOKED 
  ↓
  (Collect Sample) 
  ↓
SAMPLE_COLLECTED
  ↓
  (Start Analysis)
  ↓
PROCESSING
  ↓
  (Upload Report)
  ↓
REPORT_READY
  ↓
  (Auto-complete)
  ↓
COMPLETED
```

### Actions by Status

#### 🔵 **BOOKED Status**
Action: Mark Sample as Collected
- Button: "Confirm Sample Collection"
- Description: Confirms sample received from customer
- Next Status: SAMPLE_COLLECTED
- Required: Nothing (button click only)

#### ✓ **SAMPLE_COLLECTED Status**
Action: Start Processing
- Button: "Start Processing"
- Description: Begin laboratory analysis
- Next Status: PROCESSING
- Required: Nothing (button click only)

#### ⏳ **PROCESSING Status**
Action: Upload Report & Mark Ready
- File Upload: PDF or Image file
- Button: "Update to REPORT_READY"
- Description: Upload completed test report and mark as ready
- Next Status: REPORT_READY
- Required: Report file (PDF, JPG, PNG)
- Process:
  1. Click file input
  2. Select report file from your computer
  3. Confirm selection (displays "✓ File selected: filename.pdf")
  4. Click "Update to REPORT_READY"

#### 📄 **REPORT_READY Status**
- Status: Report uploaded and ready for customer
- Display: Green success message
- Description: "Customer can now download their report"
- Action: No further action needed
- Auto-transition: May auto-complete based on system settings

#### ✅ **COMPLETED Status**
- Status: Booking fully processed
- Display: Large checkmark with completion message
- No further updates available

---

## Example Workflows

### Complete Workflow: New Booking to Completion

**Step 1: Customer Books Test**
- Customer selects tests and completes payment
- Booking appears in "New Bookings" with BOOKED status

**Step 2: Collect Sample**
1. Staff clicks "Manage" on the booking
2. Modal shows "Confirm Sample Collection" button
3. Staff collects sample from customer
4. Staff clicks button
5. Status changes to SAMPLE_COLLECTED

**Step 3: Start Analysis**
1. Staff clicks "Manage" on the booking again
2. Modal shows "Start Processing" button
3. Staff clicks button
4. Status changes to PROCESSING

**Step 4: Upload Report**
1. Staff clicks "Manage" on the booking
2. Modal shows file upload field
3. Staff selects the completed report (PDF or Image)
4. Confirmation message: "✓ File selected: report.pdf"
5. Staff clicks "Update to REPORT_READY"
6. Status changes to REPORT_READY

**Step 5: Completion**
- Booking appears in "Report Ready" or "Completed"
- Customer receives notification to download report
- Workflow complete

---

## File Upload Specifications

### Supported Formats
- ✅ PDF (.pdf)
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)

### File Size Recommendations
- Maximum: 10MB per file
- Recommended: < 5MB for faster upload
- Minimum Resolution: 200 DPI (for scanned documents)

### Report Content
Report should include:
- Test name
- Patient information
- Test date
- Test results
- Reference ranges
- Clinician signature/approval

---

## Key Features & Functionality

### 1. **Real-time Status Updates**
- All status changes reflect immediately
- Dashboard updates without page refresh
- Automatic notification to customers

### 2. **Booking Filtering**
- Quick filter by status
- View only bookings that need your attention
- Reduces scrolling and improves efficiency

### 3. **Detailed Customer Information**
- Full customer contact details visible
- Easy to reach out if clarification needed
- Email and phone number in table

### 4. **Test Details**
- See all tests ordered for each booking
- Know exactly what to analyze
- Test pricing information available

### 5. **Status Tracking**
- Clear visual indication of progress
- Color-coded for quick scanning
- Complete history of status changes

### 6. **Report Management**
- Direct file upload from booking modal
- File type validation
- Automatic status update after upload

---

## Navigation

### From Dashboard
- **Click any status card** → View bookings with that status
- **Click "View All" button** → See all bookings
- **Click "Manage All Bookings" card** → Full bookings page

### From Bookings Page
- **Filter buttons** → Change status filter
- **Manage button** → Open booking details modal
- **Close modal** → Return to bookings table

### Sidebar Navigation
- **Dashboard** - Go to main dashboard
- **Bookings** - Go to bookings management page
- **Reports** - View and manage reports (bookings page)

---

## Common Tasks

### Task 1: Find Bookings Needing Sample Collection
1. Go to Bookings page
2. Click "🔵 New Bookings" filter
3. See all BOOKED status bookings
4. Click "Manage" on each to confirm collection

### Task 2: Process a Sample
1. Go to Bookings page
2. Click "✓ Samples Collected" filter
3. Open booking and click "Start Processing"
4. Status updates to PROCESSING

### Task 3: Upload a Test Report
1. Go to Bookings page
2. Click "⏳ Processing" filter
3. Open booking
4. Click file input and select report file
5. Verify file shows: "✓ File selected: [filename]"
6. Click "Update to REPORT_READY"

### Task 4: Check Completed Tests
1. Go to Bookings page
2. Click "📄 Report Ready" filter
3. View all reports ready for customer access

---

## Troubleshooting

### ❌ Can't see any bookings
**Solution:**
- Refresh the page
- Check if you're logged in as Lab Staff
- Verify backend is running

### ❌ "Failed to load bookings" error
**Solution:**
- Check network tab in browser DevTools
- Verify backend API is responding
- Check backend logs for errors
- Restart backend: `npm run dev`

### ❌ Status update fails
**Solution:**
- Check internet connection
- Verify file size (if uploading report)
- Try again in a few seconds
- Refresh and retry

### ❌ Report upload not working
**Solution:**
- Check file format (must be PDF, JPG, or PNG)
- Check file size (< 10MB)
- Try different file
- Check browser console for detailed error

### ❌ Modal won't close
**Solution:**
- Click the X button in top-right
- Press Escape key
- Refresh page

---

## Performance Tips

1. **Use Filters** - Filter by status to reduce table size
2. **Regular Refresh** - Refresh every 30 minutes to see new bookings
3. **Batch Processing** - Group similar tasks (e.g., collect all samples, then process all)
4. **Keep Reports Organized** - Save report files with booking number for easy reference

---

## Dashboard Statistics

### Understanding the Metrics

| Metric | Meaning | Your Action |
|--------|---------|------------|
| New Bookings | Samples to collect | Contact customers, arrange collection |
| Samples Collected | Ready to analyze | Set up testing equipment |
| Processing | Tests running | Monitor analysis, prepare report |
| Completed | Reports uploaded | Monitor customer satisfaction |

### Daily Workflow Example

**Morning:**
1. Check dashboard
2. Note number of new bookings
3. Contact customers for sample collection
4. Process collected samples

**Afternoon:**
1. Analyze ongoing tests
2. Upload completed reports
3. Check metrics for progress

**End of Day:**
1. Review completed reports
2. Plan next day's workload
3. Note any pending items

---

## Support & Help

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review the instructions on the dashboard
3. Check browser console for technical errors
4. Contact system administrator

---

**Lab Staff Dashboard is fully functional and ready to use!** 🎉
