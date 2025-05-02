import React from 'react';
import { Svg, Rect, Path } from 'react-native-svg';

const SearchButton = () => {
  return (
    <Svg width="50" height="46" viewBox="0 0 53 51" fill="none" >
      <Rect width="53" height="51" rx="12" fill="#F8F8F8" />
      <Rect x="0.5" y="0.5" width="52" height="50" rx="11.5" stroke="#FFFEFE" strokeOpacity="0.07" />
      <Path
        d="M30.893 29.92L33.973 33M33 24.5C33 26.4891 32.2098 28.3968 30.8033 29.8033C29.3968 31.2098 27.4891 32 25.5 32C23.5109 32 21.6032 31.2098 20.1967 29.8033C18.7902 28.3968 18 26.4891 18 24.5C18 22.5109 18.7902 20.6032 20.1967 19.1967C21.6032 17.7902 23.5109 17 25.5 17C27.4891 17 29.3968 17.7902 30.8033 19.1967C32.2098 20.6032 33 22.5109 33 24.5Z"
        stroke="#D2D2D2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchButton;