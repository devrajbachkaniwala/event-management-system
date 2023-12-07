'use client';

import { Loading } from '@/components/Loading';
import { OrgForm } from '@/components/OrgForm';
import { getProfile } from '@/utils/getProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function OrganizationEditPage() {
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
    return <Loading />;
  }

  return (
    <div className='mx-6'>
      <OrgForm isEditForm={true} />
    </div>
  );
}

export default OrganizationEditPage;
