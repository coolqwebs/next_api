"use client";
import { FC, useState } from "react";
import Button from "@/ui/Button";
import { signIn } from "next-auth/react";
import { toast } from "@/ui/Toast";

interface SignInButtonProps {}

const SignInButton: FC<SignInButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const singInWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Error with authentication",
        message: "Please try again later",
        type: "error",
      });
    }
  };
  return (
    <Button isLoading={isLoading} onClick={singInWithGoogle}>
      Sign In
    </Button>
  );
};

export default SignInButton;
