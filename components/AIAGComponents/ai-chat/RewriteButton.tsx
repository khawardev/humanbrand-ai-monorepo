import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";

interface RewriteButtonProps {
    position: { top: number; left: number };
    onClick: () => void;
}

export default function RewriteButton({ position, onClick }: RewriteButtonProps) {
    return (
        <motion.div
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: 'translateX(-50%)',
                zIndex: 10,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
        >
            <Button onClick={onClick} size="sm" className="shadow-lg">
                Rewrite
            </Button>
        </motion.div>
    );
}