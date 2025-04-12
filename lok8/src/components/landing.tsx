import React from 'react';
import Image from 'next/image';

const Landing: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Landing Page</h1>
            <p>This is a boilerplate component.</p>
            <div style={{ width: '300px', height: '300px' }}>
            <Image 
                src="/lok8-logo.png"
                alt="Landing Page Image" 
                layout="responsive" 
                width={300} 
                height={300} 
            />
            </div>
        </div>
    );
};

export default Landing;