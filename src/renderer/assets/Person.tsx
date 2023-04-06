import { transitionCSS } from 'renderer/Utils';
import styled from 'styled-components';

const Person = (props: {
  size: number | string;
  color: string;
  style: React.CSSProperties;
}) => (
  <svg
    width={props.size}
    height={props.size}
    viewBox="0 0 83 89"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style={props.style}
  >
    <title>Medium-M</title>
    <g id="svgs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <ColorG
        id="person.fill"
        transform="translate(-1705.000000, -1047.000000)"
        fill={props.color}
        fill-rule="nonzero"
      >
        <g id="Symbols" transform="translate(507.587500, 625.931600)">
          <g id="Medium-M" transform="translate(1197.703700, 421.503900)">
            <path
              d="M41.3086,42.8711 C51.9531,42.8711 60.9863,33.3985 60.9863,21.1426 C60.9863,9.1797 51.9043,0 41.3086,0 C30.664,0 21.5332,9.3262 21.5818053,21.2403 C21.5818053,33.3985 30.6152,42.8711 41.3086,42.8711 Z M10.8398,88.2813 L71.6797,88.2813 C79.7363,88.2813 82.5195,85.83989 82.5195,81.3477 C82.5195,68.79888 66.6015,51.5137 41.2597,51.5137 C15.9668,51.5137 0,68.79888 0,81.3477 C0,85.83989 2.7832,88.2813 10.8398,88.2813 Z"
              id="Shape"
            ></path>
          </g>
        </g>
      </ColorG>
    </g>
  </svg>
);

export default Person;

const ColorG = styled.g`
  ${transitionCSS('all 250ms ease')}
`;
