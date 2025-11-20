import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import PropertyForm from "@/components/admin/PropertyForm";
import SampleRecordsManager from "@/components/admin/SampleRecordsManager";
import PurchaseHistory from "@/components/admin/PurchaseHistory";
import DatabaseStats from "@/components/admin/DatabaseStats";

const Database = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Database Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage commercial building records, sample data, and purchase history
          </p>
        </div>

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="add">Add Property</TabsTrigger>
            <TabsTrigger value="samples">Sample Records</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
              <PropertyForm />
            </Card>
          </TabsContent>

          <TabsContent value="samples">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Manage Sample Records</h2>
              <SampleRecordsManager />
            </Card>
          </TabsContent>

          <TabsContent value="purchases">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Purchase History</h2>
              <PurchaseHistory />
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <DatabaseStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Database;
