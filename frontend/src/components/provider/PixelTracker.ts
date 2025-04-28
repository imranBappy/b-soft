"use client"
import { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';
const PixelTracker = () => {
    useEffect(() => {
        const pixelId = process.env.NEXT_PUBLIC_PIXEL_ID;
        if (pixelId) {
            ReactPixel.init(pixelId);
        } else {
            console.error('Pixel ID is not defined');
        }
        ReactPixel.pageView();
    }, []);
    return null;
};
export default PixelTracker;
