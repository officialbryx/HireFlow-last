import HRNavbar from '../../components/HRNavbar';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const FAQ = () => {
  const faqSections = [
    {
      title: 'Dashboard',
      questions: [
        {
          q: 'How do I read the dashboard metrics?',
          a: 'The dashboard displays key metrics including active jobs, archived jobs, total applicants, and shortlisted candidates. Stats cards show current numbers and monthly changes where applicable.'
        },
        {
          q: 'What are the quick actions?',
          a: 'Quick actions allow you to post new jobs or manage existing job posts directly from the dashboard.'
        }
      ]
    },
    {
      title: 'Job Management',
      questions: [
        {
          q: 'How do I create a new job post?',
          a: 'Click the "Post New Job" button and fill in all required information including job details, requirements, and company information.'
        },
        {
          q: 'How do I edit or archive a job post?',
          a: 'In the Jobs page, find the job you want to modify. Use the edit icon to update details or the archive button to move it to archived jobs.'
        }
      ]
    },
    {
      title: 'Applicant Management',
      questions: [
        {
          q: 'How do I review applicants?',
          a: 'Navigate to the Applicants page where you can view all applications, filter by job post, and review individual applications.'
        },
        {
          q: 'How do I shortlist candidates?',
          a: 'While reviewing an application, use the shortlist button to add candidates to your shortlist for further consideration.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Frequently Asked Questions
              </h1>
              <a
                href="/user-manual.pdf"
                download
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Download User Manual
              </a>
            </div>

            <div className="space-y-8">
              {faqSections.map((section, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.questions.map((item, qIndex) => (
                      <div key={qIndex}>
                        <h3 className="text-base font-medium text-gray-900 mb-2">
                          {item.q}
                        </h3>
                        <p className="text-gray-600">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;