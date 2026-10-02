import Image from "next/image"

interface ProfileAvatarProps {
  size?: number
}

export function ProfileAvatar({ size = 96 }: ProfileAvatarProps) {
  return (
    <div className="relative inline-flex group">
      <div className="size-24 rounded-full overflow-hidden border border-border/80 shadow-md flex items-center justify-center bg-muted">
        <Image
          src="/avatar.jpg"
          alt="swagsxn"
          width={size}
          height={size}
          priority
          className="size-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  )
}
