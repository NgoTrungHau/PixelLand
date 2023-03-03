import { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import Masonry from 'react-masonry-css';
import axios from 'axios';

function Art({ props }) {
  return (
    <Card>
      <Card.Img variant="top" src={props.art} />
    </Card>
  );
}

function ArtList() {
  const [arts, setArt] = useState([]);
  useEffect(() => {
    getArts();
  }, []);

  const getArts = async () => {
    const document = await axios.get('http://localhost:3000/api/arts');
    setArt(document.data);
  };

  const breakpoint = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpoint}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {arts.map((art, index) => {
        return <Art key={art._id} props={art}></Art>;
      })}
    </Masonry>
  );
}

export default ArtList;
