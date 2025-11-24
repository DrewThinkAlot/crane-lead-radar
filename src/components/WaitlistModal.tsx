import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, User, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'waitlist' | 'free-lead' | 'purchase';
}

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().min(1, "Company is required").max(100),
  phone: z.string().trim().min(1, "Phone is required").max(20),
});

const WaitlistModal = ({ open, onOpenChange, mode = 'waitlist' }: WaitlistModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = formSchema.parse(formData);
      
      setIsSubmitting(true);

      if (mode === 'purchase') {
        // Purchase mode - create Stripe checkout session
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: validatedData
        });

        if (error) {
          console.error("Error creating checkout session:", error);
          throw new Error("Failed to initiate checkout. Please try again.");
        }

        console.log("Checkout session created:", data);

        // Open Stripe Checkout in new tab
        if (!data.url) {
          throw new Error("No checkout URL received");
        }

        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to checkout...",
          description: "Complete your purchase in the new tab",
        });
      } else if (mode === 'free-lead') {
        // Call edge function to send email notifications
        const { data, error } = await supabase.functions.invoke('send-free-lead-notification', {
          body: validatedData
        });

        if (error) {
          console.error("Error sending free lead notification:", error);
          throw new Error("Failed to send notification. Please try again.");
        }

        console.log("Free lead notification sent:", data);
        
        toast({
          title: "Check your inbox!",
          description: "Your free lead is on the way. Delivered within 2 minutes.",
        });
      } else {
        // Waitlist mode - insert into database
        const { error } = await supabase
          .from('waitlist_signups')
          .insert({
            name: validatedData.name,
            email: validatedData.email,
            company: validatedData.company,
          });

        if (error) {
          console.error("Error saving waitlist signup:", error);
          throw new Error("Failed to save signup. Please try again.");
        }
        
        toast({
          title: "You're on the list!",
          description: "We'll reach out within 24 hours to secure your spot.",
        });
      }

      if (mode !== 'purchase') {
        onOpenChange(false);
      }
      setFormData({ name: "", email: "", company: "", phone: "" });
    } catch (error) {
      console.error("Form submission error:", error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-2 border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-primary" />
          <DialogTitle className="text-2xl">
            {mode === 'purchase' ? 'Complete Your Purchase' : mode === 'free-lead' ? 'Get Your Free Lead' : 'Secure Your Spot'}
          </DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {mode === 'purchase' ? (
              <>
                You'll receive a permanent download link for 50 Orlando commercial buildings with expiring warranties.
                <span className="block mt-2 text-secondary font-semibold">One-time payment of $499. Delivered within 20 minutes.</span>
              </>
            ) : mode === 'free-lead' ? (
              <>
                We'll send you one high-value commercial roofing lead from last week to prove our data quality.
                <span className="block mt-2 text-secondary font-semibold">Zero commitment. Zero risk.</span>
              </>
            ) : (
              <>
                Join the waitlist for exclusive access to Orlando commercial roofing leads.
                <span className="block mt-2 text-destructive font-semibold">Only 1 seat remaining.</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-background border-border"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@roofingcompany.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="bg-background border-border"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Company Name
            </Label>
            <Input
              id="company"
              placeholder="ABC Roofing Inc."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              className="bg-background border-border"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="bg-background border-border"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit" 
            className="w-full orange-glow text-lg py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              mode === 'purchase' ? "Processing..." : "Sending..."
            ) : mode === 'purchase' ? (
              "Proceed to Payment"
            ) : mode === 'free-lead' ? (
              "Send My Free Lead"
            ) : (
              "Join Waitlist"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            {mode === 'purchase' ? (
              "Secure checkout • Instant delivery • Permanent access"
            ) : mode === 'free-lead' ? (
              "No credit card • No sales calls • Delivered in 2 minutes"
            ) : (
              "Limited to 5 copies per release"
            )}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistModal;
