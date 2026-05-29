import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <style dangerouslySetInnerHTML={{ __html: `
        .loader {
          width: 50px;
          aspect-ratio: 1;
          display: grid;
          animation: l14 4s infinite;
        }
        .loader::before,
        .loader::after {    
          content: "";
          grid-area: 1/1;
          border: 8px solid;
          border-radius: 50%;
          border-color: #334155 #334155 #0000 #0000;
          mix-blend-mode: darken;
          animation: l14 1s infinite linear;
        }
        .loader::after {
          border-color: #0000 #0000 #0f766e #0f766e;
          animation-direction: reverse;
        }
        @keyframes l14 { 
          100% { transform: rotate(1turn); }
        }
      `}} />
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
