import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function PaymentsLink() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Transactions</CardTitle>
        <CardDescription>
          View revenue and payment details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 bg-amber-50 rounded-md border border-amber-200">
          <div className="flex flex-col gap-4 items-center text-center">
            <div>
              <h3 className="text-lg font-medium text-amber-800">Payment Transactions Dashboard</h3>
              <p className="text-sm text-amber-700 mt-1 max-w-md mx-auto">
                For improved performance and reliability, payment transactions are now available in a dedicated page.
              </p>
            </div>
            <Button 
              onClick={() => window.open('/admin/payments', '_blank')}
              variant="default"
              size="lg"
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Payment Transactions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}