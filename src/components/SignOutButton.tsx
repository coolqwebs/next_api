"use client";
import { FC, useState } from "react";
import Button from "@/ui/Button";
import { signOut } from "next-auth/react";
import { toast } from "@/ui/Toast";

interface SignOutButtonProps {}

const SignOutButton: FC<SignOutButtonProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signUserOut = async () => {
    setIsLoading(true);

    try {
      await signOut();
    } catch (error) {
      toast({
        title: "Error with authentication",
        message: "Please try again later",
        type: "error",
      });
    }
  };
  return (
    <Button isLoading={isLoading} onClick={signUserOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
