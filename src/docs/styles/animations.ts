import { keyframes } from '@emotion/core'

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const growIn = keyframes`
  from { transform: scale(0); }
  to { transform: scale(1); }
`

export const rotate360 = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

// A bit confusing, sourced from https://codepen.io/anon/pen/bwmkAo?editors=1100
// This and the rotateShow keyframes below are used to animate flipping a card over
export const rotateNoShow = keyframes`
	0% {
		transform: rotateY(0deg);
    height: 100%;
    width: 100%;
	}

	49% {
		height: 100%;
		width: 100%;
	}

	50% {
		height: 0;
		width: 0;
	}

	100% {
		transform: rotateY(180deg);
		height: 0;
		width: 0;
	}
`

export const rotateShow = keyframes`
	0% {
		transform: rotateY(-180deg);
		height: 0;
		width: 0;
	}

	49% {
		height: 0;
		width: 0;
	}

	50% {
		height: 100%;
		width: 100%;
	}

	100% {
		transform: rotateY(0deg);
		height: 100%;
		width: 100%;
	}
`
