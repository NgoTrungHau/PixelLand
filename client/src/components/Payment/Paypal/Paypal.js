import { PayPalButtons } from '@paypal/react-paypal-js';

const Paypal = () => {
  const serverUrl = 'http://localhost:3000';
  const createOrder = async (data, actions) => {
    // Order is created on the server and the order id is returned
    const response = await fetch(
      `${serverUrl}/api/orders/create-paypal-order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // use the "body" param to optionally pass additional order information
        // like product skus and quantities
        body: JSON.stringify({
          cart: data,
        }),
      },
    );
    const order = await response.json();
    return order.id;
  };
  const onApprove = async (data, actions) => {
    // Order is captured on the server and the response is returned to the browser
    const response = await fetch(
      `${serverUrl}/api/orders/${data.orderID}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      },
    );
    return await response.json();
  };
  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
};

export default Paypal;
