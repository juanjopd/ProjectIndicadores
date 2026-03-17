'use client';
import React, { useState, useEffect } from 'react';

export default function LiveDate() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const options = { month: 'long', day: 'numeric', year: 'numeric' };  

  return (
    <div className="text-right">
      <p className="text-white font-black uppercase text sm italic tracking-tighter ">
        {date.toLocaleDateString('es-ES', options)}
      </p>  
    </div>
  );
}
