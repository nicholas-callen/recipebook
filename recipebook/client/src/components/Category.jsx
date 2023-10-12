import { RiNumber1, RiNumber2, RiNumber3, RiNumber4 } from 'react-icons/ri';
import { GiNoodles, GiChopsticks, } from 'react-icons/gi';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

function Category() {
  return (
    <Wrapper>
      <h3>Your Collections</h3>
      <List>
        <SLink to={'/cuisine/0'}>
          <RiNumber1 size={50} />
        </SLink>
        <SLink to={'/cuisine/1'}>
          <RiNumber2 size={50} />
        </SLink>
        <SLink to={'/cuisine/2'}>
          <RiNumber3 size={50} />
        </SLink>
        <SLink to={'/cuisine/3'}>
          <RiNumber4 size={50} />
        </SLink>
      </List>
    </Wrapper>
  );
}

const List = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0rem;
`;

const Wrapper = styled.div`
	margin: 4rem 0rem;
`;

const SLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 25%;
  margin-right: 2rem;
  text-decoration: none;
  background: linear-gradient(35deg, #494949, #313131);
  width: 6rem;
  height: 6rem;
  cursor: pointer;
  transform: scale(0.8);
  &:hover {
    background: #e94057;
  }

  h3 {
    color: black;
    font-size: 2rem;
  }
  svg {
    color: white;
    font-size: 1.5rem;
  }
  &.active{
    background: linear-gradient(to right, #f27121, #e94057);
    svg{
      color: white;
    }
    h4 {
      color: white;
    }
  }
`;


export default Category