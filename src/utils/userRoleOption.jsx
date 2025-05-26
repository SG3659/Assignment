import React from 'react'

const userRoleOption = (roleId) => {
  const types = {
    fresher: [
     { id: 'final_year', label: 'Final Year' },
     { id: 'pre_final_year', label: 'Pre-Final Year' },
     { id: 'graduated', label: 'Graduated' }
    ],
    Professional: [
      { id: 'product', label: 'Product' },
      { id: 'tech', label: 'Technology' },
      { id: 'marketing', label: 'Marketing/Business' },
      { id: 'design', label: 'Design' },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(types[roleId] || []);
    }, 500);
  });
};

export default userRoleOption;
