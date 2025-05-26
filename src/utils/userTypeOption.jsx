import React from 'react'


const userTypeOption = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'fresher', label: 'Student/Fresher' },
        { id: 'Professional', label: 'Working Professional' },
     
      ]);
    }, 1000);
  });
};

export default userTypeOption