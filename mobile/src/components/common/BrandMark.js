import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function BrandMark({ size = 40 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Circle cx="24" cy="24" r="22" fill="#F1EAF8" />
      <Circle cx="24" cy="24" r="18" stroke="#D8C9E7" strokeWidth="1.4" />
      <Path d="M36.2 12.8a17.7 17.7 0 0 1 5.7 11.8" stroke="#7950A8" strokeWidth="2.4" strokeLinecap="round" />
      <Circle cx="36" cy="12.7" r="2.8" fill="#E8B8D0" stroke="#fff" strokeWidth="1.2" />
      <Path d="M23.5 22.7C19.4 13.3 11.1 12.9 10 18.2c-1 4.8 5.6 7.8 13.1 6.5" fill="#fff" stroke="#7950A8" strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M24.5 22.7c4.1-9.4 12.4-9.8 13.5-4.5 1 4.8-5.6 7.8-13.1 6.5" fill="#fff" stroke="#7950A8" strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M23.3 25.1c-7.7 1.4-10.2 7.4-6.3 9.4 3.4 1.8 6.3-2.6 7-7.9" fill="#E8B8D0" stroke="#7950A8" strokeWidth="1.7" strokeLinejoin="round" />
      <Path d="M24.7 25.1c7.7 1.4 10.2 7.4 6.3 9.4-3.4 1.8-6.3-2.6-7-7.9" fill="#E8B8D0" stroke="#7950A8" strokeWidth="1.7" strokeLinejoin="round" />
      <Path d="M24 19.7v11.1" stroke="#5E3B87" strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="24" cy="24.7" r="2.1" fill="#7950A8" />
    </Svg>
  );
}
