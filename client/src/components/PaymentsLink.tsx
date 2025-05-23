import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function PaymentsLink() {
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Payment Transactions
            <Button variant="outline" size="sm" onClick={() => window.open('/admin/payments', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </CardTitle>
          <CardDescription>
            View and manage payment transaction data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            The payment transactions feature has been moved to a dedicated page for better performance.
            Click the button above to open the payments dashboard in a new tab.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}