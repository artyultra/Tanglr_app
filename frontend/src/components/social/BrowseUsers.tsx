"use client";
import { useFriendActions } from "@/hooks/useFriendReqActions";
import { MessageSquareIcon, UserRoundPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const BrowseUsers: React.FC = () => {
  const session = useSession();
  const router = useRouter();
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
    <div className={"col-span-2"}>
      <ul role="list" className="grid grid-cols-5 gap-6">
        {[...users].map((user) => (
          <li
            key={user.email}
            className="col-span-1 flex flex-col divide-y divide-gray-600 rounded-lg bg-gray-800 text-center shadow-sm border-2 border-gray-400"
          >
            <div className="flex flex-1 flex-col p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                src={user.avatar_url}
                className="mx-auto size-[3rem] shrink-0 rounded-full"
              />
              <h3
                onClick={() => router.push(`/${user.username}`)}
                className=" text-sm font-medium text-gray-100"
              >
                @{user.username}
              </h3>
            </div>
            <div>
              <div className=" flex divide-x divide-gray-600">
                <div className="flex w-0 flex-1">
                  <a
                    onClick={() => submitFriendRequest(user.username)}
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-100 hover:bg-gray-700 cursor-pointer"
                  >
                    <UserRoundPlus
                      aria-hidden="true"
                      className="size-[1.5rem] text-gray-400"
                    />
                  </a>
                </div>
                <div className=" flex w-0 flex-1">
                  <a className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-100 hover:bg-gray-700 cursor-pointer">
                    <MessageSquareIcon
                      aria-hidden="true"
                      className="size-[1.5rem] text-gray-400"
                    />
                  </a>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrowseUsers;
