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
  background-color: black;
  color: white;
  display: flex;
  width: 100%;
  min-height: 10vh;
  height: auto;
<<<<<<< HEAD
  box-shadow: 1px 1px 1px 2px grey;
=======
  //box-shadow: 1px 1px 1px 2px grey;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
>>>>>>> 220ca912725b6437759fb9a1e30cd87c76dfec89
  position: absolute;
  z-index: 99;
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
  position: relative;

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: black;
  z-index: 9999;
<<<<<<< HEAD
=======
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.16), 0px -3px 6px rgba(0, 0, 0, 0.23);
  position: absolute;
  bottom: 0;
  transition: 1s all;
>>>>>>> 220ca912725b6437759fb9a1e30cd87c76dfec89

  > h1 {
    color: white;
  }
`;

export const VehicleDisplay = styled.div`
<<<<<<< HEAD
  padding: 0 0 20px 0;
=======
  padding: 0;

  @media (min-width: 1024px) {
    padding: 0 0 20px 0;
  }
>>>>>>> 220ca912725b6437759fb9a1e30cd87c76dfec89

  > h2 {
    color: white;
    display: inline-block;
<<<<<<< HEAD
    font-size: 2.5em;
    margin: 10px 10px 0px 20px;
  }
  > h3 {
    color: white;
    font-size: 2em;
    margin: 10px 0;
=======
    font-size: 1.25em;
    margin: 10px 10px 0px 20px;

    @media (min-width: 1024px) {
      font-size: 2em;
    }
  }
  > h3 {
    color: white;
    font-size: 1em;
    margin: 10px 0;

    @media (min-width: 1024px) {
      font-size: 2em;
    }
>>>>>>> 220ca912725b6437759fb9a1e30cd87c76dfec89
  }
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
    font-size: 2.5em;
  }
`;

export const RefreshButton = styled.button`
  background-color: #66bb6a;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
  position: absolute;
  right: 25px;
<<<<<<< HEAD
  bottom: 25px;
=======
  top: 25px;
>>>>>>> 220ca912725b6437759fb9a1e30cd87c76dfec89
  padding: 8px;
  border: 1px solid #18ab29;
  border-radius: 10%;
  z-index: 9999;
  transition: 0.5s all;

<<<<<<< HEAD
  > &:hover {
    background-color: #18ab29;
  }
`;
=======
  &:hover {
    background-color: #18ab29;
  }
`;

export const HideButton = styled.button`
  padding: 5px 9px;
  background-color: transparent;
  border: 1.75px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 1em;
  position: absolute;
  top: 25px;
  right: 25px;
  transition: 0.5s all;

  &:hover {
    background-color: white;
    color: black;
  }

  @media (min-width: 1024px) {
    border: 3px solid white;
    font-size: 2em;
    padding: 10px 18px;
  }
`;
>>>>>>> 220ca912725b6437759fb9a1e30cd87c76dfec89
