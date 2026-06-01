/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import logoNeoVest from '../../logo-neovest.png';

interface NeoVestLogoProps {
  compact?: boolean;
  className?: string;
  dark?: boolean;
}

export default function NeoVestLogo({ compact = false, className = '' }: NeoVestLogoProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md ${compact ? 'h-7 w-7' : 'h-8 w-8'} ${className}`}
      aria-label="NeoVest"
    >
      <img
        src={logoNeoVest}
        alt="NeoVest"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}
