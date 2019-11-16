import React from 'react'
import Svg, { Defs, G, Path } from 'react-native-svg'

const CloseBtn = props => (
  <Svg width={42.197} height={40.669} viewBox="0 0 42.197 40.669" {...props}>
    <Defs />
    <G
      transform="translate(-.005 .001)"
      filter="url(#prefix__a)"
      data-name="Torna Indietro"
    >
      <Path
        data-name="back_btn"
        d="M19.358 18.131a1.064 1.064 0 0 1 0-1.589L30.41 6.331a1.288 1.288 0 0 1 1.72 0l.713.658a1.064 1.064 0 0 1 0 1.589l-8.619 7.964a1.064 1.064 0 0 0 0 1.589l8.619 7.963a1.064 1.064 0 0 1 0 1.589l-.713.658a1.288 1.288 0 0 1-1.72 0z"
        fill="#707070"
      />
    </G>
    <G
      transform="translate(.001 -.002)"
      filter="url(#prefix__b)"
      data-name="Torna Indietro"
    >
      <Path
        data-name="back_btn"
        d="M22.842 16.539a1.064 1.064 0 0 1 0 1.589L11.79 28.339a1.288 1.288 0 0 1-1.72 0l-.713-.658a1.064 1.064 0 0 1 0-1.589l8.619-7.964a1.064 1.064 0 0 0 0-1.589L9.357 8.576a1.064 1.064 0 0 1 0-1.589l.713-.658a1.288 1.288 0 0 1 1.72 0z"
        fill="#707070"
      />
    </G>
  </Svg>
)

export default CloseBtn;