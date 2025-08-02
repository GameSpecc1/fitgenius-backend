"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download } from "lucide-react";

const invoices = [
  { id: "INV001", date: "2023-10-01", amount: "$20.00", status: "Paid" },
  { id: "INV002", date: "2023-09-01", amount: "$20.00", status: "Paid" },
  { id: "INV003", date: "2023-08-01", amount: "$20.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tighter font-headline text-primary">
          <CreditCard /> Billing
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription and view your billing history.
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
                <p className="text-2xl font-bold">$20/month</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Your plan includes access to all AI features, unlimited workout plans, and premium support.</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Change Plan</Button>
            <Button variant="destructive">Cancel Subscription</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Your primary payment method.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
              <CreditCard className="w-8 h-8" />
              <div>
                <p className="font-semibold">Visa ending in 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button className="w-full">Update Payment Method</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
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
