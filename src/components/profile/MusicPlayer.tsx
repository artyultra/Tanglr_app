// File: components/profile/MusicPlayer.tsx
const MusicPlayer: React.FC = () => {
  return (
    <div className="bg-gray-800 border-2 border-gray-400 rounded-4xl p-4 mb-4">
      <h3 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">
        My Music
      </h3>
      <div className="bg-black text-gray-100 p-2 rounded-lg text-xs">
        <div className="flex justify-between items-center mb-1"></div>
        <div className="w-full aspect-video mb-2">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/4G6QDNC4jPs"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
