"use client";

interface Props {
  gridLayout: string;
}
const FriendRequest: React.FC<Props> = (gridLayout) => {
  return (
    <div className={`${gridLayout} row-span-1 min-w-[90vw] max-w-[90vw]`}></div>
  );
};

export default FriendRequest;
