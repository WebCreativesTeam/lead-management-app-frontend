import React from 'react'
import Loader from '../Loader';

const FullScreenLoader = () => {
  return (
      <div className="flex h-[100vh] items-center justify-center overflow-hidden">
          <Loader />
      </div>
  );
}

export default FullScreenLoader;