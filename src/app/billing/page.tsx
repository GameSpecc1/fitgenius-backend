
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { createStripeCheckoutSession, createStripePortalSession } from "@/lib/stripe";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// TODO: Replace with actual user subscription status and data
const FAKE_USER_ID = "user_id_123";
const FAKE_USER_EMAIL = "user@example.com";
const FAKE_USER_IS_PRO = false;
const FAKE_STRIPE_CUSTOMER_ID = "cus_XXXXXXXXXXXXXX"; // Replace with a real customer ID for testing portal

const VisaIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 12" fill="none" {...props}>
      <path d="M2.755 11.536h-2.43l3.19-11.072h2.43l-3.19 11.072zm12.338 0h2.43l3.19-11.072h-2.43l-3.19 11.072zm-4.71-5.182l.53-1.83h.01a6.382 6.382 0 0 1 2.5-2.06c.26-.1.54-.15.82-.15.22 0 .4.04.53.11l.36 2.37c-.12-.04-.26-.08-.42-.08-.32 0-.6.1-.82.28-.22.18-.38.43-.48.74l-.65 2.14h2.5l-.26 1.48h-2.5l-.92 3.201h-2.43l3.19-11.07h2.43l-.36 2.06h-2.1l-.22 1.34zm6.09-.01l.53-1.83h.01a6.382 6.382 0 0 1 2.5-2.06c.26-.1.54-.15.82-.15.22 0 .4.04.53.11l.36 2.37c-.12-.04-.26-.08-.42-.08-.32 0-.6.1-.82.28-.22.18-.38.43-.48.74l-.65 2.14h2.5l-.26 1.48h-2.5l-.92 3.201h-2.43l3.19-11.07h2.43l-.36 2.06h-2.1l-.22 1.34zm-9.362-3.118c-.1-.3-.15-.6-.15-.88a2.53 2.53 0 0 1 .42-1.46c.28-.4.67-.6 1.18-.6.55 0 .98.2 1.28.6.3.4.45.9.45 1.54 0 .3-.04.6-.11.9l-3.07-.1zm.77 8.018h2.48l3.19-11.07h-2.43l-3.24 11.07zm14.868-6.068l.42-1.34c.14-.42.22-.8.22-1.12 0-.5-.13-.9-.4-1.22a1.605 1.605 0 0 0-1.18-.48c-.53 0-1.01.15-1.44.45l.8 2.14c.12-.12.26-.18.42-.18.2 0 .35.08.45.25.1.17.15.38.15.65 0 .2-.04.4-.11.6l-2.03 6.16h2.43l3.19-11.07h-2.43l-.47 4.02z" fill="#fff"/>
    </svg>
  );
  
  const MastercardIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="12" fill="#EA001B"/>
      <circle cx="26" cy="12" r="12" fill="#F79E1B" fillOpacity="0.8"/>
    </svg>
  );
  
  const AmexIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" fill="none" {...props}>
      <rect width="38" height="24" rx="3" fill="#006FCF"/>
      <rect x="13" y="9" width="12" height="6" fill="#fff"/>
      <path d="M19.64 11.13h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74zm11.5 2.3h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74zm-2.3 0h-1.3v1.74h1.3v-1.74z" fill="#006FCF"/>
    </svg>
  );

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    // In a real app, this would come from your user authentication state
    const isProUser = FAKE_USER_IS_PRO;

    const handleGetPro = async () => {
        setIsLoading(true);
        try {
            const { url } = await createStripeCheckoutSession(FAKE_USER_ID, FAKE_USER_EMAIL);
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Error creating stripe session:", error);
            toast({
                title: "Error",
                description: "Could not redirect to Stripe. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    }
    
    const handleManageSubscription = async () => {
        setIsLoading(true);
        try {
            const { url } = await createStripePortalSession(FAKE_STRIPE_CUSTOMER_ID);
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Error creating stripe portal session:", error);
            toast({
                title: "Error",
                description: "Could not open customer portal. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
          <CreditCard /> Billing
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment details. Payments are securely handled by Stripe.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the {isProUser ? 'Pro' : 'Free'} plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{isProUser ? 'FitGenius Pro' : 'FitGenius Free'}</h3>
                  <p className="text-sm text-muted-foreground">{isProUser ? 'Billed monthly' : 'Upgrade for premium features'}</p>
                </div>
                <p className="text-2xl font-bold">{isProUser ? '£2.50/month' : '£0.00/month'}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
                {isProUser 
                    ? 'Your plan includes access to all AI features, unlimited workout plans, and premium support.' 
                    : 'The free plan includes access to core features. Upgrade to Pro for unlimited access.'
                }
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {isProUser ? (
                 <Button onClick={handleManageSubscription} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 animate-spin" />}
                    Manage Plan
                </Button>
            ) : (
                <Button onClick={handleGetPro} disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 animate-spin" />}
                    Upgrade to Pro
                </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Powered by Stripe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted">
                    <VisaIcon className="w-10 h-auto" />
                    <MastercardIcon className="w-10 h-auto" />
                    <AmexIcon className="w-10 h-auto" />
                </div>
                <Button className="w-full" onClick={isProUser ? handleManageSubscription : handleGetPro} disabled={isLoading}>
                    <ExternalLink className="mr-2"/>
                    {isProUser ? 'Manage Payments' : 'Provide Payment Details'}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

