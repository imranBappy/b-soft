import React from 'react';
import { Button } from './ui/button';

const DownloadExtension = () => {
    const handleDownload = () => {
        console.log('download');

        const link = document.createElement('a');
        link.href = '/bsoft-extension.zip';   // Path to your ZIP file
        link.download = 'bsoft-extension.zip'; // The filename for download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (
        <Button onClick={handleDownload} variant={'secondary'}>Download Extension</Button>

    );
};

export default DownloadExtension;