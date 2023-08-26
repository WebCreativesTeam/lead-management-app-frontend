import React from 'react'

const Loader = () => {
  return (
      <div className="flex min-h-[10rem] items-center">
          <span className="m-auto inline-block h-14 w-14 animate-[spin_3s_linear_infinite] rounded-full border-8 border-b-success border-l-primary border-r-warning border-t-danger align-middle"></span>
      </div>
  );
}

export default Loader