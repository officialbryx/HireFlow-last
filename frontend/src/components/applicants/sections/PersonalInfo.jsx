import {
  UserIcon,
  PhoneIcon,
  AtSymbolIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <p className="text-gray-900 font-medium">{value || "Not provided"}</p>
    </div>
  </div>
);

export const PersonalInfo = ({ personalInfo, contactInfo, address }) => {
  // Helper function to format phone display
  const formatPhone = (info) => {
    if (info.phone_code && info.phone_number) {
      return `${info.phone_code} ${info.phone_number}${
        info.phone_type ? ` (${info.phone_type})` : ""
      }`;
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">
        Personal Information
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <InfoItem
          icon={<UserIcon className="h-5 w-5" />}
          label="Full Name"
          value={`${personalInfo.given_name || ""} ${
            personalInfo.family_name || ""
          }`}
        />
        <InfoItem
          icon={<AtSymbolIcon className="h-5 w-5" />}
          label="Email"
          value={contactInfo.email || personalInfo.email}
        />
        <InfoItem
          icon={<PhoneIcon className="h-5 w-5" />}
          label="Phone"
          value={formatPhone(contactInfo)}
        />
        <InfoItem
          icon={<MapPinIcon className="h-5 w-5" />}
          label="Location"
          value={`${address.city || ""}, ${address.country || ""}`}
        />
      </div>

      {/* Address Section */}
      {(address.street || address.city || address.country) && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-700 mb-2">Complete Address</h4>
          <p className="text-gray-600">
            {address.street && (
              <span>
                {address.street}
                <br />
              </span>
            )}
            {address.additional_address && (
              <span>
                {address.additional_address}
                <br />
              </span>
            )}
            {address.city && address.province && (
              <span>
                {address.city}, {address.province} {address.postal_code}
                <br />
              </span>
            )}
            {address.country && <span>{address.country}</span>}
          </p>
        </div>
      )}
    </div>
  );
};
