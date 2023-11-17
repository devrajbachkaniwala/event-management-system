'use client';

import { OrgForm } from '@/components/OrgForm';
import { getProfile } from '@/utils/getProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function OrganizationEdit() {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    getProfile().then((u) => {
      if (!u) {
        router.replace('/login');
      } else if (!u?.orgId) {
        router.replace('/organization/create');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className='mx-6'>
      <OrgForm isEditForm={true} />
    </div>
  );
}

export default OrganizationEdit;
