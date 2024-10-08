import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { MdMargin } from 'react-icons/md';

const BackButton = ({ destination }) => {
    return (
        <div className='flex'>
            <Link style={styles.button} to={destination} className='bg-sky-800 text-white px-4 py-1 rounded-lg'>
                <BsArrowLeft className='text-2xl' />
            </Link>
        </div>
    );
}
const styles = {

  button: {
    backgroundColor: '#5b2c6f',
    color: '#fff',
    border: 'none',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
   
    
  },
  };
export default BackButton;
