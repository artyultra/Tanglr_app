// File: src/Components/UsersPage.tsx

"use client";

import { useFriendActions } from "@/hooks/useFriendActions";
import { MessageSquareIcon, PhoneIcon, UserRoundPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const UsersPage: React.FC = () => {
  const session = useSession();
  const {
    users,
    isLoading,
    errorUsers,
    friendResponse,
    errorFriendReq,
    isSubmitting,
    submitFriendRequest,
  } = useFriendActions(session?.data?.user?.name as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorUsers) {
    return <div>Error: {errorUsers.message}</div>;
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {!users || users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No Users found</p>
          <p className="mt-2 text-sm">Share the site with your friends!</p>
        </div>
      ) : (
        [...users].map((user) => (
          <li
            key={user.email}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm"
          >
            <div className="flex flex-1 flex-col p-8">
              <img
                alt=""
                src={user.avatar_url}
                className="mx-auto size-32 shrink-0 rounded-full"
              />
              <h3 className="mt-6 text-sm font-medium text-gray-900">
                {user.username}
              </h3>
              <dl className="mt-1 flex grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm text-gray-500">{user.email}</dd>
                <dt className="sr-only">Role</dt>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <a
                    onClick={() => submitFriendRequest(user.username)}
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <UserRoundPlus
                      aria-hidden="true"
                      className="size-5 text-gray-400"
                    />
                    Send Request
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <a className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                    <MessageSquareIcon
                      aria-hidden="true"
                      className="size-5 text-gray-400"
                    />
                    Message
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default UsersPage;
