import CreateJobPost from '../../pages/hr/CreateJobPost';

const JobFormModal = ({ isOpen, onClose, onSubmit, isEditing, initialData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CreateJobPost
          isEditing={isEditing}
          initialData={initialData}
          onClose={onClose}
          onJobCreated={onSubmit}
        />
      </div>
    </div>
  );
};

export default JobFormModal;