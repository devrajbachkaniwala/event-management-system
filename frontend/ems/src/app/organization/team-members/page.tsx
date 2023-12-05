'use client';

import { Loading } from '@/components/Loading';
import { UserDto } from '@/dto/user.dto';
import { addTeamMember } from '@/utils/addTeamMember';
import { getOrgTeamMembers } from '@/utils/getOrgTeamMembers';
import { getProfile } from '@/utils/getProfile';
import { removeTeamMember } from '@/utils/removeTeamMember';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

function OrganizationTeamMembers() {
  const [isLoading, setIsLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [emailInputErrMsg, setEmailInputErrMsg] = useState('');
  const [teamMembers, setTeamMembers] = useState<UserDto[]>([]);

  const router = useRouter();

  useEffect(() => {
    getProfile().then((user) => {
      if (!user) {
        router.replace('/login');
      } else if (!user?.orgId) {
        router.replace('/organization/create');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    setEmailInputErrMsg('');

    getOrgTeamMembers()
      .then((data) => {
        if (data) {
          setTeamMembers(data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleEmailInput = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleAddTeamMember = async () => {
    try {
      setEmailInputErrMsg('');

      const user = await addTeamMember(emailInput);

      setTeamMembers((prev) => [...prev, user]);
      setEmailInput('');
    } catch (err: any) {
      setEmailInputErrMsg(err.message);
    }
  };

  const handleRemoveTeamMember = async (userId: string) => {
    const res = await removeTeamMember(userId);
    if (res) {
      setTeamMembers((members) =>
        members.filter((member) => member.id !== userId)
      );
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(emailInput);

    await handleAddTeamMember();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='mx-6 h-4/5 mb-1'>
      {emailInputErrMsg ? (
        <div className='text-center error-msg my-2'>{emailInputErrMsg}</div>
      ) : null}

      <div className='flex justify-center my-2'>
        <form className='flex w-1/2 justify-center' onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Email'
            className='input input-bordered w-full max-w-xs'
            required
            value={emailInput}
            onChange={handleEmailInput}
          />
          <button type='submit' className='ml-2 btn btn-outline btn-info'>
            Add team member
          </button>
        </form>
      </div>

      <h2 className='font-bold text-2xl text-center my-6'>My Team Members</h2>

      <div className='flex justify-center'>
        <div className='overflow-x-auto w-3/4'>
          <table className='table'>
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((teamMember) => (
                <tr key={teamMember.id}>
                  <td>
                    <div className='flex items-center gap-3'>
                      <div className='avatar'>
                        <div className='mask mask-squircle bg-slate-500 w-12 h-12'>
                          {teamMember.userPhotoUrl ? (
                            <Image
                              src={teamMember.userPhotoUrl}
                              alt={'team member photo'}
                              width={200}
                              height={200}
                            />
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <div className='font-bold'>{teamMember.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td>{teamMember.username}</td>
                  <td>{teamMember.email}</td>
                  <th>
                    <button
                      type='button'
                      className='btn btn-outline btn-error btn-sm'
                      disabled={teamMember.role === 'ORGANIZATION_CREATOR'}
                      onClick={async () =>
                        await handleRemoveTeamMember(teamMember.id)
                      }
                    >
                      remove
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrganizationTeamMembers;
