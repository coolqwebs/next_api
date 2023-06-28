import { CreateApiData } from "@/types/api";

export const createApiKey = async () => {
  const res = await fetch("/api/api-key/create");
  const data = (await res.json()) as CreateApiData;

  if (data.error || !data.createdApiKey) {
    if (data.error instanceof Array) {
      throw new Error(data.error.join(" "));
    }

    throw new Error(data.error ?? "Something went wrong");
  }

  return data.createdApiKey.key;
};

export const revokeApiKey = async ({ keyId }: { keyId: string }) => {
  const res = await fetch("/api/api-key/revoke", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ keyId }),
  });

  const data = (await res.json()) as { error?: string };
  if (data.error) {
    throw new Error(data.error);
  }
};
