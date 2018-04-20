import styled from 'styled-components';
import image from  '../images/bus1.jpg';

export const H1 = styled.h1`
font-family: 'Advent Pro', 'Open Sans', sans-serif;
margin-left: 2%px;
margin-top:-3.5px;
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
height: 70px;
padding-top:1px;
color:white;
`;
export const AppBody = styled.div`

padding-top:1px;
background:
linear-gradient(
  rgba(250, 250, 250, 0.7),
  rgba(250, 250, 250, 0.7)
),
url(${image});
width:100%;
height:100%;
position: absolute; 
background-repeat: no-repeat;
`; 
export const MapContainer = styled.div`
 margin-left: 400px;
 margin-top: 40px;
 height:40%;

`; 
export const BodyContainer = styled.div`
margin-top: -2px;
background-color:rgba(0, 0, 0, 0.7);
position absolute;
width:100%;
height:87%;
`; 


