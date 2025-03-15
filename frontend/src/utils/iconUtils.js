import { 
  Squares2X2Icon,         // Dashboard
  BriefcaseIcon,          // Job Management
  UserGroupIcon,          // Applicant Management (users)
  FunnelIcon,             // Filtering and Navigation
  ChartBarIcon,           // Analytics and Reporting
  DocumentTextIcon,       // Resume Analysis
  EnvelopeIcon,           // Communication Tools
  Cog6ToothIcon,          // Account and Settings
  QuestionMarkCircleIcon  // Fallback
} from '@heroicons/react/24/outline';

export function getIconByName(iconName) {
  const iconMap = {
    // Main sections
    dashboard: Squares2X2Icon,
    briefcase: BriefcaseIcon,
    users: UserGroupIcon,       // Changed from "applicants" to match faqData
    filter: FunnelIcon,
    chart: ChartBarIcon,        // Added for Analytics and Reporting
    document: DocumentTextIcon, // Added for Resume Analysis
    mail: EnvelopeIcon,         // Added for Communication Tools
    settings: Cog6ToothIcon,    // Added for Account and Settings
    
    // Fallback
    default: QuestionMarkCircleIcon
  };
  
  return iconMap[iconName] || iconMap.default;
}