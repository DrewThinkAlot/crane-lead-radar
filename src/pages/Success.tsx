import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Mail } from "lucide-react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [email, setEmail] = useState("");

  useEffect(() => {
    // You could optionally fetch session details from Stripe here
    // For now, we'll just show a generic success message
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container max-w-2xl">
        <div className="text-center space-y-6 animate-slide-up">
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-secondary" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            Payment Successful! 🎉
          </h1>

          <p className="text-xl text-muted-foreground">
            Thank you for your purchase. Your Orlando Commercial Roofing Database is being prepared.
          </p>

          <div className="bg-card border-2 border-primary/20 rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-primary mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-2">Check Your Email</h3>
                <p className="text-muted-foreground">
                  We're sending your database download link to your email within the next <strong>20 minutes</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Download className="w-6 h-6 text-secondary mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-2">Permanent Access</h3>
                <p className="text-muted-foreground">
                  Your download link never expires. Save the email for future access to your database.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h3 className="font-semibold text-lg">What's Included:</h3>
            <ul className="text-left max-w-md mx-auto space-y-2 text-muted-foreground">
              <li>✅ 50 Commercial Properties in Orlando</li>
              <li>✅ Property Owner Names & Contact Info</li>
              <li>✅ Phone Numbers & Email Addresses</li>
              <li>✅ Warranty Expiration Dates</li>
              <li>✅ Building Details & Square Footage</li>
              <li>✅ Last Roof Permit Dates</li>
            </ul>
          </div>

          <div className="pt-6">
            <Link to="/">
              <Button size="lg" variant="outline">
                Return to Home
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            Questions? Reply to the delivery email and we'll help you out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
