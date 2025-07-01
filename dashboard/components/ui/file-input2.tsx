// dashboard/components/ui/file-input.tsx
'use client'; // This component will use client-side features like useState and FileReader

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XCircle, Image as ImageIcon } from 'lucide-react'; // Icons for clear and placeholder

interface ImageInputProps {
    onChange: (file: File | string | null) => void; // Callback to parent: File, URL string, or null
    existingImage?: string | null; // URL of an image already stored (for edit mode)
    disabled?: boolean; // Disable the input
}

/**
 * ImageInput Component
 *
 * This component provides an interface for selecting an image file,
 * displaying a preview of the selected image or an existing image URL,
 * and allowing the user to clear the selection.
 *
 * Props:
 * - onChange: A callback function that is triggered when a file is selected or cleared.
 * It receives a File object, a string (for existingImage), or null.
 * - existingImage: Optional URL string of an image that is already associated with the data.
 * Used to display the current image in edit mode.
 * - disabled: Optional boolean to disable the input and buttons.
 */
export const ImageInput: React.FC<ImageInputProps> = ({
    onChange,
    existingImage,
    disabled = false,
}) => {
    // State to hold the URL of the image currently displayed in the preview
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    // Ref to directly access the file input element
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Effect to update the preview image when existingImage prop changes
    // or when a new file is selected internally
    useEffect(() => {
        if (existingImage) {
            setPreviewImage(existingImage);
        } else {
            setPreviewImage(null); // Clear preview if existingImage is removed
        }
    }, [existingImage]);

    // Handle file selection from the input
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Get the first selected file

        if (file) {
            // Create a URL for the selected file to display as a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Pass the File object to the parent component via onChange prop
            onChange(file);
        } else {
            // If no file is selected (e.g., user opens dialog and cancels), reset preview
            setPreviewImage(existingImage || null); // Revert to existing if available
            onChange(existingImage || null); // Pass back existing or null
        }
    };

    // Handle clearing the selected or existing image
    const handleClearImage = () => {
        setPreviewImage(null); // Clear the preview
        // Reset the file input element to clear its value
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // Notify the parent component that the image has been cleared
        onChange(null);
    };

    return (
        <div className="flex flex-col gap-4 items-center">
            {/* Image Preview Area */}
            {previewImage ? (
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                    <Image
                        src={previewImage}
                        alt="Image Preview"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                    {!disabled && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full w-8 h-8 opacity-80 hover:opacity-100 transition-opacity"
                            onClick={handleClearImage}
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                <div className="w-48 h-48 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                    <ImageIcon className="h-12 w-12" />
                </div>
            )}

            {/* File Input */}
            <Input
                type="file"
                accept="image/*" // Only allow image files
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={disabled}
                className="cursor-pointer"
            />
        </div>
    );
};
