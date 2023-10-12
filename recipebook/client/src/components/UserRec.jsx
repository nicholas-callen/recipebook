import { useEffect, useState } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css';
import { Link } from "react-router-dom";
import { useLoginContext } from "../LoginContext";

function UserRec() { // REPLACE WITH RECOMMENDED

  let login = useLoginContext();
	const [popular, setPopular] = useState([]);
  const [isSpoon, setSpoon] = useState(true);

	useEffect(() => {
		getRec();
	}, []);

	const getRec = async() => {
    if (login.username==="") {
      const api = await fetch(
        'https://api.spoonacular.com/recipes/random?apiKey=860072773b074da38c79004d91bbdf00&number=9'
      ); // REPLACE WITH GET FROM DB?
      const data = await api.json();

      localStorage.setItem('popular', JSON.stringify(data.recipes));
      setPopular(data.recipes); // recipes is an array holding objects
      console.log(data.recipes);
      setSpoon(true);
    }
    else {
      const result = await fetch(
        'http://localhost:8000/user/' + login.username + '/recommended'
      );
      const data = await result.json();
      //console.log(data);
      setPopular(data)
      setSpoon(false);
      console.log("YES")
      popular.map((recipe) => {
        console.log(recipe);
      })
    }
	};
	
  if (isSpoon) {
    return (
      <div>
        <Wrapper>
          <h3>Popular Picks</h3>

          <Splide
            options={{
              perPage: 3,
              arrows: true,
              drag: 'free',
              gap: '5rem',
            }}
          >
            {popular.map((recipe) => {
              return(
                <SplideSlide key={recipe.id}>
                  <Card>
                    <Link to={"/recipe/" + recipe.id}>
                      <p>{recipe.title}</p>
                      <img src={recipe.image} alt={recipe.title} />
                      <Gradient />
                    </Link>
                  </Card>
                </SplideSlide>
              );
            })}
          </Splide>
        </Wrapper>
      </div>
    );
  }
  else {
    return (
      <div>
        <Wrapper>
          <h3>Recommended for You</h3>

          <Splide
            options={{
              perPage: 3,
              arrows: true,
              drag: 'free',
              gap: '5rem',
            }}
          >
            {popular.map((item) => {
              return(
                <SplideSlide key={item.recipe._id}>
                  <Card>
                    <Link to={"/recipedb/" + item.recipe._id}>
                      <p>{item.recipe.name}</p>
                      <Gradient />
                    </Link>
                  </Card>
                </SplideSlide>
              );
            })}
          </Splide>
        </Wrapper>
      </div>
    );
  }
}

/*


            {popular.map((recipe) => {
              return(
                <SplideSlide key={recipe._id}>
                  <Card>
                    <Link to={"/recipedb/" + recipe._id}>
                      <p>{recipe.name}</p>
                      <Gradient />
                    </Link>
                  </Card>
                </SplideSlide>
              );
            })}

            */
const Wrapper = styled.div`
	margin: 4rem 0rem;
`;

const Card = styled.div`
	min-height: 25rem;
	border-radius: 2rem;
	overflow: hidden;
	position: relative;
  background: #e94057;

	img{
		border-radius: 2rem;
		position: absolute;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	p {
		position: absolute;
		z-index: 10;
		left: 50%;
		bottom: 0%;
		transform: translate(-50%, 0%);
		color: white;
		width: 100%;
		text-align: center;
		font-weight: 600;
		font-size: 1rem;
		height: 40%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

const Gradient = styled.div`
	z-index: 3;
	position: absolute;
	width: 100%;
	height: 100%;
	background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
`;


export default UserRec;
