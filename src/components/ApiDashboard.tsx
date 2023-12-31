import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import { formatDistance } from "date-fns";
import LargeHeading from "@/ui/LargeHeading";
import Paragraph from "./ui/Paragraph";
import { Input } from "./ui/Input";
import Table from "@/components/Table";
import ApiKeyOptions from "@/components/ApiKeyOptions";

interface ApiDashboardProps {}

const ApiDashboard: FC<ApiDashboardProps> = async ({}) => {
  const user = await getServerSession(authOptions);
  if (!user) notFound();

  const apiKeys = await db.apiKey.findMany({ where: { userId: user.user.id } });

  const activeApiKey = apiKeys?.find((key) => key.enabled);

  if (!activeApiKey) notFound();

  const userRequests = await db.apiRequest.findMany({
    where: { apiKeyId: { in: apiKeys.map((key) => key.id) } },
  });

  const serializibleRequests = userRequests.map((req) => ({
    ...req,
    timestamp: formatDistance(new Date(req.timestamp), new Date()),
  }));

  return (
    <div className="container flex flex-col gap-6">
      <LargeHeading>Welcome back, {user.user.name}</LargeHeading>
      <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center">
        <Paragraph>Your API Key:</Paragraph>
        <Input className="w-fit truncate" readOnly value={activeApiKey.key} />
        <ApiKeyOptions keyValue={activeApiKey.key} keyId={activeApiKey.id} />
      </div>

      <Paragraph className="text-center md:text-left mt-4 -mb-4">
        Your API requests history
      </Paragraph>

      <Table userRequests={serializibleRequests} />
    </div>
  );
};

export default ApiDashboard;
