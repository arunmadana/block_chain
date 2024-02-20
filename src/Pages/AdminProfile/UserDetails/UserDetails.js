import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeStatus } from 'Services/API/greenboxUsers/greenboxUsers';
import {
  CancelButton,
  Card,
  FormField,
  FormPhone,
  FormSelect,
  LabeledToggle,
  Page
} from 'Components/Atoms';
import toast from 'Helpers/toast';
import './UserDetails.style.scss';

export default function UserDetails() {
  const [data, setData] = useState(user_data);
  const [isLoading, setIsLoading] = useState(true);
  const [isLabeledToggleChecked, setIsLabeledToggleChecked] = useState(false);
  const userInfo = useSelector((store) => store.adminUserDetails?.data);
  const navigateTo = useNavigate();

  const updateStatus = () => {
    setIsLoading(true);
    changeStatus(
      [
        {
          id: data.id
        }
      ],
      isLabeledToggleChecked ? 'inactive' : 'active'
    )
      .then(() => {
        setIsLabeledToggleChecked((prev) => !prev);
        toast.success('Profile updated!');
        setIsLoading(false);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.errorDescription ??
          'Error to update status';
        toast.error(message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const [dialCode, phoneNumber] = userInfo.phoneNumber.split(' ');
    setData({
      ...userInfo,
      phoneNumber,
      dialCode,
      permission: { label: userInfo.permission, value: userInfo.permission },
      department: { label: userInfo.department, value: userInfo.department }
    });
    setIsLabeledToggleChecked(userInfo.active);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [userInfo]);
  console.log(userInfo.phoneNumber);
  return (
    <Page>
      <Card
        title="User Details"
        id="admin-profile-user-details"
        isLoading={isLoading}
      >
        <LabeledToggle
          onChange={() => {}}
          onClick={() => updateStatus()}
          checked={isLabeledToggleChecked}
        />
        <div className="row">
          <FormField
            label="First Name"
            disabled
            locked
            value={data.firstName}
          />
          <FormField label="Last Name" disabled locked value={data.lastName} />
        </div>
        <div className="row">
          <FormField
            label="Email"
            disabled
            locked
            value={data.email}
            maxLength={255}
          />
          <FormPhone
            label="Phone Number"
            disabled
            locked
            format={'(###) ###-####'}
            value={userInfo.phoneNumber}
          />
        </div>
        <div className="row">
          <FormSelect
            isDisabled
            label="Permission"
            options={permissionOptions}
            value={data.permission}
          />
          <FormSelect
            isDisabled
            label="Employee Department"
            options={employeeDepartmentOptions}
            value={data.department}
          />
        </div>
      </Card>

      <CancelButton onClick={() => navigateTo('/business-profiles')}>
        Cancel
      </CancelButton>
    </Page>
  );
}

const user_data = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dial_code: '1',
  country: 'us',
  permission: { value: '', label: '' },
  department: { label: '', value: '' }
};

const permissionOptions = [
  { value: 'G-ADMIN', label: 'Full Admin' },
  { value: 'G-DIRECTOR', label: 'Director' }
];

const employeeDepartmentOptions = [
  { value: 'Support', label: 'Support' },
  { value: 'Develpoment', label: 'Develpoment' },
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Legal', label: 'Legal' },
  { value: 'Risk Management', label: 'Risk Management' },
  { value: 'Administrator', label: 'Administrator' }
];
