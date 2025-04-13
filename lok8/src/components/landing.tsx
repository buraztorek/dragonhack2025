import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card } from './ui/card';
import SkateparkCard from '../../skatepark-card';

interface LandingProps {
    handleStartSession: () => void;
}

const Landing: React.FC<LandingProps> = ({ handleStartSession }) => {
    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <div style={{ width: '200px', height: '200px' }}>
                <Image
                    src="/lok8-logo.png"
                    alt="Landing Page Image"
                    layout="responsive"
                    width={300}
                    height={300}
                />
            </div>
            <SkateparkCard handleStartSession={handleStartSession} />
        </div>
    );
};

export default Landing;