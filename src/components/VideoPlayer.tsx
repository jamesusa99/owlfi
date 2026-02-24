interface VideoPlayerProps {
  bvid: string
  className?: string
}

/** B站视频嵌入播放器 */
export default function VideoPlayer({ bvid, className = '' }: VideoPlayerProps) {
  const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&danmaku=0&autoplay=0`

  return (
    <div className={`aspect-video rounded-2xl overflow-hidden bg-black ${className}`}>
      <iframe
        src={embedUrl}
        title="B站视频"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="w-full h-full"
      />
    </div>
  )
}
