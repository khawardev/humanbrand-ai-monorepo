'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/better-auth/auth-client";

interface AuthModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAuthSuccess: () => void;
}

export default function AuthModal({ isOpen, onOpenChange, onAuthSuccess }: AuthModalProps) {
    const handleGoogleSignIn = async () => {
        const { error } = await signIn.social({
            provider: "google"
        }, {
            onSuccess: () => {
                onAuthSuccess();
            }
        });
        if (error) {
            console.error("Google sign-in failed, Please try again.", error);
            toast.error("Google sign-in failed, Please try again.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <h5 className="font-semibold">Create an Account or Sign In</h5>
                    <DialogDescription>
                        One last step to start your free website audit.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <SignUpForm onSuccess={onAuthSuccess} />
                    </TabsContent>
                    <TabsContent value="signin">
                        <SignInForm onSuccess={onAuthSuccess} />
                    </TabsContent>
                </Tabs>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button variant="outline" onClick={handleGoogleSignIn}>
                    <FcGoogle className=" h-4 w-4" />
                    Google
                </Button>
            </DialogContent>
        </Dialog>
    );
}