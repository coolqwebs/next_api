"use client";
import { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/DropdownMenu";
import Button from "@/ui/Button";
import { Loader2 } from "lucide-react";
import { toast } from "@/ui/Toast";
import { useRouter } from "next/navigation";
import { createApiKey, revokeApiKey } from "@/helpers/api-key";

interface ApiKeyOptionsProps {
  keyId: string;
  keyValue: string;
}

const ApiKeyOptions: FC<ApiKeyOptionsProps> = ({ keyId, keyValue }) => {
  const router = useRouter();
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [isRevoking, setIsRevoking] = useState<boolean>(false);

  const createNewApiKey = async () => {
    setIsCreatingNew(true);
    try {
      await revokeApiKey({ keyId: keyId });
      await createApiKey();
      router.refresh();
    } catch (error) {
      toast({
        title: "Error creating API key",
        message: "Please try again later.",
        type: "error",
      });
    } finally {
      setIsCreatingNew(false);
    }
  };

  const revokeCurrApiKey = async () => {
    setIsRevoking(true);
    try {
      await revokeApiKey({ keyId: keyId });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error revoking API key",
        message: "Please try again later.",
        type: "error",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isCreatingNew || isRevoking} asChild>
        <Button variant="ghost" className="flex gap-2 items-center">
          <p>
            {isCreatingNew
              ? "Creating new key"
              : isRevoking
              ? "Revoking key"
              : "Options"}
          </p>
          {isCreatingNew || isRevoking ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(keyValue);

            toast({
              title: "Copied",
              message: "API key copied to your clipboard",
              type: "success",
            });
          }}
        >
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={createNewApiKey}>
          Create new API key
        </DropdownMenuItem>
        <DropdownMenuItem onClick={revokeCurrApiKey}>
          Revoke API key
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ApiKeyOptions;
