import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  description?: string | null;
  photoUrl?: string | null;
}

export function ProfileHeader({
  name,
  description,
  photoUrl,
}: ProfileHeaderProps) {
  return (
    <div className="text-center mb-8 animate-fade-in">
      {photoUrl && (
        <div className="mb-4 flex justify-center">
          <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white shadow-xl">
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
        {name}
      </h1>
      {description && (
        <p className="text-gray-600 text-lg max-w-md mx-auto px-4">
          {description}
        </p>
      )}
    </div>
  );
}
