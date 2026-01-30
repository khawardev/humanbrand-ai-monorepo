import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface RewriteTargetProps {
    text: string;
    onCancel: () => void;
}

export default function RewriteTarget({ text, onCancel }: RewriteTargetProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-primary/10 border-l-4 border-primary p-2 pl-3 rounded-t-lg flex items-center justify-between gap-4 text-sm"
        >
            <div className="flex items-baseline gap-2 overflow-hidden">
                <span className="font-semibold text-primary flex-shrink-0">Rewrite:</span>
                <p className="text-primary/80 truncate">"{text}"</p>
            </div>
            <button
                onClick={onCancel}
                className="p-1 rounded-full hover:bg-primary/20 text-primary flex-shrink-0"
                aria-label="Cancel rewrite"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}