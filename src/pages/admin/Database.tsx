import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/admin/PropertyForm";
import SampleRecordsManager from "@/components/admin/SampleRecordsManager";
import PurchaseHistory from "@/components/admin/PurchaseHistory";
import DatabaseStats from "@/components/admin/DatabaseStats";
import AllPropertiesManager from "@/components/admin/AllPropertiesManager";
import CSVUploader from "@/components/admin/CSVUploader";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Database = () => {
  const { isLoading, isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Database Management</h1>
            </div>
            <p className="text-muted-foreground">
              Manage commercial building records, sample data, and purchase history
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="add">Add Property</TabsTrigger>
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
              <PropertyForm />
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <CSVUploader />
          </TabsContent>

          <TabsContent value="all">
            <Card className="glass-card p-6">
              <h2 className="text-2xl font-bold mb-6">All Properties</h2>
              <AllPropertiesManager />
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
