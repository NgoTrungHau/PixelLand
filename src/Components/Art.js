import { Card } from 'react-bootstrap';

function Art(props) {
  return (
    <Card style={{ width: '18rem' }} key={props.art._id}>
      <Card.Img variant="top" src={props.art.art} />
      <Card.Body>
        <Card.Title>{props.art.author}</Card.Title>
        <Card.Text>{props.art.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Art;
