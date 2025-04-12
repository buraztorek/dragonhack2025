import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Card } from './ui/card';

const Landing: React.FC = () => {
    return (
        <div>
            <Card className="p-6 shadow-lg rounded-lg bg-white">
                <h2 className="text-xl font-bold mb-2">Skatepark Location</h2>
                <p className="text-gray-600 mb-4">Central Skatepark, Downtown</p>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-800 font-medium">Skaters Currently:</span>
                    <span className="text-green-600 font-bold">15</span>
                </div>
                <div className="text-gray-600">
                    <p>Opening Hours: 8:00 AM - 10:00 PM</p>
                    <p>Weather: Sunny, 25°C</p>
                </div>
            </Card>
            <div style={{ width: '300px', height: '300px' }}>
                <Image
                    src="/lok8-logo.png"
                    alt="Landing Page Image"
                    layout="responsive"
                    width={300}
                    height={300}
                />
            </div>
            <Button variant="default" className="mt-4">
                Click Me
            </Button>
        </div>
    );
};

export default Landing;