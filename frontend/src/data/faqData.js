export const faqData = [
  {
    title: 'Dashboard',
    icon: "dashboard",
    questions: [
      {
        q: 'How do I read the dashboard metrics?',
        a: 'The dashboard displays key metrics including active jobs, archived jobs, total applicants, and shortlisted candidates. Clicking on any metric card will take you directly to the relevant filtered view.'
      },
      {
        q: 'How do I use the job statistics cards?',
        a: 'Each statistics card is clickable and will redirect you to the corresponding section. For example, clicking on "Total Applicants" will take you to the applicants view, while "Shortlisted Candidates" shows only shortlisted applicants.'
      },
      {
        q: 'What information is shown in the Recent Job Listings?',
        a: 'Recent Job Listings shows your most recently posted jobs with their status, applicant count, and posting date. Click on any job title to view detailed information about that job.'
      },
      {
        q: 'How can I see the most popular job roles?',
        a: 'The "Most Applied Job Roles" section displays jobs with the highest number of applicants, showing a visual bar representing the application volume for each position.'
      },
      {
        q: 'How do I navigate to different sections from the dashboard?',
        a: 'Use the navigation bar at the top to access different sections like Jobs, Applicants, Analytics, and Settings. You can also use the quick action buttons on dashboard cards to jump to specific views.'
      }
    ]
  },
  {
    title: 'Job Management',
    icon: "briefcase",
    questions: [
      {
        q: 'How do I create a new job post?',
        a: 'Click the "Post New Job" button on the Dashboard or Jobs page and fill in all required information including job details, requirements, and company information. Make sure to provide detailed job descriptions to attract qualified candidates.'
      },
      {
        q: 'How do I see applicants for a specific job?',
        a: 'Click directly on any job card to view all applicants for that position. The applicant count is displayed on the job card as a badge, showing you how many candidates have applied.'
      },
      {
        q: 'How do I edit or archive a job post?',
        a: 'Use the edit (pencil) icon on any job card to update details. Click the archive icon to move it to archived jobs when the position is filled or no longer available. You can restore archived jobs later if needed.'
      },
      {
        q: 'How do I manage archived jobs?',
        a: 'Go to the "Archived" tab in the Jobs section to view all archived jobs. You can restore any archived job by clicking the restore button, which will move it back to active jobs.'
      },
      {
        q: 'Can I duplicate an existing job post?',
        a: 'Yes, on the job details page, click the "Duplicate" option to create a copy of an existing job post. This saves time when creating similar job listings.'
      },
      {
        q: 'How do I set job requirements and qualifications?',
        a: 'When creating or editing a job post, use the "Requirements" section to specify necessary qualifications, skills, experience levels, and education. Be specific to attract relevant candidates.'
      }
    ]
  },
  {
    title: 'Applicant Management',
    icon: "users",
    questions: [
      {
        q: 'How do I filter and search for applicants?',
        a: 'Use the search bar to find applicants by name, email, or company. Click the "Filter Applicants" dropdown to filter by status (pending, approved, rejected, interview) or company. Active filters appear as tags that you can remove individually.'
      },
      {
        q: 'How do I view applicant details?',
        a: 'Click on any applicant in the list to view their complete profile in the right panel. The profile shows personal information, contact details, resume analysis, work experience, education, and skills.'
      },
      {
        q: 'How does the resume viewer work?',
        a: 'When viewing an applicant\'s details, click "View Resume" to open the PDF viewer. For multi-page resumes, use the navigation controls to move between pages. You can also download the resume for offline review.'
      },
      {
        q: 'How do I change an applicant\'s status?',
        a: 'In the applicant details panel, use the status dropdown to change their application status to pending, approved, rejected, or interview. Status changes are saved automatically.'
      },
      {
        q: 'How can I add notes about an applicant?',
        a: 'In the applicant details view, use the "Notes" section to add private comments about the candidate. These notes are visible to all HR team members but not to the applicants themselves.'
      },
      {
        q: 'What information is shown in the applicant analysis?',
        a: 'The applicant analysis shows AI-generated insights about the candidate\'s skills, experience relevance to the job, education background, and overall match score. This helps you quickly assess candidate suitability.'
      }
    ]
  },
  {
    title: 'Filtering and Navigation',
    icon: "filter",
    questions: [
      {
        q: 'What do the active filter tags mean?',
        a: 'Active filter tags show which filters are currently applied to your view. You can remove individual filters by clicking the X on each tag, or click "Clear all" to remove all filters at once.'
      },
      {
        q: 'How do I view only shortlisted candidates?',
        a: 'Click the "Shortlisted Candidates" card on the Dashboard, or in the Applicants tab, use the Filter dropdown to select "approved" from the status options.'
      },
      {
        q: 'How can I quickly find applicants for a specific job?',
        a: 'Click directly on the job card from the Jobs page to see only applicants for that position. Alternatively, use the job filter in the Applicants view to select a specific job posting.'
      },
      {
        q: 'How does pagination work for large applicant lists?',
        a: 'When you have more than 20 applicants, pagination controls appear at the bottom of the list. You can navigate between pages using the previous/next buttons or by clicking on specific page numbers.'
      },
      {
        q: 'Can I sort the applicant list?',
        a: 'Yes, you can sort applicants by name, application date, or status by clicking the respective column headers. Click again to toggle between ascending and descending order.'
      }
    ]
  },
  {
    title: 'Analytics and Reporting',
    icon: "chart",
    questions: [
      {
        q: 'How do I view application trends over time?',
        a: 'Go to the Analytics section to see charts showing application volume over time. You can filter by date range, job posting, or department to analyze specific trends.'
      },
      {
        q: 'How can I see the source of my applicants?',
        a: 'The Analytics dashboard includes a breakdown of application sources (e.g., job boards, company website, referrals). This helps you determine which channels are most effective for recruiting.'
      },
      {
        q: 'How do I generate recruitment reports?',
        a: 'In the Analytics section, use the "Generate Report" button to create customized reports. You can select metrics to include, date ranges, and export formats (PDF, Excel, CSV).'
      },
      {
        q: 'What insights can I get from the skills analysis?',
        a: 'The skills analysis report shows the most common skills among applicants for specific roles. This helps identify talent pools and skill gaps in your applicant database.'
      },
      {
        q: 'How can I track hiring pipeline metrics?',
        a: 'The pipeline analytics show conversion rates between application stages (applied, reviewed, interviewed, offered, hired). This helps identify bottlenecks in your hiring process.'
      }
    ]
  },
  {
    title: 'Resume Analysis',
    icon: "document",
    questions: [
      {
        q: 'How does the automated resume analysis work?',
        a: 'Our AI-powered system extracts key information from resumes including contact details, work experience, education, skills, and certifications. It then analyzes this data to provide match scores and insights.'
      },
      {
        q: 'What does the skills match percentage mean?',
        a: 'The skills match percentage shows how well a candidate\'s skills align with the job requirements. A higher percentage indicates a stronger skills match for the specific position.'
      },
      {
        q: 'Can I trust the automated resume analysis?',
        a: 'The AI analysis is designed to help streamline initial screening but should not replace human judgment. Always review the actual resume and consider factors that might not be captured by automated analysis.'
      },
      {
        q: 'Why are some resumes not fully analyzed?',
        a: 'Complex formatting, scanned documents, or resumes in certain languages may not be fully parsed. In these cases, you\'ll see a notification and should review the original document manually.'
      },
      {
        q: 'How are experience and education scores calculated?',
        a: 'Experience scores consider relevance of prior roles, duration, and recency. Education scores evaluate degree level, field relevance, and institution based on job requirements.'
      }
    ]
  },
  {
    title: 'Communication Tools',
    icon: "mail",
    questions: [
      {
        q: 'How do I send emails to applicants?',
        a: 'From the applicant details view, click the "Contact" button to open the email composer. You can use templates or write custom messages, and track all communications in the activity log.'
      },
      {
        q: 'Where can I find email templates?',
        a: 'Go to the Settings section and select "Email Templates" to view, edit, or create templates for different stages of the hiring process (acknowledgment, interview invitation, rejection, offer, etc.).'
      },
      {
        q: 'Can I schedule interviews through the platform?',
        a: 'Yes, when changing an applicant\'s status to "Interview," you\'ll be prompted to schedule the interview. This creates a calendar event and sends an invitation to both the applicant and interviewers.'
      },
      {
        q: 'How do I send bulk messages to multiple applicants?',
        a: 'In the Applicants view, use the checkboxes to select multiple candidates, then click "Bulk Actions" and choose "Send Email" to message them all at once using a template or custom message.'
      },
      {
        q: 'Can other team members see my communications with applicants?',
        a: 'Yes, all emails and messages are logged in the applicant\'s activity history for transparency and collaboration among team members.'
      }
    ]
  },
  {
    title: 'Account and Settings',
    icon: "settings",
    questions: [
      {
        q: 'How do I update my company information?',
        a: 'Go to Settings > Company Profile to update your company name, logo, description, and contact information. This information appears on job postings and communications with applicants.'
      },
      {
        q: 'How do I manage user permissions?',
        a: 'In Settings > User Management, you can add team members, assign roles (admin, recruiter, hiring manager), and set permissions for viewing, editing, or approving different aspects of the hiring process.'
      },
      {
        q: 'How do I customize the application form?',
        a: 'Go to Settings > Application Forms to create or modify the questions candidates answer when applying. You can add custom fields, make questions required, or create job-specific application forms.'
      },
      {
        q: 'How do I integrate with other HR systems?',
        a: 'In Settings > Integrations, you can connect HireFlow with your HRIS, calendar, email systems, and job boards for seamless data flow across your recruitment ecosystem.'
      },
      {
        q: 'How do I change my notification preferences?',
        a: 'Go to Settings > Notifications to control when and how you receive alerts about new applications, status changes, messages, and other recruitment activities.'
      }
    ]
  }
];