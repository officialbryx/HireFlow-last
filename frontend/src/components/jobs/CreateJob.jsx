import CreateJobPost from '../../pages/hr/CreateJobPost';

const CreateJob = ({ onJobCreated }) => {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <CreateJobPost onJobCreated={onJobCreated} />
    </div>
  );
};

export default CreateJob;