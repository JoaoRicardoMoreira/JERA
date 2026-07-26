'use client';

import Image from 'next/image';
import type { Gender } from '@/lib/types';

const avatarByGender: Partial<Record<Gender, string>> = {
  MALE: '/brand/jera-avatar-viking-male-blond.png',
  FEMALE: '/brand/jera-avatar-viking-female-blond.png',
};

export function UserAvatar({
  name,
  gender,
  large = false,
}: {
  name?: string;
  gender?: Gender | null;
  large?: boolean;
}) {
  const avatar = gender ? avatarByGender[gender] : undefined;
  const initial = name?.trim().slice(0, 1).toUpperCase() || 'J';

  return (
    <span className={large ? 'user-avatar user-avatar-large' : 'user-avatar'}>
      {avatar ? (
        <Image
          src={avatar}
          alt=""
          fill
          sizes={large ? '72px' : '42px'}
          className="user-avatar-image"
        />
      ) : (
        initial
      )}
    </span>
  );
}
