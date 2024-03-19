import { Resplit } from 'react-resplit';

const Splitter = () => {
  return (
    <Resplit.Splitter
      order={1}
      size="5px"
      style={{
        background: '#2D3748',
        cursor: 'col-resize',
      }}
    />
  );
};

export default Splitter;
