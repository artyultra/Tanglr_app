"use client";
import { useFriendActions } from "@/hooks/useFriendReqActions";
import { MessageSquareIcon, PhoneIcon, UserRoundPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const UsersPage: React.FC = () => {
  const session = useSession();
  const { users, isLoading, errorUsers, submitFriendRequest } =
    useFriendActions(session?.data?.user?.name as string);

  if (isLoading) {
    return <div className="text-gray-100">Loading...</div>;
  }

  if (errorUsers) {
    return <div className="text-gray-100">Error: {errorUsers.message}</div>;
  }

  if (!users || users.length === 0) {
    return (
      <div className="md:col-span-3 bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4 text-gray-100">
        No users found
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="max-h-[50vh] grid grid-cols-2 gap-6 overflow-y-auto"
    >
      {[...users].map((user) => (
        <li
          key={user.email}
          className="col-span-1 flex flex-col divide-y divide-gray-600 rounded-lg bg-gray-800 text-center shadow-sm border-2 border-gray-400"
        >
          <div className="flex flex-1 flex-col p-8">
            <img
              alt=""
              src={user.avatar_url}
              className="mx-auto size-[4rem] shrink-0 rounded-full"
            />
            <h3 className="mt-6 text-sm font-medium text-gray-100">
              {user.username}
            </h3>
            <dl className="mt-1 flex grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-sm text-gray-300">{user.email}</dd>
              <dt className="sr-only">Role</dt>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-600">
              <div className="flex w-0 flex-1 p-2">
                <a
                  onClick={() => submitFriendRequest(user.username)}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-100 hover:bg-gray-700 cursor-pointer"
                >
                  <UserRoundPlus
                    aria-hidden="true"
                    className="size-[1.5rem] text-gray-400"
                  />
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-100 hover:bg-gray-700 cursor-pointer">
                  <MessageSquareIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default UsersPage;
