"use client";
import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/Tabs";
import SimpleBar from "simplebar-react";
import Code from "./Code";
import { nodejsCode, pythonCode } from "@/helpers/docs-code";

const DocumentationTabs: FC = () => {
  return (
    <Tabs defaultValue="nodejs" className="max-w-2xl w-full">
      <TabsList>
        <TabsTrigger value="nodejs">NodeJS</TabsTrigger>
        <TabsTrigger value="python">Python</TabsTrigger>
      </TabsList>
      <TabsContent value="nodejs" className="text-white">
        <SimpleBar>
          <Code animated language="javascript" code={nodejsCode} show={true} />
        </SimpleBar>
      </TabsContent>
      <TabsContent value="python" className="text-white">
        <SimpleBar>
          <Code animated language="python" code={pythonCode} show={true} />
        </SimpleBar>
      </TabsContent>
    </Tabs>
  );
};

export default DocumentationTabs;
