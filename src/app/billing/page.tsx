"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, ExternalLink, Loader2 } from "lucide-react";
import { createStripeCheckoutSession } from "@/lib/stripe";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const invoices = [
  { id: "INV001", date: "2023-10-01", amount: "£2.50", status: "Paid" },
  { id: "INV002", date: "2023-09-01", amount: "£2.50", status: "Paid" },
  { id: "INV003", date: "2023-08-01", amount: "£2.50", status: "Paid" },
];

const StripeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 84 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.82 20.31c0-1.12.42-2.11,1.13-2.88.7-.77,1.64-1.21,2.74-1.21,1.52,0,2.69.74,3.53,2.02l-2.6,1.54c-.26-.4-.6-.7-1.02-.7-.52,0-.94.3-1.16.82-.22.52-.33,1.13-.33,1.83,0,.7.11,1.31.33,1.83.22.52.64.78,1.16.78.42,0,.76-.3,1.02-.7l2.6,1.54c-.84,1.28-2.01,2.02-3.53,2.02-1.1,0-2.04-.44-2.74-1.21-.71-.78-1.13-1.76-1.13-2.88Zm16.32,2.83c.48-.68.73-1.52.73-2.5,0-1.3-.4-2.38-1.2-3.23-.8-.85-1.9-1.28-3.32-1.28-1.09,0-2.04.38-2.83,1.1L34,15.22c.38-.34.82-.5,1.34-.5.84,0,1.45.49,1.8,1.48h-3.4v2.7h5.36c0,.18,0,.35-.04.53-.2,1.38-.8,2.48-1.8,3.3-.98.82-2.26,1.24-3.83,1.24-1.32,0-2.47-.45-3.42-1.36s-1.43-2.2-1.43-3.88c0-1.7.53-3,1.6-3.9,1.06-.9,2.48-1.36,4.22-1.36,1.12,0,2.1.28,2.94.84l1.9-2.2c-1.1-.8-2.5-1.2-4.2-1.2-2.18,0-3.95.73-5.32,2.2-1.37,1.46-2.05,3.44-2.05,5.92,0,2.52.73,4.48,2.2,5.88,1.47,1.4,3.3,2.09,5.5,2.09,2.08,0,3.75-.62,4.98-1.87,1.23-1.24,1.9-2.9,1.9-4.98,0-.73-.13-1.4-.4-2.02h-4.32v-3.32h.2Zm17.84-2.83c0-1.48-.4-2.7-1.18-3.66-.78-.96-1.8-1.44-3.04-1.44-1.18,0-2.18.49-3,1.48l2.22,1.64c.34-.44.73-.66,1.18-.66.52,0,.92.27,1.2.8.28.53.42,1.2.42,2,0,.8-.14,1.47-.42,2-.28.53-.68.8-1.2.8-.44,0-.84-.22-1.18-.66L50.4,26.4c.82,1,1.82,1.48,3,1.48,1.24,0,2.26-.48,3.04-1.44.78-.96,1.18-2.18,1.18-3.66ZM82.02,7.34h-2.52v20.9h2.52V7.34Zm-5.72,0H73.78l-5.3,13.2-5.3-13.2h-2.52l7.1,17.44-2.1,3.46h2.82l.8-1.34h5.62l3.4,4.8h2.92l-5.7-8.12,7.2-16.24ZM19.25,23.3v-16h3.42c1.7,0,3.03.44,4,1.3.95.88,1.43,2.12,1.43,3.74,0,1.3-.34,2.4-.9,3.25-.54.85-1.3,1.42-2.28,1.72l4.4,5.98h-3.42l-3.9-5.48h-1.32v5.48h-2.02V23.3Zm0,0h2.02v-5.48h1.32c1.4,0,2.5-.4,3.3-1.2s1.2-1.88,1.2-3.24c0-1.1-.3-2.02-.9-2.76s-1.4-.9-2.5-.9h-2.42v13.58h-.02Z"
        fill="#635BFF"
      ></path>
    </svg>
  );

export default function BillingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleManageSubscription = async () => {
        setIsLoading(true);
        try {
            // NOTE: Replace with actual user data
            const { url } = await createStripeCheckoutSession("user_id_123", "user@example.com");
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

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
          <CreditCard /> Billing
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and view your billing history. Payments are securely handled by Stripe.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Pro plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">FitGenius Pro</h3>
                  <p className="text-sm text-muted-foreground">Billed monthly</p>
                </div>
                <p className="text-2xl font-bold">£2.50/month</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Your plan includes access to all AI features, unlimited workout plans, and premium support.</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleManageSubscription} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                Manage Plan on Stripe
            </Button>
            <Button variant="destructive" onClick={handleManageSubscription} disabled={isLoading}>Cancel on Stripe</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Powered by Stripe.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted">
              <StripeIcon className="w-24" />
            </div>
            <Button className="w-full" onClick={handleManageSubscription} disabled={isLoading}>
                <ExternalLink className="mr-2"/>
                Manage payment on Stripe
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your past invoices from Stripe.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                      <span className="sr-only">Download invoice</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
