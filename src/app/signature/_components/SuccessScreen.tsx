import React from 'react';
import { CheckCircleIcon } from './icons';

interface SuccessScreenProps {
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ onReset }) => (
  <div className="success-screen">
    <CheckCircleIcon className="icon" />
    <h2>Document Finalized Successfully!</h2>
    <p>Your signed PDF has been downloaded.</p>
    <button onClick={onReset}>Sign Another Document</button>
  </div>
);

export default SuccessScreen;
