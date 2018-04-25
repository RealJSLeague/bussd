import styled from 'styled-components';
import image from '../images/bus1.jpg';

export const H1 = styled.h1`
  font-family: 'Advent Pro', 'Open Sans', sans-serif;
  margin-left: 2%px;
  margin-top: -3.5px;
`;
export const H2 = styled.h2`
  font-family: 'Advent Pro', 'Open Sans', sans-serif;
  margin-left: 2%;
  margin-top: -2%;
`;
export const H3 = styled.h3`
  font-family: 'Advent Pro', 'Open Sans', sans-serif;
`;
export const H4 = styled.h4`
  font-family: 'Advent Pro', 'Open Sans', sans-serif;
`;
export const H5 = styled.h5`
  font-family: 'Advent Pro', 'Open Sans', sans-serif;
`;
export const H6 = styled.h6`
  font-family: 'Advent Pro', 'Open Sans', sans-serif;
`;
export const AppHeader = styled.header`
  background-color: #222;
  color: white;
  display: flex;
  width: 100%;
  height: 10vh;
`;

export const AppBody = styled.div`
 /*  background: linear-gradient(rgba(250, 250, 250, 0.7), rgba(250, 250, 250, 0.7)), url(${image});
  width: 100%;
  height: 100%;
  position: absolute;
  background-repeat: no-repeat; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;

  > div {
    width: 100% !important;
  }
`;

export const MapContainer = styled.div`
  margin: 50px auto;
  width: 100%;
`;

export const BodyContainer = styled.div`
  /* margin-top: -2px;
background-color:rgba(0, 0, 0, 0.7);
position absolute;
width:100%;
height:87%; */
`;

export const Interface = styled.div`
  display: block;
  height: 10vh;
  width: 100%;
  background-color: black;
`;

export const LoadingContainer = styled.div`
  height: 80vh;
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;

  > h1 {
    color: white;
  }
`;
