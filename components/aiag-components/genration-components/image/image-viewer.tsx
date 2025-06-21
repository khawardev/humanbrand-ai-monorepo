'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, X, ZoomIn, ZoomOut } from 'lucide-react';
import { toast } from 'sonner';

export function ImageViewer({ imageUrl, onClose }: any) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
    const imageRef = useRef<any>(null);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated-image.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            toast.success("Image copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy image to clipboard");
        }
    };

    const handleWheel = (e: any) => {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        setScale(prevScale => Math.min(Math.max(prevScale + scaleAmount, 0.5), 10));
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.2, 10));
    }

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
    }

    const handleMouseDown = (e: any) => {
        if (e.button !== 0) return;
        e.preventDefault();
        setIsDragging(true);
        setStartDrag({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: any) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition({
            x: e.clientX - startDrag.x,
            y: e.clientY - startDrag.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [imageUrl]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={onClose}
        >
            <div
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
                onWheel={handleWheel}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Enlarged view"
                    className={`transition-transform duration-100 ease-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                    }}
                    onMouseDown={handleMouseDown}
                />
            </div>

            <div className="absolute top-4 right-4 flex items-center gap-2">
                <Button onClick={zoomIn} variant={'outline'} size={'icon'}><ZoomIn /></Button>
                <Button onClick={zoomOut} variant={'outline'} size={'icon'}><ZoomOut /></Button>
                <Button onClick={handleDownload} variant={'outline'} size={'icon'}><Download /></Button>
                <Button onClick={handleCopy} variant={'outline'} size={'icon'}><Copy /></Button>
                <Button onClick={onClose} variant={'outline'} size={'icon'}><X /></Button>
            </div>
        </div>
    );
}