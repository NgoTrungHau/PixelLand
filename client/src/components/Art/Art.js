import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

function Art({ art }) {
  return (
    <Card style={{ width: '18rem' }} key={art.art._id}>
      <Card.Img variant="top" src={art.art.art} />
      <Card.Body>
        <Card.Title>{art.art.author}</Card.Title>
        <Card.Text>{art.art.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

Art.propTypes = {
  art: PropTypes.object,
};

export default Art;
